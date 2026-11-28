#!/usr/bin/env python3
"""Compuerta de secretos para reportes de Playwright (D-09).

Se ejecuta antes de cada `upload-artifact` de un reporte:

    python3 -I scripts/compuerta-secretos.py playwright-report

`-I` aísla el intérprete (sin directorio del script ni PYTHONPATH). Busca en el
directorio los valores de toda variable E2E_USER_*, E2E_PASS_*, E2E_TOKEN_* y
VERCEL_BYPASS_* en forma cruda, URL-encoded (quote y quote_plus), escapada en JSON
y escapada en HTML. Decodifica el zip base64 de <template id="playwrightReportBase64">
en index.html y entra de forma recursiva en los zips (incluidos zips dentro de zips).

Con un hallazgo imprime solo `ruta/entrada: NOMBRE_VARIABLE` (nunca un valor), borra el
directorio y sale 1. Sin secretos definidos o sin directorio sale 0 con un aviso.
Solo biblioteca estándar.
"""

import base64
import html
import io
import json
import os
import re
import shutil
import sys
import zipfile
from urllib.parse import quote, quote_plus

PREFIJOS = ("E2E_USER_", "E2E_PASS_", "E2E_TOKEN_", "VERCEL_BYPASS_")
LARGO_MINIMO = 8
PROFUNDIDAD_MAX = 5
BYTES_MAX = 200 * 1024 * 1024
MARCA_BASE64 = b"data:application/zip;base64,"
RE_BASE64 = re.compile(rb"data:application/zip;base64,([A-Za-z0-9+/=\s]+)")


def aviso(msg: str) -> None:
    print(f"compuerta: {msg}", file=sys.stderr)


def cargar_secretos() -> dict[str, list[bytes]]:
    """Devuelve {NOMBRE: [variantes en bytes]} sin duplicados."""
    secretos: dict[str, list[bytes]] = {}
    for nombre, valor in sorted(os.environ.items()):
        if not nombre.startswith(PREFIJOS) or not valor:
            continue
        if len(valor) < LARGO_MINIMO:
            aviso(f"{nombre} tiene menos de {LARGO_MINIMO} caracteres; se omite")
            continue
        variantes = [
            valor,
            quote(valor, safe=""),
            quote_plus(valor),
            json.dumps(valor)[1:-1],
            html.escape(valor),
        ]
        secretos[nombre] = list(dict.fromkeys(v.encode("utf-8") for v in variantes))
    return secretos


class Escaner:
    def __init__(self, secretos: dict[str, list[bytes]]) -> None:
        self.secretos = secretos
        self.hallazgos: list[str] = []

    def marcar(self, lugar: str, nombre: str) -> None:
        linea = f"{lugar}: {nombre}"
        if linea not in self.hallazgos:
            self.hallazgos.append(linea)

    def revisar(self, lugar: str, datos: bytes, profundidad: int = 0) -> None:
        for nombre, variantes in self.secretos.items():
            if any(v in datos for v in variantes):
                self.marcar(lugar, nombre)
        if profundidad >= PROFUNDIDAD_MAX:
            if zipfile.is_zipfile(io.BytesIO(datos)) or MARCA_BASE64 in datos:
                self.marcar(lugar, "ILEGIBLE_PROFUNDIDAD")
            return
        if zipfile.is_zipfile(io.BytesIO(datos)):
            self.revisar_zip(lugar, datos, profundidad)
        for m in RE_BASE64.finditer(datos):
            try:
                crudo = base64.b64decode(re.sub(rb"\s+", b"", m.group(1)))
            except ValueError:
                self.marcar(lugar + "#playwrightReportBase64", "ILEGIBLE_BASE64")
                continue
            self.revisar(lugar + "#playwrightReportBase64", crudo, profundidad + 1)

    def revisar_zip(self, lugar: str, datos: bytes, profundidad: int) -> None:
        try:
            with zipfile.ZipFile(io.BytesIO(datos)) as z:
                if sum(i.file_size for i in z.infolist()) > BYTES_MAX:
                    self.marcar(lugar, "ILEGIBLE_TAMANO")
                    return
                for info in z.infolist():
                    if info.is_dir():
                        continue
                    self.revisar(f"{lugar}/{info.filename}", z.read(info), profundidad + 1)
        except (zipfile.BadZipFile, NotImplementedError, RuntimeError, OSError):
            self.marcar(lugar, "ILEGIBLE_ZIP")


def main() -> int:
    if len(sys.argv) != 2:
        aviso("uso: compuerta-secretos.py <directorio-del-reporte>")
        return 2
    directorio = sys.argv[1]
    if not os.path.isdir(directorio):
        aviso(f"no hay reporte en {directorio}; nada que revisar")
        return 0
    secretos = cargar_secretos()
    if not secretos:
        aviso("sin secretos definidos; nada que revisar")
        return 0

    escaner = Escaner(secretos)
    for raiz, _dirs, archivos in os.walk(directorio):
        for archivo in archivos:
            ruta = os.path.join(raiz, archivo)
            lugar = os.path.relpath(ruta, directorio)
            if os.path.getsize(ruta) > BYTES_MAX:
                escaner.marcar(lugar, "ILEGIBLE_TAMANO")
                continue
            try:
                with open(ruta, "rb") as f:
                    datos = f.read()
            except OSError:
                escaner.marcar(lugar, "ILEGIBLE_ARCHIVO")
                continue
            escaner.revisar(lugar, datos)

    if escaner.hallazgos:
        for linea in escaner.hallazgos:
            print(linea, file=sys.stderr)
        shutil.rmtree(directorio)
        aviso(f"{len(escaner.hallazgos)} hallazgos; el reporte se borró y no se sube")
        return 1
    aviso("limpio")
    return 0


if __name__ == "__main__":
    sys.exit(main())
