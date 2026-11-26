import procrastinate

from app.core.config import get_settings

# Cola de trabajos sobre PostgreSQL (ADR-005). Arranque: `procrastinate --app app.jobs.worker.app worker`
# Pool chico (1 a 3 conexiones) para no agotar el pooler de sesión de Supabase.
app = procrastinate.App(
    connector=procrastinate.PsycopgConnector(
        conninfo=get_settings().database_url.replace("+psycopg", ""),
        min_size=1,
        max_size=3,
    )
)


@app.task(name="ping", retry=1)
def ping() -> str:
    return "pong"


@app.periodic(cron="*/5 * * * *")
@app.task(name="latido")
def latido(timestamp: int) -> None:
    """Latido del worker cada 5 minutos: queda registrado en procrastinate_jobs (D-08)."""


# Fase 1.2+: procesar_importacion_imile, procesar_evidencia, generar_acta, reporte_diario,
# calcular_vencimientos, notificar
