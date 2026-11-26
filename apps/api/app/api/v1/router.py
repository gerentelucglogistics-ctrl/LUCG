from fastapi import APIRouter

from app.api.v1 import health

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(health.router)
# Fase 1.1+: api_v1.include_router(envios.router), importaciones, recepciones, hojas_ruta,
# sync, evidencias, ...
