# ADR-004: Tabla de eventos inmutable como fuente de verdad
**Estado:** Aceptada · **Fecha:** 2026-11-05
## Decisión
Todo cambio es un evento (actor, hora dispositivo y servidor, lugar, dispositivo, payload). El estado se deriva con una función pura y se guarda desnormalizado en `envios`. Correcciones = evento CORRECCION. Sin UPDATE/DELETE en `app.eventos`.
## Consecuencias
+ Trazabilidad defendible ante aliados, seguros y reclamos; reportes reproducibles. − Disciplina y más filas; recalculo nocturno de consistencia.
