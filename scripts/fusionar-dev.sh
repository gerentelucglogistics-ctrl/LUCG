#!/usr/bin/env bash
# Única vía del agente (bot) para fusionar a dev (D-13..D-15, ADR-009).
# Uso: ./scripts/fusionar-dev.sh <PR>
# Exige base dev, autor = bot, PR del mismo repo y checks api, web, e2e-preview, visual-sitio y guardia
# en pass o skipping. Nunca fusiona hacia main.
set -euo pipefail
PR="${1:?uso: fusionar-dev.sh <PR>}"
source "$(dirname "${BASH_SOURCE[0]}")/github-config.sh"
ESPERA="${LUCG_ESPERA_SEG:-5}"
INTENTOS="${LUCG_INTENTOS:-30}"
REQUERIDOS=(api web e2e-preview visual-sitio guardia)

fallar() { echo "$*" >&2; exit 1; }

VISTA=$(gh pr view "$PR" --json baseRefName,author,headRefOid,isCrossRepository,state,isDraft)
campo() { jq -r "$1" <<<"$VISTA"; }

[ "$(campo .state)" = "OPEN" ] || fallar "El PR #${PR} no está abierto; no se fusiona"
[ "$(campo .isDraft)" = "false" ] || fallar "El PR #${PR} es borrador; no se fusiona"
[ "$(campo .baseRefName)" = "dev" ] || fallar "El PR #${PR} no apunta a dev; no se fusiona"
[ "$(campo .author.login)" = "$LUCG_BOT" ] || fallar "El PR #${PR} no lo abrió el bot ${LUCG_BOT}; no se fusiona"
[ "$(campo .isCrossRepository)" = "false" ] || fallar "El PR #${PR} viene de otro repositorio; no se fusiona"
SHA=$(campo .headRefOid)

# Recién hecho el push, GitHub tarda unos segundos en registrar los checks: esperar a que aparezcan.
for _ in $(seq 1 "$INTENTOS"); do
  [ "$(gh pr checks "$PR" --json name 2>/dev/null | jq length 2>/dev/null || echo 0)" -gt 0 ] && break
  sleep "$ESPERA"
done
gh pr checks "$PR" --watch >/dev/null 2>&1 || true

CHECKS=$(gh pr checks "$PR" --json name,bucket)
for nombre in "${REQUERIDOS[@]}"; do
  bucket=$(jq -r --arg n "$nombre" '[.[] | select(.name == $n)][0].bucket // empty' <<<"$CHECKS")
  case "$bucket" in
    pass|skipping) ;;
    "") fallar "falta el check ${nombre}; no se fusiona" ;;
    *) fallar "El check ${nombre} está en ${bucket}; no se fusiona" ;;
  esac
done

[ "$(gh pr view "$PR" --json headRefOid | jq -r .headRefOid)" = "$SHA" ] \
  || fallar "El PR cambió mientras se revisaban los checks; vuelve a correr"

gh pr merge "$PR" --squash --delete-branch --match-head-commit "$SHA"
echo "PR #${PR} fusionado en dev. La copia local quedó en dev: vuelve a una rama fase/… antes de escribir (Pitfall 10)."
