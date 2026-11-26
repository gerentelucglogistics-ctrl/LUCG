# REQUIREMENTS.md — LUCG Plataforma

Numeración estable. Cada fase referencia los requisitos que cubre.

## Cuentas y reglas
- R01 Cuentas tipo aliado, cliente directo, ocasional y tienda, con contratos vigentes por fecha.
- R02 Reglas por cuenta en el contrato: intentos, plazo, ventana horaria, evidencias, receptores permitidos, firma delegada, recaudo, evento facturable, formato de reporte.
- R03 Usuarios internos (superadministrador, coordinador, bodega, repartidor; luego servicio al cliente, cartera, comercial, gerencia) y externos (administrador, operador, consulta) con separación estricta por cuenta.

## Envíos y eventos
- R10 Envío con bultos, referencias externas múltiples y guía LUCG; el escáner resuelve cualquier referencia.
- R11 Tabla de eventos inmutable con actor, hora del dispositivo y del servidor, ubicación, dispositivo y payload.
- R12 Estado operativo, de recaudo y de facturación derivados de los eventos; transiciones validadas.
- R13 Custodia explícita (aliado, vehículo troncal, bodega, repartidor, destinatario, remitente, transportador tercero).
- R14 Correcciones solo por evento CORRECCION con motivo; auditoría de acciones sensibles.

## Conector IMILE
- R20 Importar archivo de llegada: crea envíos, registra recepción, inicia plazo del contrato.
- R21 Importar archivo de entregas: cierra envíos, registra repartidor, receptor, coordenadas, dispositivo, modo offline.
- R22 Idempotencia por fila; reimportar no duplica; reporte de importación.
- R23 Equivalencias de nombres de repartidor con sugerencia y confirmación manual.
- R24 Pendientes con antigüedad y vencimientos; multa estimada por contrato.
- R25 Controles de calidad configurables sobre entregas importadas.
- R26 Liquidación de repartidores por paquete entregado y cierre de mes IMILE.
- R27 Exportación de novedades/devoluciones en formato IMILE cuando IMILE la acepte.

## Bodega
- R30 Relación de llegada por archivo, API, portal o captura rápida; etiqueta LUCG solo para bultos sin código.
- R31 Recepción por escaneo contra relación; acta con faltantes, sobrantes y daños; aceptación tácita a 24 h.
- R32 Clasificación por zona; inventario físico contra lógico; bloqueos.
- R33 Viaje troncal con modalidad (cliente, LUCG, proveedor, propio), quién entrega y quién paga.
- R34 Vehículos: placa, tipo, capacidad, propietario o proveedor, conductor autorizado, estado, documentos con vencimiento; vehículo por defecto del repartidor en la hoja de ruta; salida y regreso con responsable; el historial del envío conserva el vehículo de cada etapa.

## Rutas y app del repartidor
- R40 Hojas de ruta por repartidor y fecha; asignación por escaneo; confirmación de recepción física; transferencias con red.
- R41 PWA instalable en Android e iPhone; ruta, navegación, llamada y WhatsApp al destinatario.
- R42 Entrega con tipo de receptor (destinatario, familiar, hijo/hija, padre/madre, amigo, persona autorizada, portería, vecino, tienda autorizada, otro), nombre, firma, fotos, coordenadas; entrega parcial por bulto.
- R43 Modo sin conexión con cola local, sincronización idempotente y bandeja de rechazados.
- R44 Novedades con causa, evidencia y política de intentos; reprogramación; cierre de ruta con escaneo de retorno; FALTANTE.
- R45 Evidencias sin datos sensibles innecesarios: guía en pantalla para no fotografiar rostros ni documentos; marca de agua con guía y hora.

## Devoluciones, reclamaciones y comunicaciones
- R50 Lotes de devolución al remitente o al aliado con acta.
- R51 Reclamaciones/PQR con responsable, plazo legal y resolución; siniestros con valor declarado e investigación.
- R52 Reporte diario a cuentas por correo (y WhatsApp por enlace); avisos al destinatario desde H5.
- R53 Indicadores operativos por repartidor, municipio y cuenta con fórmulas documentadas (entrega sobre recibidos, cumplimiento de plazo, tasa de novedades, pendientes al cierre, intentos) y criterio de fecha explícito; semáforo de plazos con fecha límite y tiempo restante.
- R54 La cuenta ve la novedad desde el primer intento fallido, con el teléfono de contacto de quien tiene el envío (reporte diario en el MVP; portal en H5).

## Portal y clientes directos (H5)
- R60 Tarifas por cuenta, zona, peso y servicio con historial.
- R61 Portal: crear envíos individuales y masivos, etiqueta, seguimiento, evidencias, responder novedades; portal de aliados en lectura.
- R62 Mostrador con cobro y comprobante; envíos salientes a otras ciudades con entrega a transportador tercero.
- R63 Recogidas; seguimiento público con verificación parcial del teléfono.
- R64 Modalidades de cobro: anticipado, contra entrega, crédito, periódico; pagos en línea preparados.
- R65 Sitio público (`apps/site`) integrado: identidad desde `packages/ui/tokens.css`, botón "Acceso clientes" al portal, "Rastrear envío" hacia `/t/{guia}`, y la cotización crea una solicitud en la plataforma además de WhatsApp.
- R66 Dirección de entrega con ubicación en mapa opcional al crear el envío.

## Dinero (H6)
- R70 Recaudo completo: caja por repartidor, legalización, giros, conciliación; dinero de terceros.
- R71 Cargos, prefacturas por cuenta, integración con software contable, cartera y cuentas por pagar.
- R72 Liquidación por modalidad (nómina, contratista, por entrega, ruta, jornada) y documento soporte.
- R73 Costos de transporte y personal, rentabilidad por cuenta, servicio, municipio, ruta y modalidad de negocio, tablero financiero.
- R74 Prorrateo del costo de un viaje troncal entre envíos y cuentas (por bulto, peso, volumen o combinación, según acuerdo con el proveedor).
- R75 Gastos generales (arriendo, servicios, insumos, software) con presupuesto contra ejecutado, sin duplicar personal; flujo de caja (recaudo, cartera, cuentas por pagar) separado de la rentabilidad.

## No funcionales
- N01 Picos de 600 llegadas y 600 entregas por día; diseñar para 2.000; 30 repartidores concurrentes.
- N02 Escaneo < 1 s; sincronización de un intento con 3 fotos < 10 s en 4G.
- N03 Disponibilidad 99,5 %; respaldo diario; restauración probada por trimestre.
- N04 RLS por cuenta; evidencias por URL firmada; auditoría; 2FA en roles sensibles.
- N05 UTC en base, America/Bogota en pantalla, hora del dispositivo conservada.
- N06 Cobertura de pruebas 90 % en envíos y conector IMILE, 70 % global; Playwright en vista previa y en dev.
- N07 Cada fase desplegada en dev y verificada allí antes de cerrarse; prod solo por PR `dev → main` fusionado a mano.
- N08 Identidad visual única (tokens compartidos) en sitio público, consola, portal y PWA.
