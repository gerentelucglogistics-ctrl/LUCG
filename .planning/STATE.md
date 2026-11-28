---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 00.1.1
current_phase_name: endurecimiento-de-seguridad
current_plan: 1
status: executing
stopped_at: "Fase 0.1.1 en el plan 12: planes 10 y 11 hechos (dev a00c0d2, prod 8e0b133). Falta la auditoría /gsd:secure-phase 0.1 desde la sesión principal y el PR de evidencia a dev."
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
- ADR-009 (enmienda ADR-008): el bot `lucglogisticsbot` fusiona a dev solo con `scripts/fusionar-dev.sh`; prod con una sola aprobación de jaras97 en el entorno `prod`. Las credenciales de jaras97 siguen en la máquina (riesgo aceptado AR-09, R7).
- GSD: modo yolo, perfil balanced con Opus para decidir/analizar y Sonnet para ejecutar (`.planning/config.json`).
- Identidad visual única en `packages/ui/src/tokens.css`; el sitio público se ajusta a ella.
- IMILE: conciliación por archivos; repartidores siguen en la app de IMILE para esos paquetes.
- App del repartidor: PWA; Capacitor como contingencia si la prueba de 0.3 falla en iPhone.
- Plazo IMILE: 2 días (confirmar si hábiles o calendario en 0.2).

## Bloqueos y pendientes externos

- GitHub: no se pudo crear la organización de LUCG (2026-11-27). El repo sigue en `gerentelucglogistics-ctrl/LUCG`; esa cuenta hace los ajustes de admin. Transferir cuando exista la organización (D-19 enmendada). Revisar el 2027-02-28 (AR-08).
- Token classic del bot vence el 2027-02-26: lo renueva el desarrollador (`gh auth login` en el GH_CONFIG_DIR del bot desde su terminal).
- IMILE: ¿exportaciones de salida a ruta, fallidos y devoluciones? ¿correo automático o API?
- Contrato IMILE: fórmula de multas y valor por perdido.
- Lista de 18 repartidores con nombre exacto en IMILE y tarifa.
- Legal: habilitación postal, política de datos, pólizas.
- Railway: Config as Code (`apps/api/railway.*.json`) es obsoleto en proyectos nuevos; la configuración vive en cada servicio. Migrar a `.railway/railway.ts` como fase nueva (2026-11-27).
- Cuentas de terceros (plan 00.1-10) listas el 2026-11-27; nombres de tokens del llavero en `00.1-10-SUMMARY.md`.
- Confirmar con LUCG: IMILE primero; portal (H5) y finanzas (H6) después del MVP.

## Última verificación en dev

2026-11-28, fase 0.1.1: dev (`a00c0d2`, despliegue https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46178560081) y prod (`8e0b133`, despliegue https://github.com/gerentelucglogistics-ctrl/LUCG/actions/runs/46180939332, una aprobación de jaras97) verificados; evidencia en `.planning/phases/00.1.1-endurecimiento-de-seguridad/verificacion.md`.

## Próximo paso

Plan 12 de 0.1.1: auditoría `/gsd:secure-phase 0.1` y PR de evidencia hacia dev; luego `/clear` y `/gsd:discuss-phase` de la fase 0.2. Backlog: Schemathesis en e2e-dev, Railway a `.railway/railway.ts`.

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
