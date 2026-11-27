#!/usr/bin/env bash
# Cierre de fase: push, PR a dev, CI (checks requeridos), merge, despliegue a dev (incluye pruebas en dev).
# Uso: ./scripts/cierre-fase.sh "H1 / 1.2 Importador IMILE"
# Nunca toca main: prod se publica cuando el desarrollador principal fusiona a mano el PR dev -> main.
set -euo pipefail
BASE=dev
TITULO="${1:-$(git branch --show-current)}"
RAMA=$(git branch --show-current)
case "$RAMA" in main|dev) echo "Estás en ${RAMA}; crea una rama fase/<fase>-<slug>"; exit 1;; esac
[ -z "$(git status --porcelain)" ] || { echo "Hay cambios sin commit"; exit 1; }

echo "== 1/5 Push de ${RAMA}"
git push -u origin "$RAMA"

echo "== 2/5 PR hacia ${BASE}"
if ! gh pr view "$RAMA" >/dev/null 2>&1; then
  gh pr create --base "$BASE" --head "$RAMA" --title "$TITULO" --body-file .github/PULL_REQUEST_TEMPLATE.md
fi
PR=$(gh pr view "$RAMA" --json number -q .number)
[ "$(gh pr view "$PR" --json baseRefName -q .baseRefName)" = "$BASE" ] || { echo "El PR #${PR} no apunta a ${BASE}; no se fusiona"; exit 1; }

echo "== 3/5 Esperando checks requeridos del PR #${PR}"
# Solo los requeridos por la protección de dev (api, web): e2e-preview y visual-sitio no bloquean.
# Recién hecho el push, GitHub tarda unos segundos en registrar los checks: esperar a que aparezcan.
for _ in $(seq 1 30); do
  [ "$(gh pr checks "$PR" --required --json name -q length 2>/dev/null || echo 0)" -gt 0 ] && break
  sleep 5
done
gh pr checks "$PR" --required --watch --fail-fast

echo "== 4/5 Fusión en ${BASE}"
gh pr merge "$PR" --squash --delete-branch
MERGE_SHA=$(gh pr view "$PR" --json mergeCommit -q .mergeCommit.oid)
[ -n "$MERGE_SHA" ] || { echo "No se obtuvo el commit de fusión del PR #${PR}"; exit 1; }

echo "== 5/5 Esperando despliegue a dev (${MERGE_SHA:0:7}, incluye pruebas en dev)"
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
- Despliegue a dev (con pruebas en dev): $(gh run view "$RUN" --json url -q .url)
- MERGE_SHA (release Sentry): ${MERGE_SHA}
Siguiente: /gsd:verify-work sobre el entorno dev.
MSG
