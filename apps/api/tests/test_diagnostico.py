from collections.abc import Callable
from typing import Any

import pytest
from fastapi.testclient import TestClient

RUTAS = [
    ("post", "/api/v1/diagnostico/ping"),
    ("post", "/api/v1/diagnostico/error"),
    ("get", "/api/v1/diagnostico/jobs/1"),
]
SIN_ROL: list[dict[str, Any]] = [
    {"org_tipo": "cuenta", "roles": ["superadministrador"]},
    {"org_tipo": "lucg", "roles": []},
]


@pytest.mark.parametrize(("metodo", "ruta"), RUTAS)
def test_diagnostico_sin_token_401(client: TestClient, metodo: str, ruta: str) -> None:
    assert getattr(client, metodo)(ruta).status_code == 401


@pytest.mark.parametrize(("metodo", "ruta"), RUTAS)
@pytest.mark.parametrize("meta", SIN_ROL)
def test_diagnostico_sin_rol_403(
    client: TestClient,
    emitir_token: Callable[..., str],
    jwks_falso: Callable[..., None],
    metodo: str,
    ruta: str,
    meta: dict[str, Any],
) -> None:
    jwks_falso()
    token = emitir_token(app_metadata=meta)
    r = getattr(client, metodo)(ruta, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 403


def test_error_de_prueba_lanza(
    client: TestClient, emitir_token: Callable[..., str], jwks_falso: Callable[..., None]
) -> None:
    jwks_falso()
    with pytest.raises(RuntimeError, match="Error de prueba Sentry"):
        client.post("/api/v1/diagnostico/error", headers={"Authorization": f"Bearer {emitir_token()}"})


def test_ping_se_encola(
    client: TestClient, emitir_token: Callable[..., str], jwks_falso: Callable[..., None]
) -> None:
    jwks_falso()
    h = {"Authorization": f"Bearer {emitir_token()}"}
    r = client.post("/api/v1/diagnostico/ping", headers=h)
    assert r.status_code == 200
    job_id = r.json()["job_id"]
    assert isinstance(job_id, int)
    r2 = client.get(f"/api/v1/diagnostico/jobs/{job_id}", headers=h)
    assert r2.json() == {"job_id": job_id, "estado": "todo"}
