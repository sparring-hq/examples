// OpenAI SDK (Chat Completions) through the Sparring Gateway. Node 20+.
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://app.sparringhq.com/api/v1/models/openai/v1",
  apiKey: process.env.SPARRING_API_KEY,
});

const { data, response } = await client.chat.completions
  .create({ model: "gpt-5.6-sol", max_completion_tokens: 100, messages: [{ role: "user", content: "Say hello in one sentence." }] })
  .withResponse();

console.log(data.choices[0].message.content);
console.log("guardrail:", response.headers.get("x-sparring-guardrail"), "| upstream:", response.headers.get("x-sparring-upstream"), "| CU:", response.headers.get("x-sparring-cu"));

// Streaming passes through chunk by chunk; the guardrail verdict for the response is evaluated post-hoc
// (streams are never cut mid-flight) and reported in X-Sparring-Guardrail with ";response=post-hoc".
