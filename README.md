# Sparring examples

Minimal, runnable examples for the [Sparring Gateway and API](https://sparringhq.com/docs/).

| Example | What it shows |
|---|---|
| [`gateway/node-anthropic.mjs`](gateway/node-anthropic.mjs) | Connect the Anthropic SDK through the gateway with one line; read the `X-Sparring-*` headers |
| [`gateway/node-openai.mjs`](gateway/node-openai.mjs) | Same with the OpenAI SDK (Chat Completions) |
| [`gateway/python-openai.py`](gateway/python-openai.py) | Python `openai` client through the gateway |
| [`gateway/fail-open.mjs`](gateway/fail-open.mjs) | Fail-open pattern: check `/v1/health`, fall back to the provider directly if the gateway is unreachable |
| [`gateway/handle-guardrail-block.mjs`](gateway/handle-guardrail-block.mjs) | What a `422 guardrail_blocked` looks like and how to handle it |
| [`api/evaluate.sh`](api/evaluate.sh) | `POST /v1/evaluate` — evidence-based judgment of a transcript with cURL |
| [`api/findings.sh`](api/findings.sh) | `GET /v1/findings` — async evaluation findings on gateway traffic |
| [`ci/github-actions-evaluate-gate.yml`](ci/github-actions-evaluate-gate.yml) | Release gate in GitHub Actions: score CI transcripts with `/v1/evaluate`, fail on critical breaches |

## Setup

1. Sign in at https://app.sparringhq.com, open **Settings → Developer**, create an API key (shown once).
2. `export SPARRING_API_KEY=sk_...`
3. Run any example. Node examples need Node 20+ and the provider SDK (`npm i @anthropic-ai/sdk openai`); Python needs `pip install openai`.

Every gateway response carries `X-Sparring-Guardrail` (pass · flag:<rules> · block:<rules>), `X-Sparring-Upstream` (byok · managed · official), `X-Sparring-Credits` (model tokens at list; 0 for BYOK), `X-Sparring-CU` (Conversation Units for assurance work) and `X-Request-Id`.

Model tokens pass through at the provider's list price. Assurance work is metered in Conversation Units (1 CU = US$0.02). Details: https://sparringhq.com/pricing/

MIT © Carnegie Intelligent Technology Limited
