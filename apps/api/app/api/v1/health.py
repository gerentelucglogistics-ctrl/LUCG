from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core import db, version
from app.core.config import get_settings

router = APIRouter(tags=["salud"])


@router.get("/health")
def health() -> JSONResponse:
    rol = db.ping()
    cuerpo = {
        "status": "ok" if rol is not None else "degradado",
        "db": rol is not None,
        "rol_db": rol,
        "version": version.sha_corto(),
        "env": get_settings().app_env,
    }
    codigo = status.HTTP_200_OK if rol is not None else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(cuerpo, status_code=codigo)
