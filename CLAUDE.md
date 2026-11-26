# CLAUDE.md — LUCG Plataforma

## Qué es
Plataforma de paquetería y última milla para LUCG LOGISTICS (Urabá, Antioquia). Registra cada envío desde que
entra a bodega hasta que se entrega, para aliados (IMILE primero), clientes directos y ocasionales.
Primer hito: conector IMILE (importar sus archivos de llegada y entregas). MVP: operación propia para aliados.
Glosario y reglas de dominio: skill `lucg-dominio` y `docs/glosario.md`. Nunca inventes estados ni términos.

## Stack (no se cambia sin ADR)
- Base, auth y storage: Supabase (PostgreSQL). Migraciones SQL en `supabase/migrations`, nunca editadas a mano en producción.
- API: FastAPI (Python 3.12, uv). SQLAlchemy 2, Pydantic 2, procrastinate (worker), openpyxl.
- Web (consola, portal, seguimiento): React 19 + Vite + TypeScript, TanStack Query, shadcn/ui, Tailwind 4. pnpm workspaces.
- Sitio público: `apps/site`, Next.js 16 (lucglogistics.com). Leer `apps/site/AGENTS.md` antes de tocarlo. Solo contenido y enlaces al portal/seguimiento; ninguna regla de negocio.
- Identidad visual única en `packages/ui/src/tokens.css` (skill `lucg-ui`).
- PWA repartidor: React + vite-plugin-pwa + Dexie + zxing-wasm + signature_pad.
- Despliegue: Vercel (apps), Railway o Fly (API + worker), Sentry, GitHub Actions.

## Comandos
- `just dev` (todo), `just db-start`, `just db-reset`, `just migrate`, `just test`, `just e2e`, `just gen-client`
- API: `cd apps/api && uv run uvicorn app.main:app --reload`, `uv run pytest -q`, `uv run ruff check`, `uv run mypy app`
- Web/PWA: `pnpm --filter web dev`, `pnpm --filter driver dev --host`, `pnpm lint`, `pnpm typecheck`, `pnpm test`
- Cierre de fase: `just cierre-fase` (push, PR a `dev`, CI, merge, despliegue a dev, pruebas contra dev)

## Reglas que no se negocian
1. Toda tabla de negocio lleva `cuenta_id` y RLS. La API se conecta con el rol `lucg_api` y llama `app.set_contexto(...)` por transacción.
2. La tabla `app.eventos` es inmutable: sin UPDATE ni DELETE. Las correcciones son eventos `CORRECCION`.
3. Solo `modules/envios` escribe eventos (`registrar_evento`). El estado de un envío se deriva, nunca se escribe a mano.
4. Toda escritura desde la PWA y conectores lleva `Idempotency-Key`; reenviar nunca duplica.
5. Ninguna regla de negocio en el navegador. Las apps solo consumen `packages/api-client`.
6. Evidencias (fotos, firmas, archivos IMILE) van a Storage privado y se sirven con URLs firmadas.
7. Fechas: se guardan en UTC, se muestran en America/Bogota, se conserva también la hora del dispositivo.
8. Catálogos con códigos estables; descripciones editables.
9. No se toca prod ni `main` desde una sesión de agente. El MCP de Supabase apunta solo a dev.

## Proceso (GSD estricto)
- No escribas código sin fase planeada en `.planning/phases/<fase>/PLAN.md` y tarea asignada.
- Cada tarea: pruebas en verde → `/simplify` → `/code-review` → commit convencional (`feat|fix|chore|docs|test(fase-x.y): ...`).
- Cada fase cierra con: push, PR a `dev`, CI verde, merge, despliegue automático a dev, verificación en dev
  (Playwright, API, Sentry, Lighthouse/teléfonos si aplica) y evidencia en `.planning/phases/<fase>/verificacion.md`.
- Una fase por sesión. Al cambiar de fase: `/clear` y leer `.planning/STATE.md`.
- Cambios de alcance → nueva fase en `.planning/ROADMAP.md`, nunca "ya que estamos".
- Decisiones de arquitectura → ADR en `docs/adr/` el mismo día.

## Pruebas
- Cobertura mínima: 90 % en `app/modules/envios` y `app/modules/conectores/imile`; 70 % global.
- Fixtures IMILE anonimizadas en `apps/api/tests/fixtures/imile/`.
- Playwright: proyectos `local`, `preview`, `dev` (ver `playwright.config.ts`).

## Configuración de GSD (`.planning/config.json`)
- `mode: yolo` (GSD aprueba sus pasos solo), `model_profile: balanced` con `model_overrides`:
  **Opus** para todo lo que decide o analiza (roadmapper, planner, researchers, plan-checker, debugger, verifier,
  integration/security/UI/Nyquist auditors); **Sonnet** para ejecución (`gsd-executor`, `gsd-codebase-mapper`).
- La sesión principal (discuss, orquestación) corre en Opus (`"model": "opus"` en `.claude/settings.json`).
- Fases críticas (máquina de estados de `envios`, conector IMILE): subir `gsd-executor` a `opus` mientras duren.
- Ramas por fase: `fase/{fase}-{slug}` sobre `dev`. `auto_advance: false`: cada paso (discuss/plan/execute) se lanza a mano.

## Modo YOLO
El trabajo se hace con `defaultMode: bypassPermissions` (o `claude --dangerously-skip-permissions`): el agente no pregunta
por lecturas, escrituras, pruebas, migraciones locales, push ni PR. Límites que sí se respetan (deny en `.claude/settings.json`
+ hook `.claude/hooks/guardia-prod.sh`): nada contra prod, nada de push ni PR hacia `main`, nada de `gh pr merge` a mano,
nada de `git push --force`, nada de leer `.env`.

## Ambientes y ramas (ADR-008)
- `fase/...` → PR → `dev` → ambiente **dev** (automático). `dev` → PR → `main` → ambiente **prod** (solo el desarrollador principal, a mano).
- Trabaja siempre en rama `fase/...`; el peor caso de un error del agente es un PR que CI rechaza o un dev roto.

## Qué no hacer
- Editar datos de prod a mano. Saltarse el plan de fase. Agregar dependencias sin justificar en el PLAN.
- Guardar secretos en el repositorio. Reetiquetar paquetes de IMILE (se escanea su código).
