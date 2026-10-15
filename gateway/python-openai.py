"""OpenAI Python client through the Sparring Gateway. pip install openai"""
import os
from openai import OpenAI

client = OpenAI(base_url="https://app.sparringhq.com/api/v1/models/openai/v1", api_key=os.environ["SPARRING_API_KEY"])

raw = client.chat.completions.with_raw_response.create(
    model="gemini-4-argon", max_completion_tokens=100,  # default: Gemini 4 on Vertex AI
    messages=[{"role": "user", "content": "Say hello in one sentence."}],
)
completion = raw.parse()
print(completion.choices[0].message.content)
print("guardrail:", raw.headers.get("x-sparring-guardrail"), "| upstream:", raw.headers.get("x-sparring-upstream"), "| CU:", raw.headers.get("x-sparring-cu"))
