# Verificación · Fase 0.1.1 Endurecimiento de seguridad

Fecha (UTC): 2026-11-28T19:00Z · Rama fusionada: `fase/00.1.1-endurecimiento-de-seguridad` → `dev`

> D-12: evidencia = URLs de runs, PR y líneas de log. No se citan artefactos.

## Dev

| Criterio | Evidencia |
|----------|-----------|
| Criterio 2 (dev): el bot fusiona y dev se despliega sin el desarrollador | PR https://github.com/gerentelucglogistics-ctrl/LUCG/pull/11 · `gh pr view 11 --json mergedBy,state` = `["lucglogisticsbot","MERGED"]` (mergedBy = bot, vía `just cierre-fase` → `scripts/fusionar-dev.sh`) · Despliegue a dev https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46178560081 = `success` · MERGE_SHA `a00c0d28030d069ce001ebec0cb2aa2c1aa988c9` · `api-dev /api/v1/health` `.version` = `a00c0d2` |
| Criterio 2 (bloqueo): la guardia bloquea en vivo fusionar y escribir sobre prod | Hook por stdin (`scratch/prueba-bloqueo.sh`): `rc=2` para `gh api -X PUT repos/lucg-inexistente/nada/pulls/1/merge` ("Bloqueado: escritura en GitHub sobre main, prod o la administración del repo") y para `gh secret set PRUEBA --env prod ... -R lucg-inexistente/nada` ("Bloqueado: secretos o variables del entorno prod"). Los mismos dos comandos, lanzados por la herramienta Bash de la sesión, los rechazó el hook PreToolUse antes de ejecutarse. Solo contra `lucg-inexistente/nada`. Job `guardia` del último CI del PR: https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46177180206/job/141078431028 (`success`, 120 casos) |
| e2e-preview verde con storageState y bypass por cookie | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46177180206 (`e2e-preview` success): `[setup] sesión de administrador por API` ✓, `[preview] consola-sesion` ✓ (corre de verdad; antes se saltaba, corregido en 54a8c66), smoke ✓, credenciales malas ✓; login con clave real omitido a propósito (solo `local`) |
| e2e-dev verde sin artefactos de Playwright | https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46178560081: setup ✓, `[dev] consola-sesion` ✓, smoke ✓, worker ✓, credenciales malas ✓, `[dev-driver] driver-offline` ✓, Schemathesis ✓. Artefactos del run cuyo nombre empieza con `playwright`: 0 |
| Registro público cerrado en dev (D-19) | Log del run https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46178560081: `Registro público cerrado en dev (disable_signup=true, signup_disabled)` |
| auditar-github OK (como bot) | Salida abajo |
| Suite local antes de cerrar | `just test-scripts` (guardia 120, compuerta, fusionar-dev, registro-cerrado, artefactos: OK) · `pnpm lint` y `pnpm typecheck` rc=0 · `just test` rc=0 (28 passed, cobertura 95 %) |
| Revisión de la fase | `/simplify` (45420cf) y `/code-review` (54a8c66: 6 hallazgos importantes corregidos; 3 menores anotados en 00.1.1-10-SUMMARY.md) sobre el diff contra `dev` antes de fusionar |

```
OK    prod: revisor único jaras97 (D-05, D-16)
OK    prod: can_admins_bypass=false (D-16)
OK    prod: prevent_self_review=false (D-17)
OK    prod: solo despliega desde main
OK    Production: ausente o sin revisores (D-16)
OK    bot: colaborador write sin admin (D-01, D-02)
OK    bot: no es revisor de prod (D-02)
OK    dev: checks requeridos api, web y guardia (D-07)
OMITIDA dev: sin strict (sin token admin)
OK    main: ruleset activo con Restrict updates (D-22)
OK    deploy-prod: un solo job con environment: prod (criterio 3)
auditar-github: OK
```

La comprobación `dev: sin strict` con token admin dio OK el 2026-11-28 (00.1.1-07-SUMMARY.md).

## Prod

| Criterio | Evidencia |
|----------|-----------|
| Criterio 3: una sola aprobación de jaras97 en deploy-prod | pendiente del run aprobado (plan 11) |
| Registro público cerrado en prod (D-19) | pendiente del run aprobado (plan 11) |
