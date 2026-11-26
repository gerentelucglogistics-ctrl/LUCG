# ADR-006: Monolito modular, no microservicios
**Estado:** Aceptada · **Fecha:** 2026-11-05
## Decisión
Un servicio con módulos (cuentas, envios, bodega, rutas, entregas, novedades, devoluciones, conectores, finanzas, reportes, admin) que no comparten tablas entre sí salvo por claves; comunicación por servicios tipados.
## Consecuencias
+ Despliegue y depuración simples. − Disciplina de límites; separación posterior posible porque los módulos no cruzan tablas.
