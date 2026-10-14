#!/usr/bin/env bash
# GET /v1/findings — async evaluation findings on gateway traffic (not billable). Filters: limit, since (ISO), worst (critical|major|minor).
set -euo pipefail
curl -sS "https://app.sparringhq.com/api/v1/findings?limit=20&worst=critical" \
  -H "Authorization: Bearer ${SPARRING_API_KEY:?set SPARRING_API_KEY}" | python3 -m json.tool
