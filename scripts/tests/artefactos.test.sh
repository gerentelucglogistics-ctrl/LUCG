#!/usr/bin/env bash
# Comprobación estática (D-08/D-09): toda subida de playwright-report va solo en fallo,
# tras la compuerta de secretos y con retención de 7 días. Solo bash y python3 stdlib.
set -euo pipefail
cd "$(dirname "$0")/../.."

python3 -I - .github/workflows/*.yml <<'PY'
import re
import sys

fallas = []
for ruta in sys.argv[1:]:
    lineas = open(ruta, encoding="utf-8").read().splitlines()
    # Partir en pasos: cada "- " al nivel de los pasos abre uno nuevo; "jobs" por clave de 2 espacios.
    pasos = []  # (job, texto_del_paso)
    job = None
    actual = None
    for linea in lineas:
        m = re.match(r"^  ([A-Za-z0-9_-]+):\s*$", linea)
        if m and not linea.startswith("   "):
            job = m.group(1)
        if re.match(r"^      - ", linea):
            actual = [job, [linea]]
            pasos.append(actual)
        elif actual is not None:
            if re.match(r"^  [A-Za-z0-9_-]+:\s*$", linea) or re.match(r"^\S", linea):
                actual = None
            else:
                actual[1].append(linea)
    for i, (j, bloque) in enumerate(pasos):
        texto = "\n".join(bloque)
        if "actions/upload-artifact@" not in texto or "playwright-report" not in texto:
            continue
        nombre = f"{ruta}:{j}"
        m = re.search(r"if:\s*(.+)", texto)
        cond = m.group(1).strip() if m else ""
        if "always()" in cond:
            fallas.append(f"{nombre}: la subida usa always()")
        if not cond.startswith("failure()") or "steps.compuerta.outcome == 'success'" not in cond:
            fallas.append(f"{nombre}: el if de la subida debe empezar con failure() y exigir steps.compuerta.outcome == 'success'")
        if "retention-days: 7" not in texto:
            fallas.append(f"{nombre}: falta retention-days: 7")
        previos = [t for (jj, b) in pasos[:i] if jj == j for t in ["\n".join(b)]]
        if not any("id: compuerta" in t and "python3 -I scripts/compuerta-secretos.py playwright-report" in t for t in previos):
            fallas.append(f"{nombre}: no hay un paso id: compuerta previo con python3 -I scripts/compuerta-secretos.py playwright-report")

    if ruta.endswith("e2e-dev.yml") and "artefacto playwright" in "\n".join(lineas):
        fallas.append(f"{ruta}: el resumen cita un artefacto en vez de la URL del run")

if fallas:
    print("artefactos: FALLAS")
    for f in fallas:
        print(" -", f)
    sys.exit(1)
print("artefactos: OK")
PY
