import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://lucg_api:lucg_api@127.0.0.1:54322/postgres")
os.environ.setdefault("DATABASE_URL_ADMIN", "postgresql+psycopg://postgres:postgres@127.0.0.1:54322/postgres")
os.environ.setdefault("SUPABASE_URL", "http://127.0.0.1:54321")
os.environ.setdefault("SUPABASE_JWKS_URL", "http://127.0.0.1:54321/auth/v1/.well-known/jwks.json")


@pytest.fixture
def client() -> TestClient:
    from app.main import app

    return TestClient(app)
