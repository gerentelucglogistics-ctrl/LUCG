# ADR-003: App del repartidor como PWA (Android e iPhone)
**Estado:** Propuesta, sujeta a prueba de campo en fase 0.3 · **Fecha:** 2026-11-05
## Contexto
Escaneo, cámara, firma, ubicación y trabajo sin señal en teléfonos variados; despliegue sin tiendas; LUCG exige Android e iPhone.
## Decisión
PWA React con cola local (Dexie), lector de códigos en navegador y sincronización idempotente. Capacitor como plan B.
## Opciones
Nativa (Flutter/RN): mejor background sync y almacenamiento garantizado; más costo y tiendas. PWA + Capacitor: intermedio.
## Consecuencias
+ Una base de código, instalación inmediata. − iPhone sin Background Sync; datos locales pueden borrarse tras días sin uso → sincronizar al abrir, pedir almacenamiento persistente, instalar en pantalla de inicio.
## Criterio de confirmación
Prueba 0.3: ruta de 10 entregas en modo avión y sincronización sin pérdida en un Android de gama baja y un iPhone.
