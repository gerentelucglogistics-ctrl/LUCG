# Verificación de la fase 0.1: arranque técnico

> Nota de rama: la rama real es `fase/00.1-arranque-t-cnico` (slug de GSD). CONTEXT dice `fase/0.1-arranque-tecnico`. No se renombra.

Rellenar con enlaces y salidas reales. Una fila sin evidencia no cuenta como verificada.

## Cuentas y paneles

| Decisión | Qué se verifica | Evidencia |
| --- | --- | --- |
| D-01 | Railway a nombre de LUCG, proyecto `lucg` con entornos dev y prod | |
| D-02 | Supabase `lucg-dev` y `lucg-prod` en us-east-1 | |
| D-03 | Organización de GitHub de LUCG con el repositorio transferido | |
| D-04 | Plan Free de Supabase y sin respaldos aceptado | |
| D-18 | Planes gratuitos de Supabase, Sentry, Railway y Vercel | |
| D-19 | Repositorio público, CODEOWNERS, rama por defecto `dev` | |

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

- El paso H-3 de RESEARCH (crear `lucg_api` con contraseña) se adelanta a H-2 del runbook, para que el rol exista con contraseña propia antes del primer push.
