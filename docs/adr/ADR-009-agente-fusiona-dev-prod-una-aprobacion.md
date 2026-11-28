# ADR-009: El agente fusiona a dev; prod con una sola aprobación humana
**Estado:** Aceptada · enmienda ADR-008 · **Fecha:** 2026-11-28 (aceptada 2026-11-28) · **Deciden:** desarrollador principal

## Contexto
- Hallazgo C-2 de `00.1-SECURITY.md` (alta): el agente podía llegar a `main` y a prod por `gh api` (fusionar PRs, aprobar
  `pending_deployments`, despachar `deploy-prod`, cambiar `environments/prod`), y usaba la misma identidad que el revisor de prod.
- Hallazgo C-4 (baja): GitHub sin organización ni admin nominal; el repo sigue en `gerentelucglogistics-ctrl/LUCG`.
- El desarrollador pidió no aprobar nada en `dev`: el agente fusiona y despliega a dev; el humano solo aprueba prod al cerrar cada fase.

## Decisión
- Cuenta de máquina (login `lucglogisticsbot`) colaboradora con `write` y sin admin, que no es revisora de prod. Token classic de
  scopes `repo, workflow, read:org, gist`, porque GitHub no admite fine-grained para colaboradores de repos personales (D-01, D-01a).
- La sesión del agente usa solo al bot para `gh` y `git`, vía `.claude/settings.local.json` (D-02a). Las credenciales de `jaras97`
  (gh y llavero de git) **siguen en la máquina** por decisión del desarrollador: es un riesgo aceptado, ver "Riesgo aceptado".
- Commits del agente con el bot como autor y `Co-Authored-By: jaras97` (D-03).
- El token admin `github-lucg` se conserva para administrar `dev` (D-04).
- El bot fusiona `fase/...` → `dev` solo con `scripts/fusionar-dev.sh`: base `dev`, autor bot, checks `api`, `web`, `e2e-preview`,
  `visual-sitio` y `guardia` en pass o skipping, y `--match-head-commit`. Lo llama `just cierre-fase` en su paso 3/4, sin
  auto-merge (D-13..D-15). D-15 dice "paso 4" porque contaba los 5 pasos viejos de `cierre-fase.sh`; el plan 07 quitó la espera de
  checks (la hace `fusionar-dev.sh`) y renumeró a 4 pasos, así que la fusión es el paso 3/4 sin cambiar la decisión.
- Entorno `prod` con revisor único `jaras97`, `can_admins_bypass: false` y `prevent_self_review: false`. La razón de lo último
  está en `00.1-SECURITY.md` (nota sobre D-17, Pitfall 9): el desarrollador fusionó los PR dev→main y aprobó con la cuenta LUCG, y
  con revisor único `prevent_self_review` no lo frenaría; el riesgo de autoaprobación del agente lo cierran D-01, D-02 y D-05
  (D-05, D-16, D-17).
- `deploy-prod.yml` con un solo job en `prod`: una aprobación por cierre de fase. El entorno `Production` queda eliminado.
- Ruleset `main-solo-admin` (Restrict updates, bypass solo del rol admin): el PR dev→main lo fusiona la cuenta LUCG (D-22).
- Guardia ampliada como segunda capa, con su prueba (`scripts/tests/guardia.test.sh`) en el check `guardia`, requerido en dev
  (D-06, D-07).
- El humo de cada despliegue exige registro público de Supabase cerrado (D-19).

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
- 2026-11-28 · Guardia ampliada y su regresión de 109 casos (plan 06); `fusionar-dev.sh` y job `guardia` requerido en dev (plan 07);
  humo con registro cerrado (plan 08).

## Riesgo aceptado (2026-11-28)
- Las credenciales de `jaras97` (gh y llavero de git) **siguen en la máquina del agente**: el desarrollador las usa en otros
  proyectos del mismo usuario de macOS y cerrarlas es global (enmienda D-02a, opción 2). La sesión del agente usa al bot por
  `.claude/settings.local.json`, pero un proceso del mismo usuario podría leer el token de `jaras97`.
- Lo mitigan la guardia ampliada (plan 06: bloquea `pending_deployments`, `environments/prod`, fusiones y pushes a `main`) y el
  revisor obligatorio de prod. Cierre definitivo: correr el agente en un usuario de macOS sin credenciales de `jaras97`.

## Consecuencias
+ El desarrollador solo aprueba prod, una vez por cierre de fase; no aprueba nada en dev.
+ Por diseño de GitHub, el bot no puede aprobar prod ni saltarse el entorno `prod`: no es revisor ni admin.
+ El historial distingue lo que hizo el bot de lo que hizo el humano (autor del commit y de la fusión).
− El token classic del bot vence cada 90 días (hoy, 2027-02-26) y lo renueva el desarrollador.
− El PR dev→main solo lo puede fusionar la cuenta LUCG (admin del repo) por el ruleset `main-solo-admin`.
− Riesgos residuales, que la fase deja escritos y no resueltos:
  - R1: la guardia no ve código ejecutado desde archivos ni otros lenguajes; no es frontera de seguridad.
  - R2: el token admin `github-lucg` (D-04) sigue legible por la sesión del agente; con él se podría, fuera de la guardia, volver
    a poner revisores en prod, activar `can_admins_bypass`, cambiar el ruleset o fusionar a main. Esa vía la cierra solo la
    guardia, no el diseño de GitHub.
  - R3: Vercel publica el front de prod al fusionar a `main` sin la aprobación (diferido en CONTEXT).
  - R4: las capturas PNG no las revisa la compuerta de secretos.
  - R5: los secretos de Actions a nivel de repo `VERCEL_TOKEN` y `VERCEL_BYPASS_*` no están atados al entorno `prod`, y el token del
    bot tiene el scope `workflow`: un workflow nuevo o modificado en un PR del bot podría usar `VERCEL_TOKEN` para publicar el
    front de prod sin la aprobación de `jaras97`. Mitigación parcial: el PR pasa por CI y el desarrollador revisa el PR dev→main;
    mover `VERCEL_TOKEN` al entorno `prod` queda fuera de esta fase.
  - R6: dev no exige revisiones, así que un PR del bot que debilite la guardia y su prueba a la vez pasa el check `guardia` y se
    fusiona en dev (peor caso: dev, ADR-008; prod sigue con la aprobación de `jaras97` y el desarrollador ve el cambio en el PR
    dev→main).
  - R7: el token de `jaras97` sigue legible en el llavero del mismo usuario de macOS (D-02a enmendada); con él se podría aprobar
    prod. Lo mitiga solo la guardia (bloquea `pending_deployments`, `environments/prod` y volcados del llavero). Cierre
    definitivo: correr el agente en un usuario de macOS sin esas credenciales. Según el reporte del plan 05, un ejecutor intentó
    `security dump-keychain` y la guardia lo bloqueó: confirma que R7 es real y que la guardia funciona como barrera.
