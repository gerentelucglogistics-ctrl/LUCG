from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated, Any

import jwt
from fastapi import Depends, Header, HTTPException, status
from jwt import PyJWKClient

from app.core.config import get_settings


@dataclass(frozen=True)
class Principal:
    user_id: str
    org_tipo: str  # 'lucg' | 'cuenta'
    org_id: str | None
    roles: list[str]
    dispositivo_id: str | None = None


@lru_cache
def _jwks() -> PyJWKClient:
    return PyJWKClient(str(get_settings().supabase_jwks_url), cache_keys=True)


def _decodificar(token: str) -> dict[str, Any]:
    key = _jwks().get_signing_key_from_jwt(token).key
    return jwt.decode(
        token, key, algorithms=["ES256", "RS256", "HS256"], audience=get_settings().supabase_jwt_audience
    )


def principal_actual(authorization: Annotated[str | None, Header()] = None) -> Principal:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Falta el token")
    try:
        claims = _decodificar(authorization.split(" ", 1)[1])
    except jwt.PyJWTError as e:  # pragma: no cover - depende del proveedor
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido") from e
    meta = claims.get("app_metadata", {}) or {}
    return Principal(
        user_id=claims["sub"],
        org_tipo=meta.get("org_tipo", "cuenta"),
        org_id=meta.get("org_id"),
        roles=list(meta.get("roles", [])),
        dispositivo_id=meta.get("dispositivo_id"),
    )


def requiere_rol(*roles: str):  # type: ignore[no-untyped-def]
    def dep(p: Annotated[Principal, Depends(principal_actual)]) -> Principal:
        if p.org_tipo == "lucg" and ("superadministrador" in p.roles or any(r in p.roles for r in roles)):
            return p
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Sin permiso")

    return dep
