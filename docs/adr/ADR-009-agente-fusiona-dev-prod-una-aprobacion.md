# ADR-009: El agente fusiona a dev; prod con una sola aprobación humana
**Estado:** Propuesto · enmienda ADR-008 · **Fecha:** 2026-11-28 · **Deciden:** desarrollador principal

## Contexto
- Hallazgo C-2 de `00.1-SECURITY.md` (alta): el agente podía llegar a `main` y a prod por `gh api` (fusionar PRs, aprobar
  `pending_deployments`, despachar `deploy-prod`, cambiar `environments/prod`), y usaba la misma identidad que el revisor de prod.
- Hallazgo C-4 (baja): GitHub sin organización ni admin nominal; el repo sigue en `gerentelucglogistics-ctrl/LUCG`.
- El desarrollador pidió no aprobar nada en `dev`: el agente fusiona y despliega a dev; el humano solo aprueba prod al cerrar cada fase.

## Decisión (propuesta)
- El agente trabaja con su propia cuenta de GitHub (`lucglogisticsbot`), colaboradora con `write` y sin admin, que no es revisora de prod.
- El agente fusiona `fase/...` → `dev` por un único camino (`scripts/fusionar-dev.sh`) con CI verde; nunca hacia `main`.
- Un despliegue a prod pide una sola aprobación humana (`jaras97`) en el entorno `prod` de GitHub; los admins no pueden saltarla.

## Cambios ya hechos (fecha UTC)
- 2026-11-28 · Cuenta del bot `lucglogisticsbot` (id 362411492), colaboradora `write` sin admin, con token classic de scopes
  `repo, workflow, read:org, gist` (D-01, D-01a, plan 01). El token vence el 2027-02-26.
- 2026-11-28 · `deploy-prod.yml` con un solo job en el entorno `prod` y la migración en la acción compuesta
  `.github/actions/migrar-supabase` (D-16, plan 08).
- 2026-11-28 · Entorno `prod`: revisor único `jaras97` (id 169089679), `can_admins_bypass: false`, `prevent_self_review: false`,
  despliega solo desde `main` (D-05, D-16, D-17).
- 2026-11-28 · Entorno `Production` eliminado (no tenía secretos ni variables y ningún workflow lo usaba) (D-16).
- 2026-11-28 · Variable pública `SUPABASE_PUBLISHABLE_KEY` en el entorno `prod` (D-19).
- 2026-11-28 · Ruleset `main-solo-admin` (id 28300283) activo sobre `refs/heads/main` con la regla `update` (Restrict updates) y
  bypass solo para el rol admin del repo (D-22).
- 2026-11-28 · Sesión del agente con la identidad del bot para `gh` y `git` vía `.claude/settings.local.json` (D-02a).

## Pendiente en esta fase
- Guardia ampliada (`.claude/hooks/guardia-prod.sh` y `deny`) y su prueba en CI (D-06, D-07).
- `scripts/fusionar-dev.sh` y su uso desde `cierre-fase.sh` (D-13..D-15).
- Humo con registro público cerrado en cada despliegue (D-19).

## Riesgo aceptado (2026-11-28)
- Las credenciales de `jaras97` (gh y llavero de git) **siguen en la máquina del agente**: el desarrollador las usa en otros
  proyectos del mismo usuario de macOS y cerrarlas es global (enmienda D-02a, opción 2). La sesión del agente usa al bot por
  `.claude/settings.local.json`, pero un proceso del mismo usuario podría leer el token de `jaras97`.
- Lo mitigan la guardia ampliada (plan 06: bloquea `pending_deployments`, `environments/prod`, fusiones y pushes a `main`) y el
  revisor obligatorio de prod. Cierre definitivo: correr el agente en un usuario de macOS sin credenciales de `jaras97`.

Las consecuencias definitivas se escriben al aceptar este ADR (plan 09).
