#!/usr/bin/env bash
# Humo contra un entorno: ./scripts/smoke.sh dev|prod
# Lee BASE_URL_API, BASE_URL_WEB, BASE_URL_DRIVER (y BASE_URL_SITE si existe) del entorno o de .env.<entorno>.
# La cabecera de bypass de Vercel solo se manda a dominios de Vercel, nunca a la API.
set -euo pipefail
ENTORNO="${1:-dev}"
[ -f ".env.${ENTORNO}" ] && set -a && . ".env.${ENTORNO}" && set +a
: "${BASE_URL_API:?BASE_URL_API requerido}"
: "${BASE_URL_WEB:?BASE_URL_WEB requerido}"
: "${BASE_URL_DRIVER:?BASE_URL_DRIVER requerido}"

# curl_vercel <variable-de-bypass> <args de curl...>
curl_vercel() {
  local var="$1"; shift
  local valor="${!var:-}"
  if [ -n "$valor" ]; then
    curl -H "x-vercel-protection-bypass: ${valor}" "$@"
  else
    curl "$@"
  fi
}

echo "== Humo en ${ENTORNO} =="
salud=$(curl -sf "${BASE_URL_API}/api/v1/health")
echo "API: ${salud}"
echo "${salud}" | grep -q '"status": *"ok"' || { echo "API no saludable"; exit 1; }
echo "${salud}" | grep -q '"db": *true' || { echo "API sin conexión a la base"; exit 1; }

verificar() { # nombre url variable-de-bypass
  local code
  # -L: el dominio raíz redirige a www (308); cuenta el código final.
  code=$(curl_vercel "$3" -sL -o /dev/null -w '%{http_code}' "$2")
  echo "$1 ${2} -> ${code}"
  [ "$code" = "200" ] || { echo "$1 no responde 200"; exit 1; }
}
verificar Web "$BASE_URL_WEB" VERCEL_BYPASS_WEB
verificar Driver "$BASE_URL_DRIVER" VERCEL_BYPASS_DRIVER
[ -z "${BASE_URL_SITE:-}" ] || verificar Sitio "$BASE_URL_SITE" VERCEL_BYPASS_SITE

code=$(curl_vercel VERCEL_BYPASS_DRIVER -s -o /dev/null -w '%{http_code}' "${BASE_URL_DRIVER}/manifest.webmanifest")
[ "$code" = "200" ] || { echo "PWA: el manifiesto no responde 200 (${code})"; exit 1; }
echo "PWA: manifiesto presente"
echo "== Humo OK =="
