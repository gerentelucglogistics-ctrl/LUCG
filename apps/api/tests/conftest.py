import os
import time
import uuid
from collections.abc import Callable
from types import SimpleNamespace
from typing import Any

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://lucg_api:lucg_api@127.0.0.1:55322/postgres")
os.environ.setdefault("DATABASE_URL_ADMIN", "postgresql+psycopg://postgres:postgres@127.0.0.1:55322/postgres")
os.environ.setdefault("SUPABASE_URL", "http://127.0.0.1:55321")
os.environ.setdefault("SUPABASE_JWKS_URL", "http://127.0.0.1:55321/auth/v1/.well-known/jwks.json")


@pytest.fixture
def client() -> TestClient:
    from app.main import app

    return TestClient(app)


@pytest.fixture
def clave_ec() -> ec.EllipticCurvePrivateKey:
    return ec.generate_private_key(ec.SECP256R1())


@pytest.fixture
def emitir_token(clave_ec: ec.EllipticCurvePrivateKey) -> Callable[..., str]:
    """Fábrica de JWT. Overrides de claims por kwargs; `algoritmo` y `clave` cambian la firma."""
    from app.core.config import get_settings

    iss = f"{str(get_settings().supabase_url).rstrip('/')}/auth/v1"

    def _emitir(*, algoritmo: str = "ES256", clave: Any = None, **overrides: Any) -> str:
        claims: dict[str, Any] = {
            "sub": str(uuid.uuid4()),
            "aud": "authenticated",
            "iss": iss,
            "exp": int(time.time()) + 3600,
            "app_metadata": {"org_tipo": "lucg", "roles": ["superadministrador"]},
        }
        claims.update(overrides)
        return jwt.encode(claims, clave if clave is not None else clave_ec, algorithm=algoritmo)

    return _emitir


@pytest.fixture
def jwks_falso(monkeypatch: pytest.MonkeyPatch, clave_ec: ec.EllipticCurvePrivateKey) -> Callable[..., None]:
    """Sustituye app.core.auth._jwks por un cliente falso (ninguna prueba depende de GoTrue)."""

    def _instalar(clave_publica: Any = None) -> None:
        clave = clave_publica if clave_publica is not None else clave_ec.public_key()
        falso = SimpleNamespace(get_signing_key_from_jwt=lambda _t: SimpleNamespace(key=clave))
        monkeypatch.setattr("app.core.auth._jwks", lambda: falso)

    return _instalar
