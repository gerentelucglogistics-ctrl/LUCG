#!/usr/bin/env bash
# Auditoría de solo lectura de GitHub para la fase 0.1.1 (T-0.1-44, D-02, D-05, D-16, D-17, D-22).
# Solo GET; nunca imprime secretos. Uso: ./scripts/auditar-github.sh
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/github-config.sh

fallos=0
R="$LUCG_REPO"

comprobar() {
  local descripcion="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    echo "OK    $descripcion"
  else
    echo "FALLA $descripcion"
    fallos=$((fallos + 1))
  fi
}

# api_jq <ruta> <filtro jq> [args de jq...]
api_jq() {
  local ruta="$1" filtro="$2"
  shift 2
  gh api "repos/$R/$ruta" | jq -e "$@" "$filtro"
}

prod_revisor_unico() { api_jq environments/prod '[.protection_rules[]? | select(.type=="required_reviewers") | .reviewers[].reviewer.login] == [$rev]' --arg rev "$LUCG_REVISOR_PROD"; }
prod_sin_bypass() { api_jq environments/prod '.can_admins_bypass == false'; }
prod_autorevision() { api_jq environments/prod '[.protection_rules[]? | select(.type=="required_reviewers") | .prevent_self_review][0] == false'; }
prod_solo_main() { api_jq environments/prod/deployment-branch-policies '[.branch_policies[].name] == ["main"]'; }

production_ausente() {
  local salida
  if ! salida=$(gh api "repos/$R/environments/Production" 2>&1); then
    grep -q '404' <<<"$salida"
    return
  fi
  jq -e '[.protection_rules[]? | select(.type=="required_reviewers")] | length == 0' <<<"$salida"
}

bot_write_sin_admin() { api_jq "collaborators/$LUCG_BOT/permission" '.permission == "write" and .user.permissions.admin == false'; }
bot_no_revisor() { api_jq environments/prod '[.protection_rules[]? | .reviewers[]?.reviewer.login] | index($bot) == null' --arg bot "$LUCG_BOT"; }
dev_checks() { api_jq branches/dev '(.protection.required_status_checks.contexts // []) as $c | ($c | index("api")) != null and ($c | index("web")) != null and ($c | index("guardia")) != null'; }
# Sin valor por defecto: un strict ausente debe fallar. Solo con token admin (el resumen sin admin no trae strict).
dev_sin_strict() { gh api "repos/$R/branches/dev/protection/required_status_checks" | jq -e '.strict == false'; }

main_ruleset() {
  local id
  for id in $(gh api "repos/$R/rulesets" | jq -r '[.[] | select(.enforcement=="active")] | .[].id'); do
    if gh api "repos/$R/rulesets/$id" | jq -e '([.rules[].type] | index("update") != null) and ((.conditions.ref_name.include // []) | index("refs/heads/main") != null)'; then
      return 0
    fi
  done
  return 1
}

deploy_prod_un_job() {
  local f=.github/workflows/deploy-prod.yml
  [ "$(grep -v '^[[:space:]]*#' "$f" | grep -cE '^[[:space:]]+environment:[[:space:]]*prod[[:space:]]*$')" = 1 ] \
    && ! grep -q 'workflows/migrate.yml' "$f"
}

comprobar "prod: revisor único $LUCG_REVISOR_PROD (D-05, D-16)" prod_revisor_unico
comprobar "prod: can_admins_bypass=false (D-16)" prod_sin_bypass
comprobar "prod: prevent_self_review=false (D-17)" prod_autorevision
comprobar "prod: solo despliega desde main" prod_solo_main
comprobar "Production: ausente o sin revisores (D-16)" production_ausente
comprobar "bot: colaborador write sin admin (D-01, D-02)" bot_write_sin_admin
comprobar "bot: no es revisor de prod (D-02)" bot_no_revisor
comprobar "dev: checks requeridos api, web y guardia (D-07)" dev_checks
if [ "${LUCG_AUDITAR_ADMIN:-}" = 1 ]; then
  comprobar "dev: sin strict (D-17 enmendada)" dev_sin_strict
else
  echo "OMITIDA dev: sin strict (sin token admin)"
fi
comprobar "main: ruleset activo con Restrict updates (D-22)" main_ruleset
comprobar "deploy-prod: un solo job con environment: prod (criterio 3)" deploy_prod_un_job

if [ "$fallos" -eq 0 ]; then
  echo "auditar-github: OK"
  exit 0
fi
echo "auditar-github: $fallos fallas"
exit 1
