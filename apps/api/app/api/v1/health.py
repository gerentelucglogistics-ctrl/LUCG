from fastapi import APIRouter

from app.core import db
from app.core.config import get_settings

router = APIRouter(tags=["salud"])


@router.get("/health")
def health() -> dict[str, str | bool]:
    s = get_settings()
    ok = db.ping()
    return {"status": "ok" if ok else "degradado", "db": ok, "version": s.app_version, "env": s.app_env}
