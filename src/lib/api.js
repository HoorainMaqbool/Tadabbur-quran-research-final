const urls = {
  research: import.meta.env.VITE_N8N_RESEARCH_URL,
  topic_explorer: import.meta.env.VITE_N8N_TOPIC_URL,
  ayah_deep_dive: import.meta.env.VITE_N8N_DEEP_DIVE_URL,
  learning_plan: import.meta.env.VITE_N8N_LEARNING_PLAN_URL,
  quiz: import.meta.env.VITE_N8N_QUIZ_URL,
};

const features = ['research','topic_explorer','ayah_deep_dive','learning_plan','quiz'];
export function featureUrl(feature){ return urls[feature] || ''; }

export async function callFeature(feature, payload){
  if(!features.includes(feature)) throw new Error('Unknown feature.');
  const url = featureUrl(feature);
  if(!url) throw new Error(`This feature is not connected yet. Add VITE_N8N_${feature==='research'?'RESEARCH':feature==='topic_explorer'?'TOPIC':feature==='ayah_deep_dive'?'DEEP_DIVE':feature==='learning_plan'?'LEARNING_PLAN':'QUIZ'}_URL in Netlify.`);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Tadabbur fetch failed', { feature, url, error: err });
    throw new Error('The browser could not reach the n8n webhook. This is usually a webhook URL, HTTPS, network, or CORS issue. Check the n8n Webhook → Allowed Origins (CORS) setting for this Netlify domain.');
  }
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if(!response.ok){
    const message = data?.error_message || data?.message || data?.error || `n8n returned HTTP ${response.status}.`;
    throw new Error(message);
  }
  return data;
}

export function saveSession(key,value){ try{sessionStorage.setItem(key,JSON.stringify(value));}catch{} }
export function loadSession(key,fallback=null){ try{return JSON.parse(sessionStorage.getItem(key)) ?? fallback;}catch{return fallback;} }
