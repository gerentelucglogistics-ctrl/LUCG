#!/usr/bin/env bash
# Regresión sin red de scripts/fusionar-dev.sh con un gh falso al frente del PATH (D-13..D-15).
set -uo pipefail
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${RAIZ}/scripts/fusionar-dev.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
fallos=0

mkdir -p "$TMP/bin"
cat >"$TMP/bin/gh" <<'GH'
#!/usr/bin/env bash
# gh falso: decide por "$1 $2".
case "$1 $2" in
  "pr view")
    n=$(cat "$GH_FALSO_CONTADOR" 2>/dev/null || echo 0)
    n=$((n + 1))
    echo "$n" >"$GH_FALSO_CONTADOR"
    if [ "$n" -ge 2 ] && [ -n "${GH_FALSO_VIEW2:-}" ]; then echo "$GH_FALSO_VIEW2"; else echo "$GH_FALSO_VIEW"; fi
    ;;
  "pr checks")
    case "$*" in
      *--watch*) exit 0 ;;
      *--json*) echo "$GH_FALSO_CHECKS" ;;
    esac
    ;;
  "pr merge") echo "$*" >>"$GH_FALSO_LOG" ;;
esac
exit 0
GH
chmod +x "$TMP/bin/gh"

SHA=abc1234
vista() { # base autor cruzado estado draft [sha]
  printf '{"baseRefName":"%s","author":{"login":"%s"},"headRefOid":"%s","isCrossRepository":%s,"state":"%s","isDraft":%s}' \
    "$1" "$2" "${6:-$SHA}" "$3" "$4" "$5"
}
OK_VIEW=$(vista dev bot-prueba false OPEN false)
checks() { # api web e2e visual guardia ("-" = ausente)
  local nombres=(api web e2e-preview visual-sitio guardia) valores=("$@") i out="" sep=""
  for i in 0 1 2 3 4; do
    [ "${valores[$i]}" = "-" ] && continue
    out+="${sep}{\"name\":\"${nombres[$i]}\",\"bucket\":\"${valores[$i]}\"}"
    sep=","
  done
  printf '[%s]' "$out"
}
OK_CHECKS=$(checks pass pass pass skipping pass)

caso() { # nombre rc_esperado texto_esperado merge_esperado(si|no) view checks [view2]
  local nombre="$1" rc_esp="$2" texto="$3" merge="$4" view="$5" chk="$6" view2="${7:-}"
  local salida rc lineas
  : >"$TMP/log"
  echo 0 >"$TMP/contador"
  salida=$(PATH="$TMP/bin:$PATH" GH_FALSO_VIEW="$view" GH_FALSO_VIEW2="$view2" GH_FALSO_CHECKS="$chk" \
    GH_FALSO_LOG="$TMP/log" GH_FALSO_CONTADOR="$TMP/contador" \
    LUCG_BOT=bot-prueba LUCG_ESPERA_SEG=0 LUCG_INTENTOS=1 "$SCRIPT" 7 2>&1)
  rc=$?
  lineas=$(wc -l <"$TMP/log" | tr -d ' ')
  if [ "$rc_esp" = 0 ] && [ "$rc" != 0 ] || [ "$rc_esp" != 0 ] && [ "$rc" = 0 ]; then
    echo "FALLA ${nombre}: rc=${rc} (esperado ${rc_esp}); salida: ${salida}"; fallos=$((fallos + 1))
  fi
  if [ -n "$texto" ] && ! grep -qF -- "$texto" <<<"$salida"; then
    echo "FALLA ${nombre}: falta el texto '${texto}'; salida: ${salida}"; fallos=$((fallos + 1))
  fi
  if [ "$merge" = si ]; then
    [ "$lineas" = 1 ] && grep -qxF "pr merge 7 --squash --delete-branch --match-head-commit ${SHA}" "$TMP/log" \
      || { echo "FALLA ${nombre}: se esperaba exactamente una llamada de fusión con el SHA"; fallos=$((fallos + 1)); }
  else
    [ "$lineas" = 0 ] || { echo "FALLA ${nombre}: no debía fusionar"; fallos=$((fallos + 1)); }
  fi
}

caso "valido" 0 "fusionado en dev" si "$OK_VIEW" "$OK_CHECKS"
caso "base main" 1 "no apunta a dev" no "$(vista main bot-prueba false OPEN false)" "$OK_CHECKS"
caso "autor ajeno" 1 "no lo abrió el bot" no "$(vista dev otra-persona false OPEN false)" "$OK_CHECKS"
caso "fork" 1 "" no "$(vista dev bot-prueba true OPEN false)" "$OK_CHECKS"
caso "fusionado" 1 "" no "$(vista dev bot-prueba false MERGED false)" "$OK_CHECKS"
caso "draft" 1 "" no "$(vista dev bot-prueba false OPEN true)" "$OK_CHECKS"
caso "e2e-preview fail" 1 "e2e-preview" no "$OK_VIEW" "$(checks pass pass fail skipping pass)"
caso "visual-sitio pending" 1 "visual-sitio" no "$OK_VIEW" "$(checks pass pass pass pending pass)"
caso "guardia ausente" 1 "falta el check guardia" no "$OK_VIEW" "$(checks pass pass pass skipping -)"
caso "head cambiado" 1 "cambió mientras" no "$OK_VIEW" "$OK_CHECKS" "$(vista dev bot-prueba false OPEN false otrosha)"

# Sin argumento
salida=$(PATH="$TMP/bin:$PATH" "$SCRIPT" 2>&1) && { echo "FALLA sin argumento: rc=0"; fallos=$((fallos + 1)); }
grep -qi "uso" <<<"$salida" || { echo "FALLA sin argumento: falta mensaje de uso"; fallos=$((fallos + 1)); }

if [ "$fallos" -eq 0 ]; then
  echo "fusionar-dev: OK"
  exit 0
fi
echo "fusionar-dev: ${fallos} fallas"
exit 1
