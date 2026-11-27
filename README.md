# LUCG Plataforma

Plataforma de paquetería y última milla de LUCG LOGISTICS (Urabá, Antioquia).
Monorepo: sitio público en Next.js, API en FastAPI, consola y portal en React, app del repartidor como PWA, base en Supabase.

## Mapa

| Ruta | Qué es |
| --- | --- |
| `apps/api` | API FastAPI + worker (procrastinate). Python 3.12, uv |
| `apps/site` | Sitio público lucglogistics.com (Next.js 16). Enlaza al portal y al seguimiento |
| `apps/web` | Consola administrativa, portal de cuentas y seguimiento público (React + Vite) |
| `apps/driver` | App del repartidor (PWA React + Vite, Dexie, zxing) |
| `packages/api-client` | Cliente TypeScript generado desde OpenAPI |
| `packages/ui` | Componentes compartidos y tokens de marca (`tokens.css`) |
| `brand/` | Logos originales en SVG |
| `packages/domain` | Enums y tipos de dominio compartidos |
| `supabase/` | Migraciones SQL, seed y configuración |
| `docs/adr` | Decisiones de arquitectura |
| `docs/runbooks` | Operación: despliegue, restauración, incidentes |
| `.planning/` | Artefactos de GSD (PROJECT, REQUIREMENTS, ROADMAP, STATE, fases) |
| `.claude/` | CLAUDE.md, permisos y skills propias del proyecto |
| `e2e/` | Pruebas Playwright (local, vista previa y dev) |

## Comandos del día a día

Ver `justfile`: `just dev`, `just db-start`, `just db-reset`, `just migrate`, `just test`, `just e2e`,
`just gen-client`, `just smoke dev`, `just cierre-fase`.

## Cómo se trabaja

GSD estricto (modo yolo, perfil balanced: Opus decide, Sonnet ejecuta): discutir → investigar → planear → ejecutar → publicar y
desplegar en dev → verificar en dev → cerrar. Ramas: `fase/...` → `dev` (ambiente dev) → `main` (prod, a mano). Ver ADR-007 y ADR-008.
Detalle en `.planning/` y en `CLAUDE.md`.
