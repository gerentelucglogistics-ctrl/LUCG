"""Consultas negativas de seguridad contra la base local (skill supabase-convenciones).

Se conectan como `postgres` y cambian de rol dentro de una transacción que siempre termina en rollback.
"""

import os
from collections.abc import Iterator

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection
from sqlalchemy.exc import ProgrammingError


@pytest.fixture
def conexion() -> Iterator[Connection]:
    engine = create_engine(os.environ["DATABASE_URL_ADMIN"])
    with engine.connect() as con:
        trans = con.begin()
        try:
            # `postgres` no es superusuario en Supabase: necesita pertenecer al rol para hacer SET ROLE.
            con.execute(text("grant lucg_api to postgres"))
            yield con
        finally:
            trans.rollback()
    engine.dispose()


@pytest.mark.parametrize("rol", ["anon", "authenticated"])
def test_data_api_no_lee_la_cola(conexion: Connection, rol: str) -> None:
    conexion.execute(text(f"set local role {rol}"))
    with pytest.raises(ProgrammingError, match="permission denied"):
        conexion.execute(text("select count(*) from public.procrastinate_jobs"))


def test_lucg_api_usa_la_cola(conexion: Connection) -> None:
    conexion.execute(text("set local role lucg_api"))
    total = conexion.execute(text("select count(*) from public.procrastinate_jobs")).scalar_one()
    assert total >= 0


def test_rls_sin_contexto_no_ve_cuentas(conexion: Connection) -> None:
    conexion.execute(text("insert into app.cuentas (tipo, nombre) values ('ALIADO', 'Cuenta de prueba RLS')"))
    visibles_como_dueno = conexion.execute(text("select count(*) from app.cuentas")).scalar_one()
    assert visibles_como_dueno >= 1

    conexion.execute(text("set local role lucg_api"))
    visibles_sin_contexto = conexion.execute(text("select count(*) from app.cuentas")).scalar_one()
    assert visibles_sin_contexto == 0
