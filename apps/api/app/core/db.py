from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

from app.core.auth import Principal, principal_actual
from app.core.config import get_settings

_engine = create_engine(
    get_settings().database_url, pool_pre_ping=True, pool_size=3, max_overflow=2, future=True
)
SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)


def sesion_con_contexto(principal: Principal) -> Iterator[Session]:
    """Abre una transacción y fija el contexto de RLS (app.set_contexto) para el usuario autenticado."""
    with SessionLocal() as s, s.begin():
        s.execute(
            text("select app.set_contexto(:tipo, :org, :roles)"),
            {"tipo": principal.org_tipo, "org": principal.org_id, "roles": principal.roles},
        )
        yield s


def sesion_dep(p: Annotated[Principal, Depends(principal_actual)]) -> Iterator[Session]:
    """Dependencia FastAPI: sesión con el contexto de RLS del usuario autenticado."""
    yield from sesion_con_contexto(p)


def ping() -> str | None:
    """Consulta real a la base: devuelve el rol de conexión, o None si no responde."""
    try:
        with _engine.connect() as c:
            return c.execute(text("select current_user")).scalar()
    except SQLAlchemyError:
        return None
