FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY app ./app
# VERSION es opcional (respaldo para builds locales); en Railway la versión llega por APP_VERSION.
COPY VERSION* ./
RUN uv sync --frozen --no-dev
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION} PATH="/app/.venv/bin:$PATH" PYTHONPATH=/app
EXPOSE 8000
# API por defecto; el worker usa: procrastinate --app app.jobs.worker.app worker
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips="*"
