# Verificación de la fase 0.1: arranque técnico

> Nota de rama: la rama real es `fase/00.1-arranque-t-cnico` (slug de GSD). CONTEXT dice `fase/0.1-arranque-tecnico`. No se renombra.

Rellenar con enlaces y salidas reales. Una fila sin evidencia no cuenta como verificada.

## Cuentas y paneles

| Decisión | Qué se verifica | Evidencia |
| --- | --- | --- |
| D-01 | Railway a nombre de LUCG, proyecto `lucg` con entornos dev y prod | 2026-11-27, API GraphQL (agente, dev): proyecto `lucg` `5f527e12-fc1f-41ef-92e5-0d4258de7241`, entorno `dev`, servicios `api` y `worker` sin repo, región `us-east4-eqdc4a` (Virginia), variables del contrato + `PORT=8000` en api, dominio `api-dev.lucglogistics.com` → CNAME `ilv9jyp0.up.railway.app`. Entorno `prod`: script del desarrollador. |
| D-02 | Supabase `lucg-dev` y `lucg-prod` en us-east-1 | 2026-11-27, API de gestión: `lucg-dev mrmmnotufnenuanapdng us-east-1 ACTIVE_HEALTHY`, `lucg-prod hzzbrylozdqpvoxrktpp us-east-1 ACTIVE_HEALTHY`. Pooler de ambos: `aws-2-us-east-1.pooler.supabase.com`. JWKS solo `EC` en los dos; auth health 200; signup → `signup_disabled` (dev). Los dos se recrearon porque se habían creado en us-east-2 y us-west-2 (dev lo recreó el agente; prod, el desarrollador con un script). |
| D-03 | Organización de GitHub de LUCG con el repositorio transferido | Pendiente: GitHub no permitió crear la organización (D-19 enmendada 2026-11-27). Repo en `gerentelucglogistics-ctrl/LUCG`; administración por token fine-grained de esa cuenta. |
| D-04 | Plan Free de Supabase y sin respaldos aceptado | |
| D-18 | Planes gratuitos de Supabase, Sentry, Railway y Vercel | Sentry 2026-11-27: org `lucg-logistics` (región US, `us.sentry.io`), proyectos `api` (python-fastapi), `web` y `driver` (javascript-react); Data Scrubber, Default Scrubbers y Prevent Storing of IP Addresses activos (API). Evento de ingesta de prueba a `api`: HTTP 200. |
| D-19 | Repositorio público, CODEOWNERS, rama por defecto `dev` | `gh repo view`: `PUBLIC dev` (2026-11-27). CODEOWNERS: plan 11. |

## Pipeline dev

| Elemento | Evidencia |
| --- | --- |
| PR de la fase hacia `dev` | |
| Run de CI | |
| Run de despliegue a dev | |
| `supabase migration list --remote` (dev) | |
| Health de `api-dev` | |
| e2e contra dev | |
| Salud diaria | |

## Criterios en dev

| Decisión | Criterio | Evidencia |
| --- | --- | --- |
| D-08 | | |
| D-09 | | |
| D-11 | | |
| D-12 | | |
| D-13 | | |
| D-14 | | |
| D-15 | | |
| D-16 | | |
| D-17 | | |

## Prod (humano, D-07)

| Elemento | Evidencia |
| --- | --- |
| PR `dev → main` fusionado con merge commit | |
| Despliegue a prod aprobado | |
| Health de `api.lucglogistics.com` (version, db, rol_db) | |
| Dominios de prod abiertos | |
| Errores de prueba en Sentry (environment=prod) | |
| Salud diaria ejecutada | |

## Desviaciones

- Railway ya no acepta Config as Code (`railway.json`) en proyectos nuevos: responde "deprecated. Use Infrastructure as Code (.railway/railway.ts)". Se usó el plan B del runbook (H-4): la misma configuración de `apps/api/railway.api.json` y `railway.worker.json` (Dockerfile, healthcheck, start command, restart, región) se fijó directamente en cada servicio por la API. Los dos JSON quedan como referencia; migrar a `.railway/railway.ts` va como fase nueva en el ROADMAP, no en esta.
- Se fija `PORT=8000` en el servicio `api` para que coincida con el `targetPort` del dominio propio.
- Los secretos (contraseñas de `postgres` y `lucg_api`, tokens de despliegue) los generó el agente o el script sin imprimirlos, y viven en el llavero de macOS del desarrollador hasta cargarlos en GitHub.

- El paso H-3 de RESEARCH (crear `lucg_api` con contraseña) se adelanta a H-2 del runbook, para que el rol exista con contraseña propia antes del primer push.
