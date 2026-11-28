---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 00.1.1
current_phase_name: endurecimiento-de-seguridad
current_plan: 1
status: executing
stopped_at: "00.1.1-02 tareas 1-2 hechas (prod, Production, variable, ruleset, settings.local.json, ADR-009 en 1300c97); falta Task 3: el desarrollador saca credenciales de jaras97, reinicia y se verifican gh auth status / git var GIT_AUTHOR_IDENT / ls-remote / gh api user; luego escribir 00.1.1-02-SUMMARY.md"
last_updated: "2026-11-28T15:38:15.419Z"
last_activity: 2026-11-28
progress:
  total_phases: 36
  completed_phases: 1
  total_plans: 24
  completed_plans: 15
  percent: 3
---

# STATE.md — leer al inicio de cada sesión

## Dónde vamos

Hito: H0 Arranque y descubrimiento · Fase en curso: 0.1 Arranque técnico · Estado: pendiente

## Decisiones vigentes

- Stack fijado (ver CLAUDE.md). ADR-1..8 en docs/adr.
- Un solo repo: el del sitio público, convertido en monorepo; el sitio vive en `apps/site` (ADR-007).
- Ambientes: `dev` (rama `dev`, automático) y `prod` (rama `main`, PR fusionado a mano) (ADR-008).
- GSD: modo yolo, perfil balanced con Opus para decidir/analizar y Sonnet para ejecutar (`.planning/config.json`).
- Identidad visual única en `packages/ui/src/tokens.css`; el sitio público se ajusta a ella.
- IMILE: conciliación por archivos; repartidores siguen en la app de IMILE para esos paquetes.
- App del repartidor: PWA; Capacitor como contingencia si la prueba de 0.3 falla en iPhone.
- Plazo IMILE: 2 días (confirmar si hábiles o calendario en 0.2).

## Bloqueos y pendientes externos

- GitHub: no se pudo crear la organización de LUCG (2026-11-27). El repo sigue en `gerentelucglogistics-ctrl/LUCG`; esa cuenta hace los ajustes de admin. Transferir cuando exista la organización (D-19 enmendada).
- IMILE: ¿exportaciones de salida a ruta, fallidos y devoluciones? ¿correo automático o API?
- Contrato IMILE: fórmula de multas y valor por perdido.
- Lista de 18 repartidores con nombre exacto en IMILE y tarifa.
- Legal: habilitación postal, política de datos, pólizas.
- Railway: Config as Code (`apps/api/railway.*.json`) es obsoleto en proyectos nuevos; la configuración vive en cada servicio. Migrar a `.railway/railway.ts` como fase nueva (2026-11-27).
- Cuentas de terceros (plan 00.1-10) listas el 2026-11-27; nombres de tokens del llavero en `00.1-10-SUMMARY.md`.
- Confirmar con LUCG: IMILE primero; portal (H5) y finanzas (H6) después del MVP.

## Última verificación en dev

2026-11-27, fase 0.1: dev (`d9ee67c`) y prod (`d98a6f5`) verificados; evidencia en `.planning/phases/00.1-arranque-t-cnico/verificacion.md`.

## Próximo paso

Cerrar 0.1 con las puertas de GSD (code review y verificador) y luego `/clear` y `/gsd:discuss-phase` de la fase 0.2. Backlog: una sola aprobación en deploy-prod, Schemathesis en e2e-dev, Railway a `.railway/railway.ts`.

<!-- Campos agregados al adoptar GSD (2026-11-26). Las herramientas de GSD leen y escriben estos campos; lo de arriba
     sigue siendo el resumen para personas. -->

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-26)

**Core value:** Nadie en LUCG necesita el chat ni el sistema del aliado para saber dónde está un bulto, quién lo tiene y qué pasó.
**Current focus:** Phase 00.1.1 — endurecimiento-de-seguridad

## Current Position

Phase: 00.1.1 (endurecimiento-de-seguridad) — EXECUTING
Plan: 1 of 12
**Current Phase:** 00.1.1
**Current Phase Name:** endurecimiento-de-seguridad
**Current Plan:** 1
**Total Plans in Phase:** 12
**Status:** Executing Phase 00.1.1
**Last Activity:** 2026-11-28
**Last Activity Description:** Phase 00.1.1 execution started

Progress: [░░░░░░░░░░] 0% (0 de 34 fases verificadas en dev)

## Session Continuity

**Last session:** 2026-11-28T10:40:21.298Z
**Stopped at:** Phase 0.1.1 context gathered
**Resume File:** .planning/phases/00.1.1-endurecimiento-de-seguridad/00.1.1-CONTEXT.md
