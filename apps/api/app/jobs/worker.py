import procrastinate

from app.core.config import get_settings

# Cola de trabajos sobre PostgreSQL (ADR-005). Arranque: `procrastinate --app app.jobs.worker.app worker`
app = procrastinate.App(connector=procrastinate.PsycopgConnector(conninfo=get_settings().database_url.replace("+psycopg", "")))


@app.task(name="ping", retry=1)
def ping() -> str:
    return "pong"


# Fase 1.2+: procesar_importacion_imile, procesar_evidencia, generar_acta, reporte_diario, calcular_vencimientos, notificar
