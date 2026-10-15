// Anthropic SDK through the Sparring Gateway — one line changes (baseURL). Node 20+.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://app.sparringhq.com/api/v1/models/anthropic",
  apiKey: process.env.SPARRING_API_KEY,            // your Sparring key, not a provider key
});

const { data, response } = await client.messages
  .create({ model: "gemini-4-argon", max_tokens: 100, messages: [{ role: "user", content: "Say hello in one sentence." }] })   // default model: Gemini 4 on Vertex AI; claude-* models also accepted on this wire
  .withResponse();

console.log(data.content[0].text);
console.log({
  guardrail: response.headers.get("x-sparring-guardrail"),   // pass | flag:<rules> | block:<rules>
  upstream: response.headers.get("x-sparring-upstream"),     // vertex | byok | managed | official
  credits: response.headers.get("x-sparring-credits"),       // model tokens at list price (0 for BYOK)
  cu: response.headers.get("x-sparring-cu"),                 // Conversation Units billed for this request
  requestId: response.headers.get("x-request-id"),
});
