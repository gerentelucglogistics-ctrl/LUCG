from collections.abc import Callable

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def _jwks(jwks_falso: Callable[..., None]) -> None:
    jwks_falso()


def test_yo_aplica_contexto(client: TestClient, emitir_token: Callable[..., str]) -> None:
    token = emitir_token(sub="11111111-1111-1111-1111-111111111111")
    r = client.get("/api/v1/yo", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json() == {
        "usuario": "11111111-1111-1111-1111-111111111111",
        "roles": ["superadministrador"],
        "rol_db": "lucg_api",
        "org_tipo": "lucg",
        "interno": True,
    }
