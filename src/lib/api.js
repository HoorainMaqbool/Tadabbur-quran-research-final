const urls = {
  research: import.meta.env.VITE_N8N_RESEARCH_URL,
  topic_explorer: import.meta.env.VITE_N8N_TOPIC_URL,
  ayah_deep_dive: import.meta.env.VITE_N8N_DEEP_DIVE_URL,
};

const features = ['research','topic_explorer','ayah_deep_dive'];

export function featureUrl(feature){ return urls[feature] || ''; }

function envName(feature){
  return feature==='research'
    ? 'VITE_N8N_RESEARCH_URL'
    : feature==='topic_explorer'
      ? 'VITE_N8N_TOPIC_URL'
      : 'VITE_N8N_DEEP_DIVE_URL';
}

export async function callFeature(feature, payload){
  if(!features.includes(feature)) throw new Error('Unknown feature.');

  const url = featureUrl(feature);
  if(!url) throw new Error(`This feature is not connected yet. Add ${envName(feature)} in Netlify.`);

  let response;
  try {
    response = await fetch(url, {
      method:'POST',
      mode:'cors',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    });
  } catch(err) {
    console.error('Tadabbur fetch failed', {feature, error:err});
    throw new Error('The browser could not reach the n8n webhook. Check the production webhook URL and CORS/Allowed Origins setting.');
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if(!response.ok){
    const message =
      data?.error_message ||
      data?.message ||
      data?.error ||
      `The request could not be completed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return data;
}

export function saveSession(key,value){
  try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}
}

export function loadSession(key,fallback=null){
  try{return JSON.parse(sessionStorage.getItem(key)) ?? fallback;}catch{return fallback;}
}
