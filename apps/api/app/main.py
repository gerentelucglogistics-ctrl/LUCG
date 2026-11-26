import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1
from app.core.config import get_settings
from app.core.errors import registrar_manejadores

settings = get_settings()
if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.app_env, release=settings.app_version, traces_sample_rate=0.1)

app = FastAPI(title="LUCG Plataforma API", version=settings.app_version, docs_url="/docs", openapi_url="/openapi.json")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
registrar_manejadores(app)
app.include_router(api_v1)
