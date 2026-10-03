const urls = {
  research: import.meta.env.VITE_N8N_RESEARCH_URL,
  topic_explorer: import.meta.env.VITE_N8N_TOPIC_URL,
  ayah_deep_dive: import.meta.env.VITE_N8N_DEEP_DIVE_URL,
  learning_plan: import.meta.env.VITE_N8N_LEARNING_PLAN_URL,
  quiz: import.meta.env.VITE_N8N_QUIZ_URL,
};

const features = ['research', 'topic_explorer', 'ayah_deep_dive', 'learning_plan', 'quiz'];

const envNames = {
  research: 'VITE_N8N_RESEARCH_URL',
  topic_explorer: 'VITE_N8N_TOPIC_URL',
  ayah_deep_dive: 'VITE_N8N_DEEP_DIVE_URL',
  learning_plan: 'VITE_N8N_LEARNING_PLAN_URL',
  quiz: 'VITE_N8N_QUIZ_URL',
};

export function featureUrl(feature) {
  return urls[feature] || '';
}

function parseBody(rawBody) {
  if (!rawBody) return null;
  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

export class BackendResponseError extends Error {
  constructor({ feature, status, statusText, rawBody, parsedBody, headers }) {
    super(`n8n returned HTTP ${status}${statusText ? ` ${statusText}` : ''}.`);
    this.name = 'BackendResponseError';
    this.feature = feature;
    this.status = status;
    this.statusText = statusText || '';
    this.rawBody = rawBody;
    this.parsedBody = parsedBody;
    this.headers = headers;
  }
}

export async function callFeature(feature, payload) {
  if (!features.includes(feature)) throw new Error('Unknown feature.');

  const url = featureUrl(feature);
  if (!url) {
    throw new Error(`This feature is not connected yet. Add ${envNames[feature]} in Netlify.`);
  }

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
    throw new Error('The browser could not reach the n8n webhook. No backend HTTP response was received.');
  }

  // Read the response body as text first so the exact body returned by n8n is preserved.
  // Do not replace it with a frontend-generated error message.
  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch (err) {
    throw new Error(`The browser received HTTP ${response.status}, but could not read the backend response body.`);
  }

  const parsedBody = parseBody(rawBody);
  const headers = Object.fromEntries(response.headers.entries());
  const result = {
    feature,
    ok: response.ok,
    status: response.status,
    statusText: response.statusText || '',
    contentType: response.headers.get('content-type') || '',
    headers,
    rawBody,
    data: parsedBody,
  };

  if (!response.ok) {
    throw new BackendResponseError({
      feature,
      status: response.status,
      statusText: response.statusText,
      rawBody,
      parsedBody,
      headers,
    });
  }

  return result;
}

export function saveSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadSession(key, fallback = null) {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
