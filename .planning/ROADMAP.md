# ROADMAP.md — LUCG Plataforma

Estado: [ ] pendiente · [~] en curso · [x] verificada en dev

## H0 Arranque y descubrimiento (sem 1–3)

- [ ] 0.1 Arranque técnico: monorepo sobre el repo del sitio (`apps/site`), ramas `dev`/`main`, Claude Code + GSD, Supabase dev y prod, API y apps base, proyectos de Vercel (site, web, driver) con dominios dev y prod, CI/CD, Sentry; el sitio importa `tokens.css`
- [ ] 0.1.1 Endurecimiento de seguridad (hallazgos de `00.1-SECURITY.md`): reportes de Playwright sin secretos (login por API con `storageState`, bypass sin URL en pasos/trazas), guardia del agente contra `gh api`/`gh secret`/`gh variable` hacia main y prod, el agente aprueba y fusiona lo de `dev` (el desarrollador solo aprueba prod al cerrar cada fase), entorno prod sin bypass de admin ni autoaprobación, evidencia de registro público desactivado en prod. La rotación de secretos queda para el cierre del proyecto (AR-07)
- [ ] 0.2 Dominio: entrevistas, catálogos, estados (decidir si "En clasificación" es estado o solo evento `CLASIFICADO`), reglas IMILE (plazo, multas, perdidos), equivalencias de repartidores; contraste con `docs/requerimientos/informe-lucg.md`
- [ ] 0.3 Identidad y prototipos de consola y PWA sobre `tokens.css` (el sitio público se ajusta a la misma identidad); prueba de PWA en Android e iPhone reales sin señal; ADR-3 confirmado
- [ ] 0.4 Legal y contable: habilitación postal, política de datos, pólizas, modelo de pago a repartidores

Compuerta: LUCG firma estados, catálogos y pantallas.

## H1 Conector IMILE (sem 4–6) — R10–R14, R20–R26

- [ ] 1.1 Modelo: cuentas, envíos, referencias, bultos, eventos, registrar_evento, derivar_estado (TDD)
- [ ] 1.2 Importador de llegada y de entregas: detección, parseo, normalización, idempotencia, reporte
- [ ] 1.3 Pendientes, antigüedad, vencimientos, multa estimada, controles de calidad
- [ ] 1.4 Equivalencias de repartidor, cargos y liquidación por paquete entregado
- [ ] 1.5 Consola: carga de archivos, tablero IMILE, reporte de cierre de mes

Compuerta: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

## H2 Núcleo operativo (sem 7–10) — R01–R03, R30–R33

- [ ] 2.1 Cuentas, contratos y reglas; usuarios y roles; RLS completa
- [ ] 2.2 Máquina de estados completa y custodia; pruebas de toda transición
- [ ] 2.3 Relación de llegada, recepción por escaneo, acta, aceptación tácita, notificación
- [ ] 2.4 Captura rápida, etiqueta LUCG e impresión
- [ ] 2.5 Clasificación, inventario físico vs lógico, bloqueos

Compuerta: una recepción real con diferencias documentada en acta.

## H3 Rutas y app del repartidor (sem 11–15) — R34, R40–R45

- [ ] 3.1 Hojas de ruta, vehículos (R34), asignación por escaneo, confirmación de recepción, transferencias
- [ ] 3.2 PWA base: instalación, sesión por dispositivo, descarga de ruta, cola local
- [ ] 3.3 Entrega: receptor, firma, fotos, coordenadas, recaudo básico, parcial
- [ ] 3.4 Novedades, política de intentos, cierre de ruta, FALTANTE
- [ ] 3.5 Sincronización idempotente, conflictos, bandeja del coordinador

Compuerta: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

## H4 Cierre del MVP (sem 16–18) — R50–R54

- [ ] 4.1 Devoluciones a aliado y a IMILE con acta
- [ ] 4.2 Reporte diario a cuentas; exportación de facturables
- [ ] 4.3 PQR mínimo, tablero operativo con indicadores por repartidor (R53), semáforo de vencimientos, novedad visible a la cuenta (R54)
- [ ] 4.4 Inventario inicial, capacitación, dos semanas en paralelo, primer PR `dev → main` de la plataforma a prod

Compuerta: diez días de conciliación sin diferencias; MVP en prod.

## H5 Portal y clientes directos (sem 19–24) — R60–R66

- [ ] 5.1 Tarifas con historial
- [ ] 5.2 Portal transaccional y de aliados
- [ ] 5.3 Mostrador, envíos salientes, transportador tercero
- [ ] 5.4 Recogidas y viajes troncales con modalidad y costo
- [ ] 5.5 Seguimiento público y avisos al destinatario (WhatsApp)
- [ ] 5.6 Sitio público integrado (R65): acceso clientes, rastrear envío, cotización como solicitud

Compuerta: un cliente directo opera un mes sin ayuda.

## H6 Dinero (sem 25–30) — R70–R75

- [ ] 6.1 Recaudo completo
- [ ] 6.2 Cargos, prefacturas, integración contable
- [ ] 6.3 Cartera y cuentas por pagar
- [ ] 6.4 Liquidaciones por modalidad, documento soporte
- [ ] 6.5 Costos con prorrateo troncal (R74), gastos generales y flujo de caja (R75), rentabilidad, tablero financiero

Compuerta: cierre de mes desde el sistema validado por el contador.

---

## Phase Details

<!-- Sección agregada al adoptar GSD (2026-11-26). Las herramientas de GSD solo reconocen una fase si tiene un
     encabezado `### Phase N: Nombre`. Cada bloque repite, sin cambiarlos, el texto y la numeración de la fase de
     arriba. Los requisitos por fase y los criterios de éxito quedan en TBD: se fijan en /gsd:discuss-phase y
     /gsd:plan-phase de cada fase. Si algo de aquí no coincide con la lista de arriba, manda la lista de arriba. -->

### Phase 0.1: Arranque técnico

**Hito**: H0 Arranque y descubrimiento
**Goal**: Arranque técnico: monorepo sobre el repo del sitio (`apps/site`), ramas `dev`/`main`, Claude Code + GSD, Supabase dev y prod, API y apps base, proyectos de Vercel (site, web, driver) con dominios dev y prod, CI/CD, Sentry; el sitio importa `tokens.css`
**Depends on**: Nada (primera fase)
**Requirements**: TBD (el hito H0 no tiene requisitos asignados en este ROADMAP)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 0.1. Compuerta del hito H0: LUCG firma estados, catálogos y pantallas.

**Plans**: 12 plans (6 waves)

Plans:

- [x] 00.1-01-PLAN.md — Guardas del agente (CLI v3), GSD normalizado (D-20), CODEOWNERS, runbook de paneles H-1..H-10, plantilla de verificacion.md
- [x] 00.1-02-PLAN.md — Python 3.12 + uv.lock, ruff/mypy, Supabase CLI v3 config.toml, 0001 sin contraseña, 0002 procrastinate, pruebas negativas RLS [BLOCKING db reset]
- [x] 00.1-03-PLAN.md — /health con SHA y consulta real (503), JWT sin HS256 con iss/aud, GET /yo con set_contexto
- [x] 00.1-04-PLAN.md — Diagnóstico protegido (ping/jobs/error), Sentry 3 restrictivo, lifespan procrastinate, Dockerfile + railway.*.json, cliente regenerado
- [x] 00.1-05-PLAN.md — ESLint 9 flat en web/driver, devDeps justificadas, __APP_VERSION__ de la consola, vercel.json SPA
- [x] 00.1-06-PLAN.md — PWA instalable (íconos, manifest, precache, /diagnostico), bypass de Vercel en Playwright, e2e sin red
- [x] 00.1-07-PLAN.md — Sitio importa tokens.css sin cambio visual; comparación visual sitio-prod vs sitio-preview
- [x] 00.1-08-PLAN.md — Login real en la consola, panel /yo, botones de error Sentry; e2e de login y worker
- [x] 00.1-09-PLAN.md — CI completo (api, web, e2e-preview, visual-sitio), migrate CLI v3 --remote, deploy dev/prod a Railway, e2e encadenado, salud diaria, scripts
- [ ] 00.1-10-PLAN.md — [humano] Organizaciones de LUCG, transferencia del repo, Supabase, Sentry, Railway, Vercel, DNS y secretos
- [ ] 00.1-11-PLAN.md — Suite completa, variables, protección de dev, cierre-fase a dev y evidencia en dev
- [ ] 00.1-12-PLAN.md — [humano] Evidencia Sentry/PWA, protección de main, PR dev→main manual, prod y commit de la evidencia

### Phase 0.1.1: Endurecimiento de seguridad

**Hito**: H0 Arranque y descubrimiento
**Goal**: Cerrar las 11 amenazas abiertas de `00.1-SECURITY.md` (C-1 a C-4): reportes de Playwright sin secretos (login por API con `storageState`, bypass sin URL en pasos/trazas), guardia del agente contra `gh api`/`gh secret`/`gh variable` hacia main y prod con prueba de regresión, entorno prod sin bypass de admin ni autoaprobación, evidencia de registro público desactivado en prod, decisión sobre organización de GitHub (D-03). Aprobaciones: el agente fusiona sus PRs a `dev` sin intervención humana (vía script que exige base=`dev` y CI verde; `gh pr merge` crudo sigue bloqueado) y el desarrollador solo aprueba prod, una vez por cierre de fase (una sola aprobación en deploy-prod); requiere ADR que ajuste ADR-008 y CLAUDE.md. La rotación de secretos y el borrado de artefactos quedan para el cierre del proyecto (AR-07)
**Depends on**: Phase 0.1
**Requirements**: TBD (el hito H0 no tiene requisitos asignados en este ROADMAP)
**Success Criteria** (what must be TRUE):

  1. `/gsd:secure-phase 0.1` termina con `threats_open: 0`.
  2. Un PR del agente a `dev` llega a fusionarse y desplegarse en dev sin ninguna acción del desarrollador; un intento del agente de fusionar o aprobar hacia `main`/prod sigue bloqueado.
  3. El cierre de una fase pide al desarrollador una sola aprobación: la de prod.

**Plans**: 12 plans

Plans:

- [x] 00.1.1-01-PLAN.md — [humano] Cuenta del bot y token classic; invitación write sin admin; scripts/auditar-github.sh
- [x] 00.1.1-02-PLAN.md — [humano] Ventana D-18a/D-22 (prod revisor único, sin bypass, Production, ruleset de main), sesión aislada del bot y ADR-009 en Propuesto
- [x] 00.1.1-03-PLAN.md — Playwright sin secretos: trace/video off, bypass por cookie, login por API con storageState
- [x] 00.1.1-04-PLAN.md — Compuerta de secretos (zip base64 recursivo) con regresión sobre un reporte real
- [ ] 00.1.1-05-PLAN.md — Compuerta y subida solo en fallo en CI; URL del run como evidencia; e2e-preview en verde
- [ ] 00.1.1-06-PLAN.md — Guardia ampliada (gh api, secret/variable de prod, GraphQL, curl, git push) con prueba de regresión
- [ ] 00.1.1-07-PLAN.md — fusionar-dev.sh, cierre-fase con fusión del bot, job guardia requerido en dev
- [x] 00.1.1-08-PLAN.md — deploy-prod con un solo job en prod (acción compuesta de migración) y humo con registro cerrado
- [ ] 00.1.1-09-PLAN.md — ADR-009, CLAUDE.md, memoria; 00.1-SECURITY.md con C-1/C-2/C-4 cerradas, AR-08 y R1-R6
- [ ] 00.1.1-10-PLAN.md — [humano] Cierre a dev por el bot con evidencia; el desarrollador fusiona dev→main
- [ ] 00.1.1-11-PLAN.md — [humano] Bot sin poder de aprobar, aprobación única de prod, evidencia de C-3
- [ ] 00.1.1-12-PLAN.md — [sesión principal] /gsd:secure-phase 0.1 → threats_open: 0; PR de evidencia fusionado por el bot

### Phase 0.2: Dominio

**Hito**: H0 Arranque y descubrimiento
**Goal**: Dominio: entrevistas, catálogos, estados (decidir si "En clasificación" es estado o solo evento `CLASIFICADO`), reglas IMILE (plazo, multas, perdidos), equivalencias de repartidores; contraste con `docs/requerimientos/informe-lucg.md`
**Depends on**: Phase 0.1
**Requirements**: TBD (el hito H0 no tiene requisitos asignados en este ROADMAP)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 0.2. Compuerta del hito H0: LUCG firma estados, catálogos y pantallas.

**Plans**: TBD

### Phase 0.3: Identidad y prototipos de consola y PWA sobre `tokens.css` (el sitio público se ajusta a la misma identidad); prueba de PWA en Android e iPhone reales sin señal; ADR-3 confirmado

**Hito**: H0 Arranque y descubrimiento
**Goal**: Identidad y prototipos de consola y PWA sobre `tokens.css` (el sitio público se ajusta a la misma identidad); prueba de PWA en Android e iPhone reales sin señal; ADR-3 confirmado
**Depends on**: Phase 0.2
**Requirements**: TBD (el hito H0 no tiene requisitos asignados en este ROADMAP)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 0.3. Compuerta del hito H0: LUCG firma estados, catálogos y pantallas.

**Plans**: TBD

### Phase 0.4: Legal y contable

**Hito**: H0 Arranque y descubrimiento
**Goal**: Legal y contable: habilitación postal, política de datos, pólizas, modelo de pago a repartidores
**Depends on**: Phase 0.3
**Requirements**: TBD (el hito H0 no tiene requisitos asignados en este ROADMAP)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 0.4. Compuerta del hito H0: LUCG firma estados, catálogos y pantallas.

**Plans**: TBD

### Phase 1.1: Modelo

**Hito**: H1 Conector IMILE
**Goal**: Modelo: cuentas, envíos, referencias, bultos, eventos, registrar_evento, derivar_estado (TDD)
**Depends on**: Phase 0.4
**Requirements**: TBD (hito H1: R10–R14, R20–R26)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 1.1. Compuerta del hito H1: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

**Plans**: TBD

### Phase 1.2: Importador de llegada y de entregas

**Hito**: H1 Conector IMILE
**Goal**: Importador de llegada y de entregas: detección, parseo, normalización, idempotencia, reporte
**Depends on**: Phase 1.1
**Requirements**: TBD (hito H1: R10–R14, R20–R26)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 1.2. Compuerta del hito H1: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

**Plans**: TBD

### Phase 1.3: Pendientes, antigüedad, vencimientos, multa estimada, controles de calidad

**Hito**: H1 Conector IMILE
**Goal**: Pendientes, antigüedad, vencimientos, multa estimada, controles de calidad
**Depends on**: Phase 1.2
**Requirements**: TBD (hito H1: R10–R14, R20–R26)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 1.3. Compuerta del hito H1: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

**Plans**: TBD

### Phase 1.4: Equivalencias de repartidor, cargos y liquidación por paquete entregado

**Hito**: H1 Conector IMILE
**Goal**: Equivalencias de repartidor, cargos y liquidación por paquete entregado
**Depends on**: Phase 1.3
**Requirements**: TBD (hito H1: R10–R14, R20–R26)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 1.4. Compuerta del hito H1: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

**Plans**: TBD

### Phase 1.5: Consola

**Hito**: H1 Conector IMILE
**Goal**: Consola: carga de archivos, tablero IMILE, reporte de cierre de mes
**Depends on**: Phase 1.4
**Requirements**: TBD (hito H1: R10–R14, R20–R26)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 1.5. Compuerta del hito H1: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

**Plans**: TBD

### Phase 2.1: Cuentas, contratos y reglas; usuarios y roles; RLS completa

**Hito**: H2 Núcleo operativo
**Goal**: Cuentas, contratos y reglas; usuarios y roles; RLS completa
**Depends on**: Phase 1.5
**Requirements**: TBD (hito H2: R01–R03, R30–R33)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 2.1. Compuerta del hito H2: una recepción real con diferencias documentada en acta.

**Plans**: TBD

### Phase 2.2: Máquina de estados completa y custodia; pruebas de toda transición

**Hito**: H2 Núcleo operativo
**Goal**: Máquina de estados completa y custodia; pruebas de toda transición
**Depends on**: Phase 2.1
**Requirements**: TBD (hito H2: R01–R03, R30–R33)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 2.2. Compuerta del hito H2: una recepción real con diferencias documentada en acta.

**Plans**: TBD

### Phase 2.3: Relación de llegada, recepción por escaneo, acta, aceptación tácita, notificación

**Hito**: H2 Núcleo operativo
**Goal**: Relación de llegada, recepción por escaneo, acta, aceptación tácita, notificación
**Depends on**: Phase 2.2
**Requirements**: TBD (hito H2: R01–R03, R30–R33)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 2.3. Compuerta del hito H2: una recepción real con diferencias documentada en acta.

**Plans**: TBD

### Phase 2.4: Captura rápida, etiqueta LUCG e impresión

**Hito**: H2 Núcleo operativo
**Goal**: Captura rápida, etiqueta LUCG e impresión
**Depends on**: Phase 2.3
**Requirements**: TBD (hito H2: R01–R03, R30–R33)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 2.4. Compuerta del hito H2: una recepción real con diferencias documentada en acta.

**Plans**: TBD

### Phase 2.5: Clasificación, inventario físico vs lógico, bloqueos

**Hito**: H2 Núcleo operativo
**Goal**: Clasificación, inventario físico vs lógico, bloqueos
**Depends on**: Phase 2.4
**Requirements**: TBD (hito H2: R01–R03, R30–R33)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 2.5. Compuerta del hito H2: una recepción real con diferencias documentada en acta.

**Plans**: TBD

### Phase 3.1: Hojas de ruta, vehículos (R34), asignación por escaneo, confirmación de recepción, transferencias

**Hito**: H3 Rutas y app del repartidor
**Goal**: Hojas de ruta, vehículos (R34), asignación por escaneo, confirmación de recepción, transferencias
**Depends on**: Phase 2.5
**Requirements**: TBD (hito H3: R34, R40–R45)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 3.1. Compuerta del hito H3: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

**Plans**: TBD

### Phase 3.2: PWA base

**Hito**: H3 Rutas y app del repartidor
**Goal**: PWA base: instalación, sesión por dispositivo, descarga de ruta, cola local
**Depends on**: Phase 3.1
**Requirements**: TBD (hito H3: R34, R40–R45)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 3.2. Compuerta del hito H3: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

**Plans**: TBD

### Phase 3.3: Entrega

**Hito**: H3 Rutas y app del repartidor
**Goal**: Entrega: receptor, firma, fotos, coordenadas, recaudo básico, parcial
**Depends on**: Phase 3.2
**Requirements**: TBD (hito H3: R34, R40–R45)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 3.3. Compuerta del hito H3: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

**Plans**: TBD

### Phase 3.4: Novedades, política de intentos, cierre de ruta, FALTANTE

**Hito**: H3 Rutas y app del repartidor
**Goal**: Novedades, política de intentos, cierre de ruta, FALTANTE
**Depends on**: Phase 3.3
**Requirements**: TBD (hito H3: R34, R40–R45)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 3.4. Compuerta del hito H3: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

**Plans**: TBD

### Phase 3.5: Sincronización idempotente, conflictos, bandeja del coordinador

**Hito**: H3 Rutas y app del repartidor
**Goal**: Sincronización idempotente, conflictos, bandeja del coordinador
**Depends on**: Phase 3.4
**Requirements**: TBD (hito H3: R34, R40–R45)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 3.5. Compuerta del hito H3: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

**Plans**: TBD

### Phase 4.1: Devoluciones a aliado y a IMILE con acta

**Hito**: H4 Cierre del MVP
**Goal**: Devoluciones a aliado y a IMILE con acta
**Depends on**: Phase 3.5
**Requirements**: TBD (hito H4: R50–R54)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 4.1. Compuerta del hito H4: diez días de conciliación sin diferencias; MVP en prod.

**Plans**: TBD

### Phase 4.2: Reporte diario a cuentas; exportación de facturables

**Hito**: H4 Cierre del MVP
**Goal**: Reporte diario a cuentas; exportación de facturables
**Depends on**: Phase 4.1
**Requirements**: TBD (hito H4: R50–R54)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 4.2. Compuerta del hito H4: diez días de conciliación sin diferencias; MVP en prod.

**Plans**: TBD

### Phase 4.3: PQR mínimo, tablero operativo con indicadores por repartidor (R53), semáforo de vencimientos, novedad visible a la cuenta (R54)

**Hito**: H4 Cierre del MVP
**Goal**: PQR mínimo, tablero operativo con indicadores por repartidor (R53), semáforo de vencimientos, novedad visible a la cuenta (R54)
**Depends on**: Phase 4.2
**Requirements**: TBD (hito H4: R50–R54)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 4.3. Compuerta del hito H4: diez días de conciliación sin diferencias; MVP en prod.

**Plans**: TBD

### Phase 4.4: Inventario inicial, capacitación, dos semanas en paralelo, primer PR `dev → main` de la plataforma a prod

**Hito**: H4 Cierre del MVP
**Goal**: Inventario inicial, capacitación, dos semanas en paralelo, primer PR `dev → main` de la plataforma a prod
**Depends on**: Phase 4.3
**Requirements**: TBD (hito H4: R50–R54)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 4.4. Compuerta del hito H4: diez días de conciliación sin diferencias; MVP en prod.

**Plans**: TBD

### Phase 5.1: Tarifas con historial

**Hito**: H5 Portal y clientes directos
**Goal**: Tarifas con historial
**Depends on**: Phase 4.4
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.1. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 5.2: Portal transaccional y de aliados

**Hito**: H5 Portal y clientes directos
**Goal**: Portal transaccional y de aliados
**Depends on**: Phase 5.1
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.2. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 5.3: Mostrador, envíos salientes, transportador tercero

**Hito**: H5 Portal y clientes directos
**Goal**: Mostrador, envíos salientes, transportador tercero
**Depends on**: Phase 5.2
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.3. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 5.4: Recogidas y viajes troncales con modalidad y costo

**Hito**: H5 Portal y clientes directos
**Goal**: Recogidas y viajes troncales con modalidad y costo
**Depends on**: Phase 5.3
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.4. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 5.5: Seguimiento público y avisos al destinatario (WhatsApp)

**Hito**: H5 Portal y clientes directos
**Goal**: Seguimiento público y avisos al destinatario (WhatsApp)
**Depends on**: Phase 5.4
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.5. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 5.6: Sitio público integrado (R65)

**Hito**: H5 Portal y clientes directos
**Goal**: Sitio público integrado (R65): acceso clientes, rastrear envío, cotización como solicitud
**Depends on**: Phase 5.5
**Requirements**: TBD (hito H5: R60–R66)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 5.6. Compuerta del hito H5: un cliente directo opera un mes sin ayuda.

**Plans**: TBD

### Phase 6.1: Recaudo completo

**Hito**: H6 Dinero
**Goal**: Recaudo completo
**Depends on**: Phase 5.6
**Requirements**: TBD (hito H6: R70–R75)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 6.1. Compuerta del hito H6: cierre de mes desde el sistema validado por el contador.

**Plans**: TBD

### Phase 6.2: Cargos, prefacturas, integración contable

**Hito**: H6 Dinero
**Goal**: Cargos, prefacturas, integración contable
**Depends on**: Phase 6.1
**Requirements**: TBD (hito H6: R70–R75)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 6.2. Compuerta del hito H6: cierre de mes desde el sistema validado por el contador.

**Plans**: TBD

### Phase 6.3: Cartera y cuentas por pagar

**Hito**: H6 Dinero
**Goal**: Cartera y cuentas por pagar
**Depends on**: Phase 6.2
**Requirements**: TBD (hito H6: R70–R75)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 6.3. Compuerta del hito H6: cierre de mes desde el sistema validado por el contador.

**Plans**: TBD

### Phase 6.4: Liquidaciones por modalidad, documento soporte

**Hito**: H6 Dinero
**Goal**: Liquidaciones por modalidad, documento soporte
**Depends on**: Phase 6.3
**Requirements**: TBD (hito H6: R70–R75)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 6.4. Compuerta del hito H6: cierre de mes desde el sistema validado por el contador.

**Plans**: TBD

### Phase 6.5: Costos con prorrateo troncal (R74), gastos generales y flujo de caja (R75), rentabilidad, tablero financiero

**Hito**: H6 Dinero
**Goal**: Costos con prorrateo troncal (R74), gastos generales y flujo de caja (R75), rentabilidad, tablero financiero
**Depends on**: Phase 6.4
**Requirements**: TBD (hito H6: R70–R75)
**Success Criteria** (what must be TRUE):

  1. TBD en /gsd:discuss-phase 6.5. Compuerta del hito H6: cierre de mes desde el sistema validado por el contador.

**Plans**: TBD
