---
name: lucg-dominio
description: Glosario, estados, transiciones y reglas de custodia de la plataforma LUCG. Cárgala antes de tocar envíos, bultos, eventos, rutas, bodega, novedades o devoluciones, o cuando aparezca un término del dominio.
---

# Dominio LUCG

## Términos (usar exactamente estos)
- **Cuenta**: quien contrata y paga (aliado, cliente directo, ocasional, tienda). Nunca "cliente" a secas.
- **Aliado**: cuenta transportadora que entrega carga con sus propias guías (IMILE).
- **Remitente** / **Destinatario** / **Receptor** (quien firmó efectivamente).
- **Envío**: servicio de entrega de uno o más **bultos** a un destinatario. Guía LUCG + referencias externas.
- **Referencia externa**: guía del aliado, número de pedido o referencia del remitente. El escáner resuelve cualquiera.
- **Relación de llegada**: lo que una cuenta anuncia que entregará. No confundir con el manifiesto de carga del RNDC.
- **Acta de recepción** / **acta de devolución** / **acta de recogida**.
- **Viaje troncal**: trayecto Medellín–Urabá o entre municipios (no "despacho").
- **Hoja de ruta**: trabajo de un repartidor en una fecha. **Custodia**: quién tiene físicamente el bulto.
- **Intento**, **Novedad** (causa por la que no avanza), **Reclamación/PQR**, **Recaudo** (dinero de terceros), **Cargo**, **Prefactura**, **Liquidación**, **Evento**.

## Estados operativos del envío (lista cerrada)
GUIA_CREADA, PENDIENTE_RECOGIDA, EN_TRANSITO_A_LUCG, RECIBIDO_BODEGA, CON_DIFERENCIA_RECEPCION,
DISPONIBLE_ASIGNACION, BLOQUEADO_BODEGA, ASIGNADO, EN_PODER_REPARTIDOR, EN_RUTA, ENTREGADO,
ENTREGADO_PARCIAL, CON_NOVEDAD, REPROGRAMADO, DEVUELTO_BODEGA, FALTANTE, EN_DEVOLUCION,
DEVUELTO_REMITENTE, ENTREGADO_TRANSPORTADOR_TERCERO, SINIESTRADO, ANULADO.

Estados independientes: recaudo (NO_APLICA, PENDIENTE, COBRADO, LEGALIZADO, GIRADO) y
facturación (NO_FACTURABLE, FACTURABLE, PREFACTURADO, FACTURADO).

## Transiciones permitidas (resumen; la matriz completa vive en `apps/api/app/modules/envios/estados.py`)
- GUIA_CREADA → RECIBIDO_BODEGA | EN_TRANSITO_A_LUCG | PENDIENTE_RECOGIDA | ANULADO
- RECIBIDO_BODEGA → DISPONIBLE_ASIGNACION | CON_DIFERENCIA_RECEPCION | BLOQUEADO_BODEGA
- DISPONIBLE_ASIGNACION → ASIGNADO | BLOQUEADO_BODEGA | EN_DEVOLUCION
- ASIGNADO → EN_PODER_REPARTIDOR | DISPONIBLE_ASIGNACION (desasignar)
- EN_PODER_REPARTIDOR → EN_RUTA | DEVUELTO_BODEGA (transferencia: sigue EN_PODER_REPARTIDOR, cambia custodia)
- EN_RUTA → ENTREGADO | ENTREGADO_PARCIAL | CON_NOVEDAD | DEVUELTO_BODEGA | FALTANTE
- CON_NOVEDAD → REPROGRAMADO | DISPONIBLE_ASIGNACION | DEVUELTO_BODEGA | SINIESTRADO
- DEVUELTO_BODEGA → DISPONIBLE_ASIGNACION | EN_DEVOLUCION | BLOQUEADO_BODEGA
- EN_DEVOLUCION → DEVUELTO_REMITENTE
- Terminales: ENTREGADO, DEVUELTO_REMITENTE, ENTREGADO_TRANSPORTADOR_TERCERO, SINIESTRADO, ANULADO.
- IMILE: IMILE_LLEGADA produce RECIBIDO_BODEGA (actor conector); IMILE_ENTREGA produce ENTREGADO.

## Reglas de custodia
- La custodia cambia solo con escaneo de quien recibe (bodega, repartidor) o con evento del conector.
- Asignar no mueve custodia. Transferir exige red y escaneo del que recibe.
- Un bulto que no aparece al cerrar ruta pasa a FALTANTE con responsable = último custodio.

## Reglas por cuenta (viven en `contratos.reglas`, nunca en código)
intentos_max, plazo_dias, plazo_habiles, ventana_horaria, evidencias_requeridas, receptores_permitidos,
firma_delegada_permitida, recaudo_permitido, evento_facturable, formato_reporte.
Valor por defecto: 3 intentos / 3 días; IMILE: 2 días.

## Qué nunca se hace
- Escribir `estado_operativo` a mano. Editar o borrar eventos. Reetiquetar bultos de IMILE.
- Usar "paquete" en código o UI: es envío o bulto.
