# Tadabbur Frontend

Three-feature frontend for the completed Tadabbur backend:

1. Quran Research
2. Topic Explorer
3. Ayah Deep Dive

Languages exposed in the UI:
- English
- Roman Urdu

Urdu is intentionally not exposed in this frontend release.

The UI renders the structured backend result only. Raw n8n response bodies, HTTP processing details, and response headers are not shown to end users.

Production environment variables:
- `VITE_N8N_RESEARCH_URL`
- `VITE_N8N_TOPIC_URL`
- `VITE_N8N_DEEP_DIVE_URL`
