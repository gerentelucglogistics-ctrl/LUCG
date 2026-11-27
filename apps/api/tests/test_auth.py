import time
from collections.abc import Callable

import httpx
import pytest
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def _jwks(jwks_falso: Callable[..., None]) -> None:
    jwks_falso()


def _get(client: TestClient, token: str | None) -> httpx.Response:
    cab = {"Authorization": f"Bearer {token}"} if token else {}
    return client.get("/api/v1/yo", headers=cab)


def test_token_valido_es256(client: TestClient, emitir_token: Callable[..., str]) -> None:
    assert _get(client, emitir_token()).status_code == 200


def test_aud_incorrecto(client: TestClient, emitir_token: Callable[..., str]) -> None:
    r = _get(client, emitir_token(aud="otro"))
    assert r.status_code == 401
    assert r.json()["detail"] == "Token inválido"


def test_hs256_rechazado(
    client: TestClient, emitir_token: Callable[..., str], jwks_falso: Callable[..., None]
) -> None:
    secreto = "s" * 48
    jwks_falso(clave_publica=secreto)
    assert _get(client, emitir_token(algoritmo="HS256", clave=secreto)).status_code == 401


def test_token_expirado(client: TestClient, emitir_token: Callable[..., str]) -> None:
    assert _get(client, emitir_token(exp=int(time.time()) - 60)).status_code == 401


def test_sin_token(client: TestClient) -> None:
    r = _get(client, None)
    assert r.status_code == 401
    assert r.json()["detail"] == "Falta el token"


def test_iss_incorrecto(client: TestClient, emitir_token: Callable[..., str]) -> None:
    assert _get(client, emitir_token(iss="https://otro-proyecto.supabase.co/auth/v1")).status_code == 401
