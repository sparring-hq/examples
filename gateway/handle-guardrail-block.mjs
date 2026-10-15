// When your organisation's guardrail policy is in `block` mode, a critical hit on the REQUEST returns HTTP 422:
//
//   HTTP/1.1 422 Unprocessable Entity
//   X-Sparring-Guardrail: block:pii.card_number
//   { "error": { "type": "guardrail_blocked", "message": "...", "rules": ["pii.card_number"], "request_id": "req_..." } }
//
// A critical hit on a non-streamed RESPONSE returns 200 with the completion replaced by a safe refusal and
// X-Sparring-Guardrail: block:<rule>. Streams are never cut; they are flagged and evaluated instead.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ baseURL: "https://app.sparringhq.com/api/v1/models/anthropic", apiKey: process.env.SPARRING_API_KEY });

try {
  const r = await client.messages.create({ model: "gemini-4-argon", max_tokens: 50, messages: [{ role: "user", content: "My card is 4111 1111 1111 1111, confirm it." }] });
  console.log(r.content[0].text);
} catch (e) {
  if (e?.status === 422 && e?.error?.error?.type === "guardrail_blocked") {
    const rules = e.error.error.rules;                           // e.g. ["pii.card_number"]
    console.log("Blocked by policy:", rules.join(", "), "— ask the user to remove sensitive data and retry.");
    // Do NOT fall back to the provider here: this is your own policy, not an outage.
  } else throw e;
}
