#!/usr/bin/env bash
# Crea (o actualiza) el usuario de e2e. Solo dev o local: nunca prod.
# Uso: SUPABASE_URL=... SUPABASE_SECRET_KEY=... E2E_USER_ADMIN=... E2E_PASS_ADMIN=... ./scripts/sembrar-usuario-e2e.sh dev|local
set -euo pipefail
ENTORNO="${1:-}"
case "$ENTORNO" in
  dev|local) ;;
  *) echo "Entorno no permitido: '${ENTORNO}'. Solo dev o local (el usuario de e2e nunca se crea en prod)." >&2; exit 1 ;;
esac
: "${SUPABASE_URL:?SUPABASE_URL requerido}"
: "${SUPABASE_SECRET_KEY:?SUPABASE_SECRET_KEY requerido}"
: "${E2E_USER_ADMIN:?E2E_USER_ADMIN requerido}"
: "${E2E_PASS_ADMIN:?E2E_PASS_ADMIN requerido}"

BASE="${SUPABASE_URL%/}/auth/v1/admin/users"
cuerpo=$(jq -n --arg e "$E2E_USER_ADMIN" --arg p "$E2E_PASS_ADMIN" \
  '{email:$e,password:$p,email_confirm:true,app_metadata:{org_tipo:"lucg",roles:["superadministrador"]}}')
salida=$(mktemp)
trap 'rm -f "$salida"' EXIT

llamar() { # metodo url cuerpo
  curl -s -o "$salida" -w '%{http_code}' -X "$1" "$2" \
    -H "apikey: ${SUPABASE_SECRET_KEY}" -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
    -H "Content-Type: application/json" -d "$3"
}

codigo=$(llamar POST "$BASE" "$cuerpo")
case "$codigo" in
  200|201) echo "usuario de e2e listo"; exit 0 ;;
  422) ;; # ya existe: se actualiza
  *) echo "Error HTTP ${codigo} al crear el usuario de e2e" >&2; exit 1 ;;
esac

lista=$(curl -sf -H "apikey: ${SUPABASE_SECRET_KEY}" -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  "${BASE}?page=1&per_page=200") || { echo "Error al listar usuarios" >&2; exit 1; }
id=$(echo "$lista" | jq -r --arg e "$E2E_USER_ADMIN" '[.users[]? | select(.email == $e)][0].id // empty')
[ -n "$id" ] || { echo "El usuario existe pero no se encontró su id" >&2; exit 1; }
cuerpo_put=$(jq -n --arg p "$E2E_PASS_ADMIN" '{password:$p,email_confirm:true,app_metadata:{org_tipo:"lucg",roles:["superadministrador"]}}')
codigo=$(llamar PUT "${BASE}/${id}" "$cuerpo_put")
[ "$codigo" = "200" ] || { echo "Error HTTP ${codigo} al actualizar el usuario de e2e" >&2; exit 1; }
echo "usuario de e2e listo"
