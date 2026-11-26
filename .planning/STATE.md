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
- IMILE: ¿exportaciones de salida a ruta, fallidos y devoluciones? ¿correo automático o API?
- Contrato IMILE: fórmula de multas y valor por perdido.
- Lista de 18 repartidores con nombre exacto en IMILE y tarifa.
- Legal: habilitación postal, política de datos, pólizas.
- Vercel: plan y proyectos (site, web, driver); Root Directory del proyecto actual → `apps/site`.
- Confirmar con LUCG: IMILE primero; portal (H5) y finanzas (H6) después del MVP.

## Última verificación en dev
Ninguna todavía.

## Próximo paso
/gsd:new-project (si no se ha corrido) y luego /gsd:discuss-phase 0.1
