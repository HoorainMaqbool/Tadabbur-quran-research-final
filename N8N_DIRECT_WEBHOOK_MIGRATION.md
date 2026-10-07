# Tadabbur: direct five-webhook migration

This is the concrete backend change list for the direct-webhook architecture.

## Why the previous deployed request failed

The deployed frontend used browser `fetch()` to call the router URL. `TypeError: Failed to fetch` with zero n8n executions means the browser did not complete the HTTP request. The main causes are a wrong/unreachable URL, TLS/network failure, or CORS/preflight rejection. In this project the frontend sends JSON, so the browser can perform a CORS preflight before the POST. If the preflight is rejected, n8n never starts the workflow execution.

Direct webhooks remove the router as an additional failure point, but CORS still must be configured correctly on each webhook.

## Do this for each feature workflow

Replace the current `Manual Trigger` or internal `Execute Workflow Trigger` ONLY at the public entry of the feature workflow with a `Webhook` node.

Keep all existing feature logic below it.

Immediately after the Webhook, add an `Edit Fields` (Set) node named `Map Webhook Body` using manual mapping. This prevents a trigger-shape change from forcing you to rewrite the existing nodes. n8n Webhook request fields are available under `$json.body`.

Set Webhook:

- HTTP Method: POST
- Authentication: None
- Respond: Using 'Respond to Webhook' Node
- Options → Allowed Origins (CORS): exact Netlify origin, e.g. `https://YOUR-SITE.netlify.app`

At the end of the workflow, connect the final structured response to a `Respond to Webhook` node.
Set Respond With = First Incoming Item if the final node outputs one JSON item, or JSON with the final response object if that is how the workflow is currently structured.

## 1. Quran Research

Suggested production path:
`/webhook/tadabbur/research`

Map:
- `requested_feature` = `{{$json.body.requested_feature}}`
- `question` = `{{$json.body.question}}`
- `language` = `{{$json.body.language}}`

Preserve the existing research normalization/validation/retrieval/evidence/citation logic.

IMPORTANT: the final frontend currently sends `requested_feature: "research"` for this feature. Because the final locked architecture does not explicitly freeze the literal string, verify the existing research workflow's current validation value before publishing. If it currently expects `quran_research`, change only the frontend constant or the validation value so they match exactly.

## 2. Topic Explorer

Suggested production path:
`/webhook/tadabbur/topic`

Map:
- `requested_feature` = `{{$json.body.requested_feature}}`
- `question` = `{{$json.body.question}}`
- `topic` = `{{$json.body.topic}}`
- `language` = `{{$json.body.language}}`

Preserve topic interpretation → semantic retrieval → evidence guard → synthesis logic.

## 3. Ayah Deep Dive

Suggested production path:
`/webhook/tadabbur/ayah-deep-dive`

Map:
- `requested_feature` = `{{$json.body.requested_feature}}`
- `question` = `{{$json.body.question}}`
- `ayah_reference` = `{{$json.body.ayah_reference}}`
- `language` = `{{$json.body.language}}`

The known working post-normalization contract is:
`requested_feature`, `question`, `ayah_reference`, `language`.

Preserve the existing exact lookup/evidence/deep-dive logic.

## 4. Personalized 

Suggested production path:
`/webhook/tadabbur/learning-plan`

Map:
- `requested_feature` = `{{$json.body.requested_feature}}`
- `surah` = `{{$json.body.surah}}`
- `start_ayah` = `{{$json.body.start_ayah}}`
- `end_ayah` = `{{$json.body.end_ayah}}`
- `minutes_per_day` = `{{$json.body.minutes_per_day}}`
- `explanation_depth` = `{{$json.body.explanation_depth}}`
- `language` = `{{$json.body.language}}`

The recent smoke test confirmed the normalized values work with:
`requested_feature=learning_plan`, `surah=Al-Baqarah`, `start_ayah=153`, `end_ayah=155`, `minutes_per_day=20`, `language=en`.

Preserve the existing range validation, quran-translation-final1 evidence guard, generation and output validation.

## 5. 

Suggested production path:
`/webhook/tadabbur/quiz`

One webhook can handle both quiz generation and answer submission because the existing quiz workflow already has generation/submission branching.

Map every field your current  workflow uses. At minimum preserve:
- `requested_feature` = `{{$json.body.requested_feature}}`
- `action` = `{{$json.body.action}}`
- `language` = `{{$json.body.language}}`
- `studied_material` = `{{$json.body.studied_material}}`
- `quiz_id` = `{{$json.body.quiz_id}}`
- `answers` = `{{$json.body.answers}}`

Do NOT expose the sealing secret. Keep the server-side `sealing_secret` in the existing n8n  configuration.

## Frontend ↔ n8n endpoint mapping

Set exactly these five Netlify variables:

- `VITE_N8N_RESEARCH_URL` → production research webhook
- `VITE_N8N_TOPIC_URL` → production topic webhook
- `VITE_N8N_DEEP_DIVE_URL` → production deep-dive webhook
- `VITE_N8N_LEARNING_PLAN_URL` → production learning-plan webhook
- `VITE_N8N_QUIZ_URL` → production quiz webhook

Do not keep `VITE_N8N_ENTRY_URL` after moving to this direct architecture.

## Delete the old router

Do not delete `WF_ENTRY_ROUTER` until all five direct production webhooks return successfully from the deployed frontend. Deactivate it first. Once the five direct paths have passed integration testing, delete it if you still want the repository/workspace fully clean.
