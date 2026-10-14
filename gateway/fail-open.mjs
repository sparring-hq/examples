// Fail-open: Sparring must never be your single point of failure.
// Decide once per process (and re-check on a timer or after a gateway 5xx) whether to route through the gateway.
import Anthropic from "@anthropic-ai/sdk";

const GATEWAY = "https://app.sparringhq.com/api/v1";

async function gatewayHealthy() {
  try {
    const r = await fetch(`${GATEWAY}/health`, { signal: AbortSignal.timeout(2000) });   // no auth, not billed
    if (!r.ok) return false;
    const j = await r.json();                                   // { status: "ok" | "degraded" | "down", channels: {...} }
    return j.status !== "down";
  } catch { return false; }
}

export async function makeClient() {
  if (await gatewayHealthy()) {
    return new Anthropic({ baseURL: `${GATEWAY}/models/anthropic`, apiKey: process.env.SPARRING_API_KEY });
  }
  console.warn("Sparring gateway unreachable — falling back to the provider directly (no guardrails/logging for this window)");
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// On a gateway-side error during a call, retry once directly against the provider:
export async function createWithFallback(params) {
  try {
    const gw = new Anthropic({ baseURL: `${GATEWAY}/models/anthropic`, apiKey: process.env.SPARRING_API_KEY });
    return await gw.messages.create(params);
  } catch (e) {
    if (e?.status === 422) throw e;                              // guardrail_blocked is a policy decision, not an outage — do not bypass it
    const direct = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return await direct.messages.create(params);
  }
}
