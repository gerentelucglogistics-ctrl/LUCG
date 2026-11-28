#!/usr/bin/env bash
# Regresión sin red de scripts/registro-cerrado.sh con un servidor local falso (D-19).
set -uo pipefail
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${RAIZ}/scripts/registro-cerrado.sh"
CLAVE="clave-falsa-NO-IMPRIMIR-123"
fallos=0
PID=""
trap '[ -n "$PID" ] && kill "$PID" 2>/dev/null' EXIT

puerto=$(python3 -I -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])')

servidor() { # disable codigo
  [ -n "$PID" ] && kill "$PID" 2>/dev/null && wait "$PID" 2>/dev/null
  FALSO_DISABLE="$1" FALSO_CODIGO="$2" python3 -I -c '
import http.server, json, os, sys
class H(http.server.BaseHTTPRequestHandler):
    def _enviar(self, codigo, cuerpo):
        datos = json.dumps(cuerpo).encode()
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(datos)))
        self.end_headers()
        self.wfile.write(datos)
    def do_GET(self):
        if self.path == "/auth/v1/settings":
            self._enviar(200, {"disable_signup": os.environ["FALSO_DISABLE"] == "true"})
        else:
            self._enviar(404, {})
    def do_POST(self):
        self.rfile.read(int(self.headers.get("Content-Length", 0)))
        self._enviar(422, {"error_code": os.environ["FALSO_CODIGO"]})
    def log_message(self, *a):
        pass
http.server.HTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
' "$puerto" &
  PID=$!
  for _ in $(seq 1 50); do
    curl -s -o /dev/null "http://127.0.0.1:${puerto}/auth/v1/settings" && return 0
    sleep 0.1
  done
  echo "servidor falso no arrancó"; exit 1
}

caso() { # nombre rc_esperado texto_esperado entorno [env...]
  local nombre="$1" rc_esp="$2" texto="$3" entorno="$4"; shift 4
  local salida rc
  salida=$(env -u SUPABASE_URL -u SUPABASE_PUBLISHABLE_KEY -u E2E_SUPABASE_URL -u E2E_SUPABASE_PUBLISHABLE_KEY "$@" "$SCRIPT" "$entorno" 2>&1)
  rc=$?
  if [ "$rc" != "$rc_esp" ] || ! grep -qF -- "$texto" <<<"$salida"; then
    echo "FALLA ${nombre}: rc=${rc} (esperado ${rc_esp}); salida: ${salida}"
    fallos=$((fallos + 1))
  fi
  if grep -qF -- "$CLAVE" <<<"$salida"; then
    echo "FALLA ${nombre}: la clave aparece en la salida"
    fallos=$((fallos + 1))
  fi
}

URL="http://127.0.0.1:${puerto}"

servidor true signup_disabled
caso cerrado 0 "Registro público cerrado en dev" dev SUPABASE_URL="$URL" SUPABASE_PUBLISHABLE_KEY="$CLAVE"
caso cerrado-e2e-dev 0 "Registro público cerrado en dev" dev E2E_SUPABASE_URL="$URL" E2E_SUPABASE_PUBLISHABLE_KEY="$CLAVE"

servidor false signup_disabled
caso settings-abierto 1 "Registro público abierto en prod" prod SUPABASE_URL="$URL" SUPABASE_PUBLISHABLE_KEY="$CLAVE"

servidor true weak_password
caso signup-abierto 1 "Registro público abierto en prod" prod SUPABASE_URL="$URL" SUPABASE_PUBLISHABLE_KEY="$CLAVE"

caso prod-sin-variables 1 "faltan SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY para prod" prod
caso prod-sin-clave 1 "faltan SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY para prod" prod SUPABASE_URL="$URL"
caso dev-sin-variables 0 "registro no verificado en dev (faltan variables)" dev

if [ "$fallos" -eq 0 ]; then
  echo "registro-cerrado: OK"
else
  echo "registro-cerrado: ${fallos} fallo(s)"
  exit 1
fi
