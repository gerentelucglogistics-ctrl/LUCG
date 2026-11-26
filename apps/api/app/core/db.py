from collections.abc import Iterator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.auth import Principal
from app.core.config import get_settings

_engine = create_engine(get_settings().database_url, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)


def sesion_con_contexto(principal: Principal) -> Iterator[Session]:
    """Abre una transacción y fija el contexto de RLS (app.set_contexto) para el usuario autenticado."""
    with SessionLocal() as s, s.begin():
        s.execute(
            text("select app.set_contexto(:tipo, :org, :roles)"),
            {"tipo": principal.org_tipo, "org": principal.org_id, "roles": principal.roles},
        )
        yield s


def ping() -> bool:
    with _engine.connect() as c:
        return c.execute(text("select 1")).scalar() == 1
