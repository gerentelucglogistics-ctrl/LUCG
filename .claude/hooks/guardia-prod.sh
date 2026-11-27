#!/usr/bin/env bash
# Hook PreToolUse (Bash): en modo YOLO el agente no publica en prod ni toca main.
# Bloquea solo acciones, no menciones: un grep o un commit que diga "prod" pasa.
cmd=$(python3 -c 'import sys,json;print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)
bloquear() { echo "Bloqueado en modo YOLO: $1. Prod y main los maneja el desarrollador principal a mano." >&2; exit 2; }
re() { printf '%s' "$cmd" | grep -Eqi -- "$1"; }

re '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]](--force|-f|--force-with-lease)([[:space:]]|$)' && bloquear "git push forzado"
re '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]:](main)([[:space:]]|$)' && bloquear "push a main"
re '(^|[;&|[:space:]])gh[[:space:]]+pr[[:space:]]+merge' && bloquear "fusionar PR a mano (usa 'just cierre-fase', que solo fusiona hacia dev)"
re '(^|[;&|[:space:]])gh[[:space:]]+pr[[:space:]]+create[^;&|]*--base[[:space:]=]+main' && bloquear "PR hacia main"
re '(^|[;&|[:space:]])gh[[:space:]]+workflow[[:space:]]+run[^;&|]*deploy-prod' && bloquear "lanzar el despliegue a prod"
re '(^|[;&|[:space:]])(vercel|railway|fly|flyctl|supabase)[[:space:]][^;&|]*(--prod([[:space:]]|$)|--environment[[:space:]=]+prod|production|produccion)' && bloquear "comando de infraestructura contra prod"
re '(^|[;&|])[[:space:]]*supabase[[:space:]]+(db[[:space:]]+(reset|push)|migration[[:space:]]+(up|repair|list))[^;&|]*(--remote|--linked|--db-url)' && bloquear "base remota: las migraciones remotas solo las aplica migrate.yml (D-16)"
re '(^|[;&|])[[:space:]]*supabase[[:space:]]+link' && bloquear "enlazar un proyecto alojado (solo CI)"
re '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]:]dev([[:space:]]|$)' && bloquear "push directo a dev (solo por PR con cierre-fase)"
exit 0
