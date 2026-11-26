FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev --no-install-project || uv sync --no-dev --no-install-project
COPY app ./app
RUN uv sync --no-dev
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION} PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
# API por defecto; el worker usa: procrastinate --app app.jobs.worker.app worker
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
