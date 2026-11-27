# ADR-005: Cola de trabajos sobre PostgreSQL (procrastinate) en lugar de Redis
**Estado:** Aceptada · **Fecha:** 2026-11-05
## Decisión
Worker en Python con procrastinate sobre la misma base. Migrar a Redis/Celery si el volumen supera 5.000 eventos/día.
## Consecuencias
+ Un componente menos. − Carga adicional pequeña en la base.
