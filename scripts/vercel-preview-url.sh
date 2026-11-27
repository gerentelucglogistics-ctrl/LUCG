#!/usr/bin/env bash
# Respaldo (A10) para obtener la URL del preview de un proyecto de Vercel por SHA de commit.
# Uso: VERCEL_TOKEN=... [VERCEL_TEAM_ID=...] ./scripts/vercel-preview-url.sh <projectId> <sha>
# Escribe url=https://<host> en $GITHUB_OUTPUT (si existe) y lo imprime.
set -euo pipefail
PROYECTO="${1:?uso: vercel-preview-url.sh <projectId> <sha>}"
SHA="${2:?uso: vercel-preview-url.sh <projectId> <sha>}"
: "${VERCEL_TOKEN:?VERCEL_TOKEN requerido}"

EQUIPO=""
[ -n "${VERCEL_TEAM_ID:-}" ] && EQUIPO="&teamId=${VERCEL_TEAM_ID}"
API="https://api.vercel.com/v6/deployments?projectId=${PROYECTO}&limit=20${EQUIPO}"

for _ in $(seq 1 60); do
  resp=$(curl -sf --max-time 30 -H "Authorization: Bearer ${VERCEL_TOKEN}" "$API" || true)
  if [ -n "$resp" ]; then
    host=$(echo "$resp" | jq -r --arg sha "$SHA" \
      '[.deployments[]? | select(.meta.githubCommitSha == $sha) | select((.readyState // .state) == "READY")][0].url // empty')
    if [ -n "$host" ]; then
      echo "url=https://${host}" | tee -a "${GITHUB_OUTPUT:-/dev/null}"
      exit 0
    fi
  fi
  sleep 10
done
echo "No apareció un despliegue de Vercel listo para el commit ${SHA} del proyecto ${PROYECTO} (10 min)." >&2
exit 1
