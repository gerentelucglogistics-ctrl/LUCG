from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1
from app.core import version
from app.core.config import get_settings
from app.core.errors import registrar_manejadores
from app.jobs.worker import app as worker_app

settings = get_settings()
if settings.sentry_dsn:
    # D-15 / T-0.1-14: recolección restrictiva (sentry-sdk 3).
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.app_env,
        release=version.sha_completo(),
        traces_sample_rate=0.1,
        data_collection={
            "user_info": False,
            "cookies": {"mode": "off"},
            "http_headers": {
                "request": {
                    "mode": "denylist",
                    "terms": ["authorization", "cookie", "x-api-key", "apikey", "idempotency-key"],
                }
            },
            "http_bodies": [],
            "url_query_params": {"mode": "off"},
            "database_query_data": False,
            "queues": False,
            "stack_frame_variables": {"mode": "denylist", "terms": ["password", "token", "secret", "key"]},
        },
    )


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Abre el pool de procrastinate para poder encolar trabajos desde la API.
    async with worker_app.open_async():
        yield


app = FastAPI(
    title="LUCG Plataforma API",
    version=version.sha_corto(),
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
registrar_manejadores(app)
app.include_router(api_v1)
