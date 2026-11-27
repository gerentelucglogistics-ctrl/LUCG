---
name: imile-conector
description: Estructura de los archivos Excel de IMILE (llegada y entregas), reglas de cruce, equivalencias de repartidores y controles de calidad. Cárgala antes de tocar apps/api/app/modules/conectores/imile.
---

# Conector IMILE

## Archivos
**Llegada** (hoja `sheet1`, 31 columnas). Columnas usadas:
`Scan Time` (hora de recepción, America/Bogota), `Waybill Number` (guía IMILE = referencia externa principal),
`UUID` (lote de llegada), `Client Code`/`Client Name` (cliente final: TEMU, COLAT, Cainiao),
`Destination City` (municipio; alias en catálogo), `Consignee ZipCode`, `Operator` (quién escaneó en LUCG).
Detección: cabecera contiene `Waybill Number` y `Scan Type`.

**Entregas** (`Delivered`, 32 columnas). Columnas usadas:
`Waybill No.`, `Order No.`, `Delivered time`, `DA` (repartidor, texto libre con espacios), `Recipient City`,
`Consignee`, `Signer Name`, `Signer Relationship` (En persona, otros, Amigo, Padres, Hijo/Hija, Vecino, Concierge),
`Feedback coordinates`, `POD Shoot Coordinate` (`0.00000,0.00000` = ausente), `Data source` (REDeliveryApp | Web),
`Operate Device`, `Offline Delivered time`, `POD Source`.
Detección: cabecera contiene `Waybill No.` y `Delivered time`.

## Reglas de importación
1. Guardar el archivo original en Storage `importaciones/imile/{fecha}/{sha256}.xlsx` antes de procesar.
2. Idempotencia por fila: hash(tipo, waybill, hora). Reimportar = no-op contado como "repetida".
3. Llegada: crear envío si no existe (cuenta IMILE, ref tipo `guia_aliado`), evento `IMILE_LLEGADA`,
   estado RECIBIDO_BODEGA, `fecha_limite = llegada + plazo del contrato`.
4. Entrega: si el envío no existe, crearlo con marca `sin_llegada_registrada`; evento `IMILE_ENTREGA` con todo
   el payload; estado ENTREGADO; `CARGO_GENERADO` al repartidor con tarifa vigente solo si la equivalencia está confirmada.
5. Nombres de `DA`: normalizar (trim, minúsculas, sin acentos, espacios simples) y buscar en `equivalencias_repartidor`;
   sin equivalencia → sugerir por distancia de edición y dejar "pendiente de confirmar".
6. Municipios: normalizar y resolver por alias; desconocido → fila válida pero marcada `fuera_cobertura`.
7. Nunca borrar ni modificar eventos importados; una corrección es un evento `CORRECCION`.

## Controles de calidad (marcas sobre `IMILE_ENTREGA`, umbral configurable por cuenta)
WEB_SIN_APP, SIN_COORDENADAS, MISMO_PUNTO (>5/día mismo repartidor y coordenada), RAFAGA (<60 s entre entregas
del mismo repartidor), RECEPTOR_OTROS_SIN_NOMBRE, FUERA_HORARIO (<06:00 o >21:00), OFFLINE_TARDIO (>6 h),
MUNICIPIO_DISTINTO (entrega vs destino de llegada).

## Pruebas
Fixtures anonimizadas en `apps/api/tests/fixtures/imile/` (llegada.xlsx, entregas_mes.xlsx, entregas_dia.xlsx).
Cada regla tiene un caso. Reimportar un fixture dos veces no cambia conteos.
