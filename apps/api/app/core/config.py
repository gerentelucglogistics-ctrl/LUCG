from functools import lru_cache

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración leída de variables de entorno o .env. Falla al arrancar si falta algo obligatorio."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = Field(default="local", alias="APP_ENV")
    app_version: str = Field(default="dev", alias="APP_VERSION")
    database_url: str = Field(alias="DATABASE_URL")
    supabase_url: AnyUrl = Field(alias="SUPABASE_URL")
    supabase_jwks_url: AnyUrl = Field(alias="SUPABASE_JWKS_URL")
    supabase_jwt_audience: str = Field(default="authenticated", alias="SUPABASE_JWT_AUDIENCE")
    supabase_service_key: str = Field(default="", alias="SUPABASE_SERVICE_KEY")
    storage_bucket_evidencias: str = Field(default="evidencias", alias="STORAGE_BUCKET_EVIDENCIAS")
    storage_bucket_importaciones: str = Field(default="importaciones", alias="STORAGE_BUCKET_IMPORTACIONES")
    sentry_dsn: str = Field(default="", alias="SENTRY_DSN")
    cors_origins: str = Field(default="", alias="CORS_ORIGINS")

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
