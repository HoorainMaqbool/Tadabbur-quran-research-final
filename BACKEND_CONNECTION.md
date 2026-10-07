# Direct n8n Webhook Connection

Each feature workflow is exposed as its own POST production webhook.

Suggested paths:

- `/webhook/tadabbur/research`
- `/webhook/tadabbur/topic`
- `/webhook/tadabbur/ayah-deep-dive`
- `/webhook/tadabbur/learning-plan`
- `/webhook/tadabbur/quiz`

For each n8n workflow:
1. Webhook trigger, POST.
2. Authentication: None unless you deliberately add a backend credential mechanism.
3. Add Option → Allowed Origins (CORS) → set to the exact Netlify site origin.
4. Add/Edit Fields immediately after the Webhook to map `body.*` back to the field names the existing workflow expects.
5. Set response to `Using Respond to Webhook node` if using a Respond to Webhook node at the end.
6. Return the final structured workflow JSON.

Webhook request JSON is nested under `body` in n8n webhook executions. The mapping node is important so existing nodes do not need to be rewritten.

Do not put Pinecone keys, LLM keys, n8n credentials, or the  sealing secret into the frontend.
