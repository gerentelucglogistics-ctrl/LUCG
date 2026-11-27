# PROJECT.md — LUCG Plataforma

## Qué es
Plataforma propia de paquetería y última milla para LUCG LOGISTICS (Apartadó, Urabá antioqueño). Registra cada
envío desde que entra a bodega hasta que se entrega, para aliados con sistema propio (IMILE), aliados por WhatsApp
y clientes directos. Consola web, app del repartidor (PWA), portal de cuentas, seguimiento público y conectores.
El sitio público lucglogistics.com ya existe (`apps/site`) y comparte identidad visual con la plataforma.
Requerimientos originales del cliente: `docs/requerimientos/informe-lucg.md`.

## Para quién
Gerencia y coordinación de LUCG (control, cumplimiento, dinero), bodega (recepción con acta), 18 repartidores en 9
municipios (app sin conexión), aliados y clientes (portal, reportes), destinatarios (seguimiento).

## Por qué ahora
LUCG opera sin sistema. Los paquetes de IMILE se registran en la plataforma de IMILE; el aliado sin sistema se
coordina por WhatsApp. No hay control propio de pendientes, plazo de dos días, multas, faltantes ni liquidación.

## Resultado del primer hito (H1)
Conector IMILE: importar sus archivos de llegada y entregas, pendientes con vencimiento, controles de calidad,
liquidación por paquete entregado y cierre de mes. Sin doble digitación.

## Resultado del MVP (H4, semana 18)
Nadie en LUCG necesita el chat ni el sistema del aliado para saber dónde está un bulto, quién lo tiene y qué pasó;
gerencia cobra el mes con datos del sistema.

## Restricciones
- Stack: Supabase (PostgreSQL, Auth, Storage), FastAPI, React + Vite + TS, PWA (Android e iPhone); sitio en Next.js.
- Dos ambientes en la nube: dev (rama `dev`) y prod (rama `main`). Un solo repositorio (ADR-007, ADR-008).
- IMILE exige operar en su plataforma; se integra por archivos Excel.
- Equipo de 2 a 3 personas; costos recurrentes bajos; activos a nombre de LUCG.
- Marco legal colombiano (postal, habeas data, DIAN) confirmado con abogado y contador en H0.

## Principios
Envío con custodia trazable; eventos inmutables; reglas por cuenta en contrato, no en código; primero absorber la
operación real, luego digitalizar; el campo manda (app rápida y sin red); trazabilidad defendible.

## Fuera de alcance (hasta H6)
Optimización automática de rutas, OCR, bandeja WhatsApp por API, app en tiendas (salvo que la prueba lo exija),
almacenamiento y operaciones portuarias, trámites legales.

<!-- ───────────────────────────────────────────────────────────────────────────────────────────────
     Secciones agregadas al adoptar GSD (2026-11-26). GSD revisa que existan `## What This Is`,
     `## Core Value` y `## Requirements`. No cambian nada de lo anterior: remiten a las secciones de
     arriba, a REQUIREMENTS.md y a los ADR. Si hay diferencia, manda el texto de arriba.
     ─────────────────────────────────────────────────────────────────────────────────────────────── -->

## What This Is
Ver «Qué es» y «Para quién» al inicio de este documento.

## Core Value
Nadie en LUCG necesita el chat ni el sistema del aliado para saber dónde está un bulto, quién lo tiene y qué pasó
(tomado de «Resultado del MVP»). Primer hito: conector IMILE sin doble digitación (ver «Resultado del primer hito»).

## Requirements

### Validated
(Ninguno todavía. Un requisito se valida cuando su fase está verificada en dev; ver N07.)

### Active
Todos los de `.planning/REQUIREMENTS.md` (R01–R75, N01–N08), en el orden de hitos de `.planning/ROADMAP.md`.

### Out of Scope
Ver «Fuera de alcance (hasta H6)» arriba.

## Key Decisions

| Decisión | Razón | Resultado |
|----------|-------|-----------|
| Supabase para base de datos, auth y storage (ADR-001) | Equipo pequeño, respaldos y seguridad desde el día uno, costo bajo | — Pendiente |
| FastAPI es la única vía de escritura; RLS es una segunda barrera (ADR-002) | Reglas de negocio en un solo lugar y probadas | — Pendiente |
| App del repartidor como PWA, con Capacitor como plan B (ADR-003) | Android e iPhone sin tiendas; propuesta sujeta a la prueba de 0.3 | — Pendiente (prueba 0.3) |
| Tabla de eventos inmutable como fuente de verdad (ADR-004) | Trazabilidad defendible; estado derivado | — Pendiente |
| Cola de trabajos sobre PostgreSQL con procrastinate (ADR-005) | Un componente menos que Redis | — Pendiente |
| Monolito modular (ADR-006) | Despliegue y depuración simples | — Pendiente |
| Un solo repo; el sitio público vive en `apps/site` (ADR-007) | Una identidad, un CI, activos en la cuenta de LUCG | — Pendiente |
| Ambientes dev (`dev`) y prod (`main`, fusión a mano) (ADR-008) | El peor error del agente queda en dev | — Pendiente |

## Evolution
Este documento se actualiza al cerrar cada fase y cada hito.

**Al cerrar cada fase:** un requisito descartado pasa a Out of Scope con su razón; un requisito verificado en dev pasa a
Validated con la fase; un requisito nuevo entra en REQUIREMENTS.md con el siguiente número libre (sin renumerar los
existentes); una decisión nueva entra en Key Decisions y, si es de arquitectura, también en un ADR.

**Al cerrar cada hito:** se revisan todas las secciones, el Core Value y las razones de Fuera de alcance.

---
*Última actualización: 2026-11-26, al adoptar GSD sobre la planeación existente.*
