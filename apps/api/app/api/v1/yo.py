from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import Principal, principal_actual
from app.core.db import sesion_dep

router = APIRouter(tags=["identidad"])


class YoOut(BaseModel):
    usuario: str
    roles: list[str]
    rol_db: str
    org_tipo: str | None
    interno: bool


@router.get("/yo", response_model=YoOut)
def yo(
    p: Annotated[Principal, Depends(principal_actual)],
    s: Annotated[Session, Depends(sesion_dep)],
) -> YoOut:
    fila = s.execute(text("select current_user, app.org_tipo(), app.es_interno()")).one()
    return YoOut(usuario=p.user_id, roles=p.roles, rol_db=fila[0], org_tipo=fila[1], interno=bool(fila[2]))
