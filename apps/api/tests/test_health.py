from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.core import db, version
from app.core.config import get_settings

SHA = "a" * 39 + "b"


def test_health_responde_con_base(client: TestClient) -> None:
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    cuerpo = r.json()
    assert cuerpo["status"] == "ok"
    assert cuerpo["db"] is True
    assert cuerpo["rol_db"] == "lucg_api"
    assert "version" in cuerpo
    assert "env" in cuerpo


def test_health_degradado_sin_base(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(db, "ping", lambda: None)
    r = client.get("/api/v1/health")
    assert r.status_code == 503
    assert r.json()["status"] == "degradado"
    assert r.json()["db"] is False


def test_version_lee_archivo(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    archivo = tmp_path / "VERSION"
    archivo.write_text(SHA + "\n")
    monkeypatch.setattr(version, "RUTA_VERSION", archivo)
    monkeypatch.setattr(get_settings(), "app_version", "dev")
    assert version.sha_completo() == SHA
    assert version.sha_corto() == SHA[:7]


def test_version_sin_archivo_usa_app_version(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(version, "RUTA_VERSION", tmp_path / "no-existe")
    monkeypatch.setattr(get_settings(), "app_version", "dev")
    assert version.sha_completo() == "dev"


def test_version_prefiere_app_version(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    archivo = tmp_path / "VERSION"
    archivo.write_text("f" * 40)
    monkeypatch.setattr(version, "RUTA_VERSION", archivo)
    monkeypatch.setattr(get_settings(), "app_version", SHA)
    assert version.sha_completo() == SHA
    assert version.sha_corto() == SHA[:7]
