from pathlib import Path

from app.core.config import get_settings

# Respaldo local: archivo VERSION junto a pyproject.toml (/app/VERSION en la imagen).
RUTA_VERSION = Path(__file__).resolve().parents[2] / "VERSION"


def sha_completo() -> str:
    """APP_VERSION (fijada por el pipeline) y, si es "dev", el archivo VERSION como respaldo."""
    app_version = get_settings().app_version
    if app_version != "dev":
        return app_version
    try:
        contenido = RUTA_VERSION.read_text().strip()
    except OSError:
        return app_version
    return contenido or app_version


def sha_corto() -> str:
    return sha_completo()[:7]
