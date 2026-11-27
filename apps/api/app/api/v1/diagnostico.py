from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.auth import requiere_rol
from app.jobs.worker import app as worker_app
from app.jobs.worker import ping

# Todo el router exige superadministrador: ninguna ruta de diagnóstico queda abierta (T-0.1-13).
router = APIRouter(
    prefix="/diagnostico",
    tags=["diagnostico"],
    dependencies=[Depends(requiere_rol("superadministrador"))],
)


class JobOut(BaseModel):
    job_id: int


class EstadoJobOut(BaseModel):
    job_id: int
    estado: str


@router.post("/ping")
async def encolar_ping() -> JobOut:
    """Encola la tarea `ping` para comprobar que el worker procesa trabajos (D-14)."""
    job_id = await ping.defer_async()
    return JobOut(job_id=job_id)


@router.get("/jobs/{job_id}")
async def estado_job(job_id: int) -> EstadoJobOut:
    estado = await worker_app.job_manager.get_job_status_async(job_id)
    return EstadoJobOut(job_id=job_id, estado=estado.value)


@router.post("/error")
async def error_de_prueba() -> None:
    """Excepción no manejada a propósito: debe llegar a Sentry (D-15)."""
    raise RuntimeError("Error de prueba Sentry (diagnóstico)")
