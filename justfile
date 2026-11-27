set shell := ["bash", "-euo", "pipefail", "-c"]

default:
	@just --list

# Arranca Supabase local, API, worker y apps
dev:
	supabase start
	(cd apps/api && uv run uvicorn app.main:app --reload --port 8000) &
	(cd apps/api && PYTHONPATH=. uv run procrastinate --app app.jobs.worker.app worker) &
	pnpm -r --parallel dev

db-start:
	supabase start

db-stop:
	supabase stop

# Aplica migraciones y seed en local desde cero
db-reset:
	supabase db reset

# Crea una migración nueva: just migration nombre
migration nombre:
	supabase migration new {{nombre}}

# Aplica migraciones pendientes solo a la base local. Las bases alojadas solo las migra migrate.yml (D-16)
migrate:
	supabase migration up

# Crea el usuario de e2e en la base local (requiere SUPABASE_SECRET_KEY, E2E_USER_ADMIN, E2E_PASS_ADMIN)
sembrar-local:
	./scripts/sembrar-usuario-e2e.sh local

# Pruebas unitarias e integración (API) y unitarias (apps)
test:
	cd apps/api && uv run pytest -q --cov=app --cov-report=term-missing
	pnpm test

lint:
	cd apps/api && uv run ruff check && uv run ruff format --check && uv run mypy app
	pnpm lint && pnpm typecheck

# Playwright local
e2e:
	pnpm e2e

# Genera el cliente TypeScript desde la API local
gen-client:
	curl -sf http://localhost:8000/openapi.json > packages/api-client/openapi.json
	pnpm gen-client

# Humo contra un entorno: just smoke dev | prod
smoke entorno:
	./scripts/smoke.sh {{entorno}}

# Cierre de fase: push, PR a dev, CI, merge, despliegue a dev y pruebas contra dev
cierre-fase:
	./scripts/cierre-fase.sh
