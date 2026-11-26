#!/usr/bin/env bash
# Humo contra un entorno: ./scripts/smoke.sh dev|prod
# Lee BASE_URL_API, BASE_URL_WEB, BASE_URL_DRIVER del entorno (o de .env.<entorno> si existe).
set -euo pipefail
ENTORNO="${1:-dev}"
[ -f ".env.${ENTORNO}" ] && set -a && . ".env.${ENTORNO}" && set +a
: "${BASE_URL_API:?BASE_URL_API requerido}"
: "${BASE_URL_WEB:?BASE_URL_WEB requerido}"
: "${BASE_URL_DRIVER:?BASE_URL_DRIVER requerido}"

echo "== Humo en ${ENTORNO} =="
salud=$(curl -sf "${BASE_URL_API}/api/v1/health")
echo "API: ${salud}"
echo "${salud}" | grep -q '"status": *"ok"' || { echo "API no saludable"; exit 1; }
for u in "$BASE_URL_WEB" "$BASE_URL_DRIVER"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
  echo "${u} -> ${code}"
  [ "$code" = "200" ] || { echo "App no responde 200"; exit 1; }
done
curl -sf "${BASE_URL_DRIVER}/manifest.webmanifest" >/dev/null && echo "PWA: manifiesto presente"
echo "== Humo OK =="
