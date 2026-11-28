#!/usr/bin/env bash
# Comprueba que el registro público de Supabase está cerrado (D-19, T-0.1-36).
# Uso: ./scripts/registro-cerrado.sh dev|prod. Solo lectura más un signup que nunca crea usuarios.
# Lee SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY (en dev también E2E_SUPABASE_*). Nunca imprime la clave.
set -euo pipefail
ENTORNO="${1:?uso: registro-cerrado.sh dev|prod}"
url="${SUPABASE_URL:-${E2E_SUPABASE_URL:-}}"
clave="${SUPABASE_PUBLISHABLE_KEY:-${E2E_SUPABASE_PUBLISHABLE_KEY:-}}"

if [ -z "$url" ] || [ -z "$clave" ]; then
  if [ "$ENTORNO" = "prod" ]; then
    echo "faltan SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY para prod" >&2
    exit 1
  fi
  echo "registro no verificado en ${ENTORNO} (faltan variables)"
  exit 0
fi

# (1) Configuración pública de Auth: disable_signup debe ser true.
if ! curl -sf --max-time 15 -H "apikey: ${clave}" "${url}/auth/v1/settings" \
  | jq -e '.disable_signup == true' >/dev/null; then
  echo "Registro público abierto en ${ENTORNO} (disable_signup no es true)" >&2
  exit 1
fi

# (2) Intento de signup con clave vacía y correo .invalid: nunca puede crear un usuario.
cuerpo="$(mktemp)"
trap 'rm -f "$cuerpo"' EXIT
codigo=$(curl -s --max-time 15 -o "$cuerpo" -w '%{http_code}' -X POST \
  -H "apikey: ${clave}" -H 'Content-Type: application/json' \
  --data '{"email":"humo-registro@example.invalid","password":""}' \
  "${url}/auth/v1/signup" || true)
if ! jq -e '.error_code == "signup_disabled"' "$cuerpo" >/dev/null 2>&1; then
  echo "Registro público abierto en ${ENTORNO} (signup respondió HTTP ${codigo})" >&2
  exit 1
fi

echo "Registro público cerrado en ${ENTORNO} (disable_signup=true, signup_disabled)"
