---
name: pwa-offline
description: Protocolo sin conexión de la app del repartidor: cola local, idempotencia, qué se permite sin red, sincronización y cómo se prueba. Cárgala antes de tocar apps/driver o el endpoint /sync/eventos.
---

# PWA sin conexión

## Qué se permite sin red
Ver ruta y datos del destinatario; confirmar recepción física por escaneo contra la lista local; registrar entrega
(receptor, firma, fotos, coordenadas, recaudo); registrar novedad. **No**: transferencias, reasignaciones, recibir
nuevas asignaciones.

## Cola local (Dexie, `apps/driver/src/db.ts`)
Tablas: `ruta` (instantánea con versión), `bultos`, `eventos_pendientes` {id uuid, tipo, envio_ref, bulto_ref,
hora_dispositivo, payload, estado: pendiente|enviando|aceptado|rechazado, intentos, motivo}, `fotos_pendientes`
{id, evento_id, blob, estado}. Nada se borra hasta que el servidor confirme aceptado o duplicado.

## Sincronización
- `POST /api/v1/sync/eventos` con lotes de ≤50 en orden cronológico, cabecera `Idempotency-Key` = id del lote.
- Respuesta por ítem: aceptado | duplicado | rechazado {motivo}. Aceptado y duplicado → borrar de la cola.
  Rechazado → conservar, mostrar al repartidor, enviar a bandeja del coordinador.
- Fotos: tras aceptado, pedir URLs firmadas (`POST /evidencias/urls`), subir a Storage, `PATCH` para confirmar.
- Disparadores: al reconectar (`online`), al abrir la app, al volver a primer plano, cada 2 min si hay pendientes;
  Background Sync en Android cuando exista.
- Mostrar siempre el contador de pendientes; alerta a las 2 h.

## Reglas
- Toda hora lleva `hora_dispositivo`; el servidor añade `hora_servidor`.
- Compresión de fotos en canvas a ≤300 KB y 1600 px de lado mayor; marca de agua con guía y hora.
- Solicitar `navigator.storage.persist()` al instalar. En iPhone no hay Background Sync: sincronizar al abrir.
- Sesión ligada al dispositivo (`dispositivo_id` en localStorage + registro en API); si el servidor la revoca, la app
  bloquea escritura pero conserva la cola.

## Pruebas (Playwright)
- `context.setOffline(true)` → registrar 3 entregas con foto → `setOffline(false)` → verificar en consola 3 eventos,
  0 duplicados, fotos presentes. Repetir el envío del mismo lote → 3 duplicados, 0 nuevos.
- Rechazo: transferir el bulto desde consola mientras la app está sin red → al sincronizar, ítem rechazado visible.
