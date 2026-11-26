#!/usr/bin/env bash
# Cierre de fase: push, PR a dev, CI, merge, despliegue a dev, pruebas contra dev.
# Uso: ./scripts/cierre-fase.sh "H1 / 1.2 Importador IMILE"
# Nunca toca main: prod se publica cuando el desarrollador principal fusiona a mano el PR dev -> main.
set -euo pipefail
BASE=dev
TITULO="${1:-$(git branch --show-current)}"
RAMA=$(git branch --show-current)
case "$RAMA" in main|dev) echo "Estás en ${RAMA}; crea una rama fase/<fase>-<slug>"; exit 1;; esac
[ -z "$(git status --porcelain)" ] || { echo "Hay cambios sin commit"; exit 1; }

echo "== 1/6 Push de ${RAMA}"
git push -u origin "$RAMA"

echo "== 2/6 PR hacia ${BASE}"
if ! gh pr view "$RAMA" >/dev/null 2>&1; then
  gh pr create --base "$BASE" --head "$RAMA" --title "$TITULO" --body-file .github/PULL_REQUEST_TEMPLATE.md
fi
PR=$(gh pr view "$RAMA" --json number -q .number)
[ "$(gh pr view "$PR" --json baseRefName -q .baseRefName)" = "$BASE" ] || { echo "El PR #${PR} no apunta a ${BASE}; no se fusiona"; exit 1; }

echo "== 3/6 Esperando CI del PR #${PR}"
gh pr checks "$PR" --watch --fail-fast

echo "== 4/6 Fusión en ${BASE}"
gh pr merge "$PR" --squash --delete-branch

echo "== 5/6 Esperando despliegue a dev"
sleep 20
RUN=$(gh run list --workflow "Despliegue a dev" --branch "$BASE" --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RUN" --exit-status

echo "== 6/6 Esperando pruebas en dev"
sleep 20
RUN2=$(gh run list --workflow "Pruebas en dev" --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RUN2" --exit-status

cat <<MSG

Evidencia para .planning/phases/<fase>/verificacion.md
- PR: $(gh pr view "$PR" --json url -q .url)
- Despliegue: $(gh run view "$RUN" --json url -q .url)
- Pruebas en dev: $(gh run view "$RUN2" --json url -q .url)
- Release Sentry: $(git rev-parse HEAD)
Siguiente: /gsd:verify-work sobre el entorno dev.
MSG
