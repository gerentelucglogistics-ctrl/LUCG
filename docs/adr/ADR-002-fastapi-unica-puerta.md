# ADR-002: Una API en FastAPI como única puerta de escritura
**Estado:** Aceptada · **Fecha:** 2026-11-05
## Contexto
Máquina de estados, custodia, tarifas y conectores son lógica delicada que debe vivir en un solo lugar y probarse.
## Decisión
Toda regla de negocio en FastAPI. Las apps no escriben directo en Supabase. RLS queda como segunda barrera.
## Opciones
Solo Supabase (PostgREST + edge functions): más rápido al inicio, lógica repartida. API en Node: equivalente, según equipo.
## Consecuencias
+ Pruebas unitarias de dominio, OpenAPI gratis, conectores limpios. − Un componente más que desplegar y monitorear.
