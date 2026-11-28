#!/usr/bin/env bash
# Hook PreToolUse (Bash): el agente (bot) fusiona a dev solo con scripts/fusionar-dev.sh; no fusiona, aprueba ni administra main/prod (ADR-009).
# Bloquea acciones; una frase protegida citada tras comillas, ( , $( o backtick también se bloquea a propósito (falla cerrado):
# las comprobaciones usan [[:space:]] en lugar del espacio (gh[[:space:]]pr[[:space:]]merge). Un comando compuesto que mezcla una
# lectura y una escritura protegida también se bloquea. No es una frontera de seguridad: código ejecutado desde archivos no se ve (R1).
# Regresión: scripts/tests/guardia.test.sh
cmd=$(python3 -c 'import sys,json;print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)
bloquear() { echo "Bloqueado: $1. Prod y main los maneja el desarrollador; dev se fusiona con scripts/fusionar-dev.sh." >&2; exit 2; }
re() { printf '%s' "$cmd" | grep -Eqi -- "$1"; }

# Delimitador previo a un comando: inicio, ; & |, espacio, comillas, ( , $( , backtick o ruta absoluta (/opt/homebrew/bin/gh).
D='(^|[;&|[:space:]'"'"'"(`/])'

# gh api de escritura: método explícito distinto de GET, o campos/entrada (-f -F --field --raw-field --input) que fuerzan POST.
escritura_gh() {
  re "${D}gh[[:space:]]+api[[:space:]]" || return 1
  re '(-X|--method)[[:space:]=]*GET([[:space:]]|$)' && return 1
  re '(-X|--method)[[:space:]=]*(POST|PUT|PATCH|DELETE)' && return 0
  re '[[:space:]](-f|-F|--field|--raw-field|--input)([[:space:]=]|[^[:space:]-])'
}
# curl/wget/http/xh contra api.github.com o uploads.github.com con cuerpo o método de escritura.
escritura_http() {
  re "${D}(curl|wget|http|xh)[[:space:]]" || return 1
  re '(api|uploads)\.github\.com' || return 1
  re '[[:space:]](-X[[:space:]]*(POST|PUT|PATCH|DELETE)|--request|--method|-d|--data[a-z-]*|-F|--form|--json|-T|--upload-file|--post-data|--post-file)([[:space:]=]|$)'
}

# Rutas de GitHub que nunca se escriben desde el agente: fusión, despliegues, main, refs, contenido, entornos prod y administración.
RUTAS='pulls/[0-9]+/merge|actions/runs/[0-9]+/(pending_deployments|rerun|rerun-failed-jobs|deployment_protection_rule)|actions/workflows/(deploy-prod|migrate)[^/[:space:]]*/dispatches|branches/main|git/refs|/merges|/contents/|environments/(prod|Production)|/rulesets|/collaborators|repos/[^/[:space:]]+/[^/[:space:]"'"'"']+([[:space:]"'"'"']|$)'
if { escritura_gh || escritura_http; } && re "$RUTAS"; then
  bloquear "escritura en GitHub sobre main, prod o la administración del repo"
fi

# GraphQL: mutaciones de fusión, aprobación, refs y protección.
if re "${D}gh[[:space:]]+api[[:space:]]+graphql" && re 'mutation' \
  && re '(mergePullRequest|enablePullRequestAutoMerge|approveDeployments|rejectDeployments|mergeBranch|updateRef|updateRefs|createCommitOnBranch|createRef|deleteRef|BranchProtectionRule|Ruleset|Environment|addPullRequestReview|submitPullRequestReview|dismissPullRequestReview)'; then
  bloquear "mutación GraphQL de fusión, aprobación o protección"
fi

# Secretos, variables y workflows.
re "${D}gh[[:space:]]+(secret|variable)[[:space:]]+(set|delete|remove)[^;&|]*(-e|--env)([[:space:]]+|=)(prod|Production)([[:space:]]|$)" && bloquear "secretos o variables del entorno prod"
re "${D}gh[[:space:]]+workflow[[:space:]]+run[^;&|]*migrate[^;&|]*prod" && bloquear "migrar prod a mano"
re "${D}gh[[:space:]]+workflow[[:space:]]+(enable|disable)" && bloquear "activar o desactivar workflows"
re "${D}gh[[:space:]]+workflow[[:space:]]+run[^;&|]*deploy-prod" && bloquear "lanzar el despliegue a prod"

# Pull requests: aprobar, fusionar a mano (salvo la ayuda) y apuntar a main.
re "${D}gh[[:space:]]+pr[[:space:]]+review[^;&|]*(--approve|-a([[:space:]]|$))" && bloquear "aprobar PRs"
if re "${D}gh[[:space:]]+pr[[:space:]]+merge" && ! re '^[[:space:]]*gh[[:space:]]+pr[[:space:]]+merge[[:space:]]+(--help|-h)[[:space:]]*$'; then
  bloquear "fusionar PR a mano (usa scripts/fusionar-dev.sh, que solo fusiona PRs del bot hacia dev)"
fi
re "${D}gh[[:space:]]+pr[[:space:]]+(create|edit)[^;&|]*(-B|--base)([[:space:]]+|=)main([[:space:]]|$)" && bloquear "PR hacia main o cambio de base a main"

# Credenciales de gh y llavero (github-lucg sigue permitido, D-04).
re "${D}gh[[:space:]]+auth[[:space:]]+(token|switch|login|refresh)" && bloquear "leer o cambiar tokens de gh"
re "${D}gh[[:space:]]+auth[[:space:]]+status[^;&|]*(--show-token|-t([[:space:]]|$))" && bloquear "leer o cambiar tokens de gh"
re "${D}security[[:space:]]+find-(generic|internet)-password[^;&|]*gh:github\.com" && bloquear "leer credenciales de gh del llavero"
re "${D}security[[:space:]]+dump-keychain" && bloquear "leer credenciales de gh del llavero"

# git push: forzado, hacia main, masivo, borrado de main/dev y push directo a dev.
re "${D}git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]](--force|-f|--force-with-lease)([[:space:]]|$)" && bloquear "git push forzado"
re "${D}git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]:/+]main([[:space:]]|$)" && bloquear "push a main"
re "${D}git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]](--all|--mirror)([[:space:]]|$)" && bloquear "push masivo"
re "${D}git[[:space:]]+push[^;&|]*(--delete|-d)[^;&|]*(main|dev)([[:space:]]|$)" && bloquear "borrar main o dev"
re "${D}git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]]:(main|dev)([[:space:]]|$)" && bloquear "borrar main o dev"
re "${D}git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]:]dev([[:space:]]|$)" && bloquear "push directo a dev (solo por PR con cierre-fase)"

# Infraestructura contra prod o bases remotas.
re "${D}(vercel|railway|fly|flyctl|supabase)[[:space:]][^;&|]*(--prod([[:space:]]|$)|--environment[[:space:]=]+prod|production|produccion)" && bloquear "comando de infraestructura contra prod"
re "${D}supabase[[:space:]]+(db[[:space:]]+(reset|push)|migration[[:space:]]+(up|repair|list))[^;&|]*(--remote|--linked|--db-url)" && bloquear "base remota: las migraciones remotas solo las aplica migrate.yml (D-16)"
re "${D}supabase[[:space:]]+link" && bloquear "enlazar un proyecto alojado (solo CI)"
exit 0
