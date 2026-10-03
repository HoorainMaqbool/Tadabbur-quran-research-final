# Tadabbur Quran Research

Frontend for three direct n8n-backed study features:

1. Research
2. Topic Explorer
3. Ayah Deep Dive

## Netlify environment variables

- `VITE_N8N_RESEARCH_URL`
- `VITE_N8N_TOPIC_URL`
- `VITE_N8N_DEEP_DIVE_URL`

These are endpoint URLs, not secrets. Never place provider API keys or n8n credentials in Vite variables.

## Backend response handling

Every feature preserves the raw HTTP response body returned by n8n and displays it unchanged in the UI. Non-2xx responses keep their status, headers, and raw body. Browser/network failures are the only cases where the frontend must create its own message because there is no backend HTTP response to display.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
