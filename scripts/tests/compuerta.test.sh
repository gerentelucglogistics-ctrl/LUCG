#!/usr/bin/env bash
# Regresión de scripts/compuerta-secretos.py (D-09): casos sintéticos y un reporte real de Playwright.
# Corre sin red. Con COMPUERTA_REQUIERE_REAL=1 la ausencia de Playwright cuenta como fallo.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."
RAIZ="$(pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fallos=0
falla() { echo "FALLO: $1" >&2; fallos=$((fallos + 1)); }

# Secreto falso con caracteres especiales (&, /, +, espacio, comillas dobles). Nunca es real.
export E2E_PASS_PRUEBA="s3cr&t/x+y z\"$(date +%s)$RANDOM"
export E2E_PASS_PRUEBA

# Construye artefactos con zipfile/base64. El secreto entra por entorno, no por argv.
armar() {
  python3 -I -c '
import base64, html, io, json, os, sys, zipfile
from urllib.parse import quote, quote_plus
modo, destino = sys.argv[1], sys.argv[2]
v = os.environ["E2E_PASS_PRUEBA"]
formas = {
    "crudo": v, "quote": quote(v, safe=""), "quote_plus": quote_plus(v),
    "json": json.dumps(v)[1:-1], "html": html.escape(v),
}
def zip_de(entradas):
    b = io.BytesIO()
    with zipfile.ZipFile(b, "w") as z:
        for n, d in entradas.items():
            z.writestr(n, d)
    return b.getvalue()
def index(zbytes):
    b64 = base64.b64encode(zbytes).decode()
    return ("<html><template id=\"playwrightReportBase64\">data:application/zip;base64,"
            + b64 + "</template></html>").encode()
os.makedirs(os.path.join(destino, "data"), exist_ok=True)
limpio = zip_de({"report.json": "nada que ver"})
if modo == "limpio":
    open(os.path.join(destino, "index.html"), "wb").write(index(limpio))
    open(os.path.join(destino, "data", "x.zip"), "wb").write(limpio)
elif modo == "suelto":
    open(os.path.join(destino, "index.html"), "wb").write(index(limpio))
    open(os.path.join(destino, "data", "a.txt"), "w").write("antes " + v + " despues")
elif modo == "template":
    open(os.path.join(destino, "index.html"), "wb").write(index(zip_de({"report.json": "x " + v})))
elif modo == "zipenzip":
    interior = zip_de({"paso.txt": quote(v, safe="")})
    open(os.path.join(destino, "index.html"), "wb").write(index(limpio))
    open(os.path.join(destino, "data", "trace.zip"), "wb").write(zip_de({"interior.zip": interior}))
elif modo in formas:
    open(os.path.join(destino, "index.html"), "wb").write(index(limpio))
    open(os.path.join(destino, "data", "f.txt"), "w").write("x" + formas[modo] + "y")
' "$1" "$2"
}

# caso <rc_esperado> <descripción> <dir>
caso() {
  local esperado="$1" desc="$2" dir="$3" rc=0 salida="$TMP/salida.txt"
  python3 -I scripts/compuerta-secretos.py "$dir" >"$salida" 2>&1 || rc=$?
  [ "$rc" -eq "$esperado" ] || falla "$desc: rc=$rc, esperado $esperado"
  # La salida nunca puede contener el valor ni sus formas.
  python3 -I -c '
import html, json, os, sys
from urllib.parse import quote, quote_plus
v = os.environ["E2E_PASS_PRUEBA"]
s = open(sys.argv[1], encoding="utf-8", errors="replace").read()
formas = [v, quote(v, safe=""), quote_plus(v), json.dumps(v)[1:-1], html.escape(v)]
sys.exit(1 if any(f in s for f in formas) else 0)
' "$salida" || falla "$desc: la salida contiene el valor del secreto"
  if [ "$esperado" -eq 1 ]; then
    [ ! -e "$dir" ] || falla "$desc: el directorio no se borró"
    grep -q "E2E_PASS_PRUEBA" "$salida" || falla "$desc: la salida no nombra la variable"
  else
    [ -d "$dir" ] || [ ! -e "$dir" ] || falla "$desc: estado inesperado del directorio"
  fi
}

# 1. Limpio
d="$TMP/limpio"; armar limpio "$d"
caso 0 "limpio" "$d"
[ -d "$d" ] || falla "limpio: el directorio desapareció"

# 2. Crudo en archivo suelto
d="$TMP/suelto"; armar suelto "$d"
caso 1 "crudo en archivo suelto" "$d"

# 3. En el template base64 de index.html
d="$TMP/template"; armar template "$d"
python3 -I scripts/compuerta-secretos.py "$d" >"$TMP/t.txt" 2>&1 && falla "template: debía fallar" || true
grep -q "index.html" "$TMP/t.txt" || falla "template: la salida no nombra index.html"
d="$TMP/template2"; armar template "$d"
caso 1 "template base64" "$d"

# 4. Zip dentro de zip
d="$TMP/zipenzip"; armar zipenzip "$d"
caso 1 "zip dentro de zip" "$d"

# 5. Cada forma por separado
for forma in crudo quote quote_plus json html; do
  d="$TMP/forma-$forma"; armar "$forma" "$d"
  caso 1 "forma $forma" "$d"
done

# 6. Sin secretos definidos
d="$TMP/sinsecretos"; armar limpio "$d"
rc=0
env -u E2E_PASS_PRUEBA python3 -I scripts/compuerta-secretos.py "$d" >"$TMP/s.txt" 2>&1 || rc=$?
[ "$rc" -eq 0 ] || falla "sin secretos: rc=$rc"
grep -qi "sin secretos" "$TMP/s.txt" || falla "sin secretos: falta el aviso"

# 7. Vacíos se ignoran, cortos se omiten con aviso
d="$TMP/cortos"; armar limpio "$d"
rc=0
env E2E_PASS_PRUEBA="" E2E_TOKEN_CORTO="abc" python3 -I scripts/compuerta-secretos.py "$d" >"$TMP/c.txt" 2>&1 || rc=$?
[ "$rc" -eq 0 ] || falla "cortos: rc=$rc"
grep -q "E2E_TOKEN_CORTO" "$TMP/c.txt" || falla "cortos: falta el aviso con el nombre"

# 8. Directorio inexistente
rc=0
python3 -I scripts/compuerta-secretos.py "$TMP/no-existe" >"$TMP/n.txt" 2>&1 || rc=$?
[ "$rc" -eq 0 ] || falla "inexistente: rc=$rc"
grep -q "no hay reporte" "$TMP/n.txt" || falla "inexistente: falta el aviso"

# 9. Reporte real de Playwright
if (pnpm exec playwright --version >/dev/null 2>&1); then
  falso="$(python3 -I -c 'import secrets; print(secrets.token_urlsafe(18)[:24])')"
  PLANTA_SALIDA="$TMP/reporte" E2E_PASS_FALSO="$falso" \
    pnpm exec playwright test -c scripts/tests/planta.config.ts >/dev/null 2>&1 || true
  if [ ! -f "$TMP/reporte/index.html" ]; then
    falla "reporte real: no se generó index.html"
  else
    if grep -qF "$falso" "$TMP/reporte/index.html"; then
      falla "reporte real: el secreto aparece en claro en index.html (el supuesto del formato cambió)"
    fi
    rc=0
    E2E_PASS_PRUEBA="$falso" python3 -I scripts/compuerta-secretos.py "$TMP/reporte" >"$TMP/r.txt" 2>&1 || rc=$?
    [ "$rc" -eq 1 ] || falla "reporte real: la compuerta no detectó el secreto (rc=$rc)"
    grep -q "E2E_PASS_PRUEBA" "$TMP/r.txt" || falla "reporte real: no nombra la variable"
    grep -qF "$falso" "$TMP/r.txt" && falla "reporte real: la salida contiene el valor" || true
    [ ! -e "$TMP/reporte" ] || falla "reporte real: el directorio no se borró"
  fi
elif [ "${COMPUERTA_REQUIERE_REAL:-0}" = "1" ]; then
  falla "reporte real: Playwright no disponible y COMPUERTA_REQUIERE_REAL=1"
else
  echo "compuerta: reporte real omitido (sin Playwright)"
fi

if [ "$fallos" -gt 0 ]; then
  echo "compuerta: $fallos fallos" >&2
  exit 1
fi
echo "compuerta: OK"
