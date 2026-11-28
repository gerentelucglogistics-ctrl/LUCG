#!/usr/bin/env bash
# Cierre de fase: push, PR a dev, fusión con scripts/fusionar-dev.sh (bot, checks de D-14), despliegue a dev con pruebas en dev.
# Uso: ./scripts/cierre-fase.sh "H1 / 1.2 Importador IMILE"
# Nunca toca main: prod se publica cuando el desarrollador fusiona el PR dev -> main con la cuenta LUCG
# y jaras97 aprueba una vez el entorno prod (ADR-009).
set -euo pipefail
BASE=dev
TITULO="${1:-$(git branch --show-current)}"
RAMA=$(git branch --show-current)
case "$RAMA" in main|dev) echo "Estás en ${RAMA}; crea una rama fase/<fase>-<slug>"; exit 1;; esac
[ -z "$(git status --porcelain)" ] || { echo "Hay cambios sin commit"; exit 1; }
# fusionar-dev.sh solo fusiona PRs del bot: fallar antes del push si gh no es el bot.
source "$(dirname "${BASH_SOURCE[0]}")/github-config.sh"
[ "$(gh api user --jq .login)" = "$LUCG_BOT" ] || { echo "gh no está con la cuenta ${LUCG_BOT}; cierre-fase solo corre como el bot"; exit 1; }

echo "== 1/4 Push de ${RAMA}"
git push -u origin "$RAMA"

echo "== 2/4 PR hacia ${BASE}"
# Solo PR abiertos: la rama de fase se reutiliza y `gh pr view <rama>` devolvería un PR ya fusionado.
pr_abierto() { gh pr list --head "$RAMA" --base "$BASE" --state open --json number -q '.[0].number // empty'; }
if [ -z "$(pr_abierto)" ]; then
  gh pr create --base "$BASE" --head "$RAMA" --title "$TITULO" --body-file .github/PULL_REQUEST_TEMPLATE.md
fi
PR=$(pr_abierto)
[ -n "$PR" ] || { echo "No hay PR abierto de ${RAMA} hacia ${BASE}"; exit 1; }
[ "$(gh pr view "$PR" --json baseRefName -q .baseRefName)" = "$BASE" ] || { echo "El PR #${PR} no apunta a ${BASE}; no se fusiona"; exit 1; }

echo "== 3/4 Fusión en ${BASE}"
# fusionar-dev.sh espera los checks (D-14), valida base y autor, y fusiona con --match-head-commit (D-15).
./scripts/fusionar-dev.sh "$PR"
MERGE_SHA=$(gh pr view "$PR" --json mergeCommit -q .mergeCommit.oid)
[ -n "$MERGE_SHA" ] || { echo "No se obtuvo el commit de fusión del PR #${PR}"; exit 1; }

echo "== 4/4 Esperando despliegue a dev (${MERGE_SHA:0:7}, incluye pruebas en dev)"
RUN=""
for _ in $(seq 1 18); do
  RUN=$(gh run list --workflow "Despliegue a dev" --commit "$MERGE_SHA" --limit 1 --json databaseId -q '.[0].databaseId // empty')
  [ -n "$RUN" ] && break
  sleep 10
done
[ -n "$RUN" ] || { echo "No apareció el despliegue a dev para ${MERGE_SHA} (3 min)"; exit 1; }
gh run watch "$RUN" --exit-status

cat <<MSG

Evidencia para .planning/phases/<fase>/verificacion.md
- PR: $(gh pr view "$PR" --json url -q .url)
- Fusionado por: $(gh pr view "$PR" --json mergedBy -q .mergedBy.login)
- Despliegue a dev (con pruebas en dev): $(gh run view "$RUN" --json url -q .url)
- MERGE_SHA (release Sentry): ${MERGE_SHA}
Siguiente: /gsd:verify-work sobre el entorno dev.
MSG
