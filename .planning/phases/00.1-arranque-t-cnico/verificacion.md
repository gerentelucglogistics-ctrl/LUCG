# Verificación de la fase 0.1: arranque técnico

> Nota de rama: la rama real es `fase/00.1-arranque-t-cnico` (slug de GSD). CONTEXT dice `fase/0.1-arranque-tecnico`. No se renombra.

Rellenar con enlaces y salidas reales. Una fila sin evidencia no cuenta como verificada.

## Cuentas y paneles

| Decisión | Qué se verifica | Evidencia |
| --- | --- | --- |
| D-01 | Railway a nombre de LUCG, proyecto `lucg` con entornos dev y prod | 2026-11-27, API GraphQL (agente, dev): proyecto `lucg` `5f527e12-fc1f-41ef-92e5-0d4258de7241`, entorno `dev`, servicios `api` y `worker` sin repo, región `us-east4-eqdc4a` (Virginia), variables del contrato + `PORT=8000` en api, dominio `api-dev.lucglogistics.com` → CNAME `ilv9jyp0.up.railway.app`. Entorno `prod`: script del desarrollador. |
| D-02 | Supabase `lucg-dev` y `lucg-prod` en us-east-1 | 2026-11-27, API de gestión: `lucg-dev mrmmnotufnenuanapdng us-east-1 ACTIVE_HEALTHY`, `lucg-prod hzzbrylozdqpvoxrktpp us-east-1 ACTIVE_HEALTHY`. Pooler de ambos: `aws-2-us-east-1.pooler.supabase.com`. JWKS solo `EC` en los dos; auth health 200; signup → `signup_disabled` (dev). Los dos se recrearon porque se habían creado en us-east-2 y us-west-2 (dev lo recreó el agente; prod, el desarrollador con un script). |
| D-03 | Organización de GitHub de LUCG con el repositorio transferido | Pendiente: GitHub no permitió crear la organización (D-19 enmendada 2026-11-27). Repo en `gerentelucglogistics-ctrl/LUCG`; administración por token fine-grained de esa cuenta. |
| D-04 | Plan Free de Supabase y sin respaldos aceptado | `lucg-dev` y `lucg-prod` en la org Free `ihbhuvaiorrhmumgmysg` (gerentelucglogistics-ctrl's Org); sin respaldos, aceptado por D-04. |
| D-18 | Planes gratuitos de Supabase, Sentry, Railway y Vercel | Supabase Free; Railway Hobby (USD 5/mes, D-18); Vercel team `lucg` plan `hobby` (A14: riesgo de uso comercial en Hobby aceptado). Sentry 2026-11-27: org `lucg-logistics` (región US, `us.sentry.io`), proyectos `api` (python-fastapi), `web` y `driver` (javascript-react); Data Scrubber, Default Scrubbers y Prevent Storing of IP Addresses activos (API). Evento de ingesta de prueba a `api`: HTTP 200. |
| D-19 | Repositorio público, CODEOWNERS, rama por defecto `dev` | `gh repo view`: `PUBLIC dev` (2026-11-27). `.github/CODEOWNERS` asigna `@jaras97` (raíz, migraciones, envios, sitio, tokens.css, workflows, .claude). |

## Suite local antes del cierre (plan 11, 2026-11-27)

- `supabase db reset` OK; API: ruff, ruff format, mypy (18 archivos) sin errores; pytest 28 passed, cobertura 95,10 % (mínimo 70 %).
- Web: `pnpm install --frozen-lockfile`, lint, typecheck, test y build en verde (site, web, driver).
- Cliente: OpenAPI regenerado con el env de `ci.yml`; `git diff --exit-code packages/api-client/src/schema.ts` sin cambios.
- Protección de `dev` aplicada: checks `["api","web"]`, strict, `enforce_admins` true, sin force push ni borrado.
- Contrato GitHub: 13 variables de repo, 3 de `dev`; secretos repo 7, `dev` 4, `prod` 3 (solo nombres).

## Pipeline dev

| Elemento | Evidencia |
| --- | --- |
| PR de la fase hacia `dev` | https://github.com/gerentelucglogistics-ctrl/LUCG/pull/2, fusionado (squash) 2026-11-27T19:25:24Z, commit `d20ad04` |
| Run de CI | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46056284292: `api`, `web`, `visual-sitio`, `e2e-preview` pass; Vercel lucg, lucg-web, lucg-driver pass. Antes: 3 runs rojos corregidos en la rama (setup-uv@v10 inexistente, env del job api, Node 20 vs pnpm 11). |
| Run de despliegue a dev | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46056594931: success en `migraciones / migrar`, `api`, `apps`, `sembrar-e2e`, `sentry`, `e2e / verificar` |
| `supabase migration list --remote` (dev) | `Target: project lucg-dev (mrmmnotufnenuanapdng)`; Local = Remote: `20261105000000` (0001) y `20261126225903` (0002) |
| Health de `api-dev` | `{"status":"ok","db":true,"rol_db":"lucg_api","version":"d20ad04","env":"dev"}` (version = SHA corto de la fusión) |
| e2e contra dev | 6 passed (8.6 s): smoke (consola + versión), login admin + contexto, credenciales malas, worker ping, 401 sin token, PWA sin conexión (manifest instalable). Artefacto `playwright-dev` del run de despliegue. |
| Salud diaria | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46057054083 (workflow_dispatch desde `dev`): pata dev success; pata prod failure esperado (prod sin desplegar hasta el plan 12) |

## Criterios en dev

| Decisión | Criterio | Evidencia |
| --- | --- | --- |
| D-08 | Salud diaria por dispatch desde la rama por defecto, pata dev verde | run 46057054083: dev success (prod pendiente del plan 12) |
| D-09 | El sitio construye dentro del monorepo y responde en dev | `next build` en el job `web` del CI y en Vercel (lucg pass); `https://dev.lucglogistics.com listo` (200 con bypass, job `apps`) |
| D-11 | `visual-sitio` reporta en el PR | job `visual-sitio` pass en el CI del PR #2 |
| D-12 | e2e de login contra app-dev | `login.spec.ts` ✓ (admin entra y la API aplica su contexto; credenciales malas → error) |
| D-13 | e2e sin red de la PWA contra repartidor-dev | `driver-offline.spec.ts` ✓ (manifest instalable y abre sin red). DevTools › Manifest y service worker activo: verificado por el desarrollador el 2026-11-27 ("dev verificado") |
| D-14 | Health con SHA, db y rol; worker procesa | health `version d20ad04, db true, rol_db lucg_api`; `worker.spec.ts` ✓ (job ping succeeded) |
| D-15 | Release de Sentry por pipeline | job `sentry` success (release `d20ad04…`, environment dev, proyectos api web driver). Errores de prueba 2026-11-27, los tres con environment=dev y release `d20ad04c054648a9dbc992e4e53cb2f51fff0bd9`: API-2 https://lucg-logistics.sentry.io/issues/7871272417/ (POST /diagnostico/error, 500), WEB-1 https://lucg-logistics.sentry.io/issues/7871273541/ (botón de la consola), DRIVER-1 https://lucg-logistics.sentry.io/issues/7871270596/ (diagnóstico de la PWA). Login con E2E_USER_ADMIN y consola con rol_db `lucg_api`, org_tipo `lucg`: desarrollador. |
| D-16 | Migraciones por pipeline en dev | job `migraciones / migrar` success; `migration list --remote` con 0001 y 0002 |
| D-17 | CI requerido y `dev` protegida | `dev`: checks `["api","web"]`, strict, `enforce_admins` true, sin force push ni borrado; la fusión pasó solo con ambos en verde |

## Prod (humano, D-07)

| Elemento | Evidencia |
| --- | --- |
| Protección de `main` (D-17) | Script del desarrollador 2026-11-27: checks `api, web, visual-sitio`, PR obligatorio, `enforce_admins`, sin force push ni borrado (strict retirado después, ver desviaciones) |
| Admin de prod (H-9) | `admin@lucglogistics.com` creado por la API de auth de prod (script del desarrollador), `app_metadata` `org_tipo=lucg`, `roles=[superadministrador]`; contraseña en el llavero (`lucg-prod-admin`) |
| PR `dev → main` fusionado con merge commit | https://github.com/gerentelucglogistics-ctrl/LUCG/pull/3 → `d98a6f5` (padres `6aa645b` y `de6ae59`). Antes, sincronización `main → dev`: PR #4 (`761c75e`) |
| Despliegue a prod aprobado | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46078967305: aprobacion, migraciones, api success; `humo` falló solo en el sitio (308 a `www`, arreglado en PR #6 para el próximo despliegue), por eso el paso de release de Sentry de prod no corrió |
| Health de `api.lucglogistics.com` (version, db, rol_db) | `{"status":"ok","db":true,"rol_db":"lucg_api","version":"d98a6f5","env":"prod"}` |
| Dominios de prod abiertos | app 200, repartidor 200, lucglogistics.com 308 → www 200 (todo servido por Vercel; api por Railway) |
| Errores de prueba en Sentry (environment=prod, release `d98a6f5`) | API https://lucg-logistics.sentry.io/issues/7871272417/ (evento 23:03 y 23:06), consola https://lucg-logistics.sentry.io/issues/7871422159/ (Chromium limpio, script del desarrollador; login con rol_db `lucg_api`, org_tipo `lucg`), PWA https://lucg-logistics.sentry.io/issues/7871420932/ |
| Salud diaria ejecutada | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46080368285: dev y prod success (D-08) |

## Estado final D-01..D-20

| Decisión | Estado | Evidencia |
| --- | --- | --- |
| D-01 | ✓ | Railway `lucg`: servicios api y worker en dev y prod (Cuentas y paneles) |
| D-02 | ✓ | Supabase us-east-1 (dev y prod), Railway us-east4 |
| D-03 | Parcial (enmendada) | Cuentas de LUCG en Supabase, Vercel, Railway y Sentry; la organización de GitHub no se pudo crear, el repo sigue en `gerentelucglogistics-ctrl` (STATE.md) |
| D-04 | ✓ riesgo aceptado | Supabase Free sin respaldos en dev y prod |
| D-05 | ✓ | Subdominios reales `dev.`, `app-dev.`, `repartidor-dev.`, `api-dev.` sirviendo en dev (e2e contra ellos) |
| D-06 | ✓ | DNS en Vercel; `api-dev` y `api` por CNAME a Railway (`dig`) |
| D-07 | ✓ | Prod creado y desplegado con el esqueleto (tabla Prod) |
| D-08 | ✓ | Salud diaria run 46080368285, dev y prod verdes |
| D-09 | ✓ | Sitio construye en el monorepo; `visual-sitio` pass en PR #3 contra prod |
| D-10 | ✓ | Proyecto Vercel `lucg` con Root Directory `apps/site`; lucglogistics.com servido desde `main` |
| D-11 | ✓ | `visual-sitio` pass (PR #2 y PR #3) |
| D-12 | ✓ | Login real en dev (e2e) y prod (script), rol_db `lucg_api`, org_tipo `lucg` |
| D-13 | ✓ | `driver-offline.spec.ts` ✓; DevTools › Manifest verificado por el desarrollador |
| D-14 | ✓ | Health con SHA en dev (`d9ee67c` tras PR #6) y prod (`d98a6f5`); worker ping ✓ |
| D-15 | ✓ | 3 errores en dev y 3 en prod con environment y release correctos |
| D-16 | ✓ | Migraciones por pipeline en dev y prod |
| D-17 | ✓ (enmendada) | CI requerido en dev (`api, web`) y main (`api, web, visual-sitio`), sin strict |
| D-18 | ✓ | Planes gratuitos/Hobby |
| D-19 | Parcial (enmendada) | Repo público, rama por defecto `dev`, CODEOWNERS; sin organización (ver D-03) |
| D-20 | ✓ | GSD normalizado en `26da779` (plan 01) |

## Desviaciones

- e2e-preview SÍ corrió en el primer PR (pass): api-dev ya existía porque el plan 10 lo creó antes del cierre.
- Pendiente conocido (no es criterio de la fase): el paso "Contrato de API (Schemathesis)" de `e2e-dev.yml` no prueba nada; usa la opción `--hypothesis-max-examples`, que ya no existe (hoy es `--max-examples`), y el secreto `E2E_TOKEN_ADMIN`, que no está creado, y `|| true` oculta el error. Va al backlog.
- CI necesitó tres correcciones en la rama: `astral-sh/setup-uv@v10.4.0` (no existe la etiqueta `v10`), `env` a nivel del job `api` (la exportación de OpenAPI importa `app.main`), `.nvmrc` 20 → 24 (pnpm 11 exige Node ≥ 22.13). Vercel `lucg-web` y `lucg-driver` se alinearon a Node 24.x.
- `cierre-fase.sh` espera a que GitHub registre los checks requeridos antes de vigilarlos (la primera corrida salió con "no checks reported").

- Railway ya no acepta Config as Code (`railway.json`) en proyectos nuevos: responde "deprecated. Use Infrastructure as Code (.railway/railway.ts)". Se usó el plan B del runbook (H-4): la misma configuración de `apps/api/railway.api.json` y `railway.worker.json` (Dockerfile, healthcheck, start command, restart, región) se fijó directamente en cada servicio por la API. Los dos JSON quedan como referencia; migrar a `.railway/railway.ts` va como fase nueva en el ROADMAP, no en esta.
- Se fija `PORT=8000` en el servicio `api` para que coincida con el `targetPort` del dominio propio.
- Los secretos (contraseñas de `postgres` y `lucg_api`, tokens de despliegue) los generó el agente o el script sin imprimirlos, y viven en el llavero de macOS del desarrollador hasta cargarlos en GitHub.

- El paso H-3 de RESEARCH (crear `lucg_api` con contraseña) se adelanta a H-2 del runbook, para que el rol exista con contraseña propia antes del primer push.

- **Errores de prueba de la consola y la API (plan 12):** los clics del desarrollador no llegaron a Sentry (la PWA sí). La configuración estaba bien (DSN de cada proyecto, environment y release). El agente los disparó contra dev: la API con un token del admin e2e y la consola en Chromium limpio (envelope 200). Causa probable: un bloqueador en el navegador del desarrollador corta `*.ingest.sentry.io`. Para prod, probar en una ventana sin extensiones. Un `tunnel` de Sentry quedaría como mejora futura.
- **D-17 enmendada, sin "up to date" (strict) en dev ni en main (2026-11-27, el desarrollador):** con strict en las dos ramas y fusiones con merge commit, `dev → main` y `main → dev` se bloqueaban entre sí (el PR #1 de Netlify en main dejó a dev atrás; cada merge commit en main repite el problema). Se conservan los checks requeridos, el PR obligatorio en main y enforce_admins. Sincronización `main → dev`: PR #4 con merge commit.
- **Release de Sentry por pipeline:** `set-commits --auto` fallaba con checkout superficial (no encuentra el SHA de la release anterior). Se agregó `fetch-depth: 0` e `ignore_missing: true` en deploy-dev y deploy-prod.
- **e2e-preview solo en PR hacia dev:** en los PR con main esperaba 10 minutos una vista previa de Vercel que no existe (main publica en Production).
- **`cierre-fase.sh` tomaba un PR ya fusionado:** con la rama de fase reutilizada, `gh pr view <rama>` devolvía el PR #2 y no abría uno nuevo. Ahora solo considera PR abiertos (PR #5).
- **Humo en prod:** el dominio raíz responde 308 a `www`; `smoke.sh` ahora sigue redirecciones (PR #6, entra a prod en el próximo `dev → main`).
- **Aprobación de prod por job:** `deploy-prod.yml` tiene 4 jobs con `environment: prod` y GitHub pide aprobar cada uno (4 clics). Pendiente: una sola aprobación (backlog).
- **Revisores de prod:** se agregó `gerentelucglogistics-ctrl` junto a `jaras97` (decisión del desarrollador); una misma cuenta puede fusionar y aprobar.
- **Errores de la consola desde el navegador del desarrollador:** ni en dev ni en prod llegaron (Sentry no registró nada, ni descartado); la API y la PWA sí. Desde Chromium limpio llegan. Queda como mejora un `tunnel` de Sentry si se repite con usuarios reales.
