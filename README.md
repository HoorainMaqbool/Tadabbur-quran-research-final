# Tadabbur — Quran Research & Learning Assistant

Mobile-first React/Vite frontend for the five-feature Tadabbur project:

1. Quran Research
2. Topic Explorer
3. Ayah Deep Dive
4. Personalized Learning Plan
5. Quiz

## Architecture
The frontend explicitly selects the feature and calls that feature's n8n production webhook directly. There is no frontend AI router and no backend universal AI manager.

Quran retrieval, Pinecone, evidence validation, AI synthesis and private credentials remain in n8n.

## Netlify environment variables
Set these five variables in Netlify:

- `VITE_N8N_RESEARCH_URL`
- `VITE_N8N_TOPIC_URL`
- `VITE_N8N_DEEP_DIVE_URL`
- `VITE_N8N_LEARNING_PLAN_URL`
- `VITE_N8N_QUIZ_URL`

These are endpoint URLs, not secrets. Never place provider API keys or the quiz sealing secret in VITE variables.

## Feature payloads
The UI sends `requested_feature` with the direct feature request so the existing workflow input contract is preserved.

Research:
`{ requested_feature: "research", question, language }`

Topic Explorer:
`{ requested_feature: "topic_explorer", topic, language }`

Ayah Deep Dive:
`{ requested_feature: "ayah_deep_dive", question, ayah_reference, language }`

Learning Plan:
`{ requested_feature: "learning_plan", surah, start_ayah, end_ayah, minutes_per_day, language }`

Quiz generation:
`{ requested_feature: "quiz", action: "generate", language, studied_material }`

Quiz submission:
`{ requested_feature: "quiz", action: "submit", language, quiz_id, answers }`

## Local development
`npm install`
`npm run dev`

## Build
`npm run build`
