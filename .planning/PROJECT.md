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
