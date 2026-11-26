# ROADMAP.md — LUCG Plataforma

Estado: [ ] pendiente · [~] en curso · [x] verificada en dev

## H0 Arranque y descubrimiento (sem 1–3)
- [ ] 0.1 Arranque técnico: monorepo sobre el repo del sitio (`apps/site`), ramas `dev`/`main`, Claude Code + GSD, Supabase dev y prod, API y apps base, proyectos de Vercel (site, web, driver) con dominios dev y prod, CI/CD, Sentry; el sitio importa `tokens.css`
- [ ] 0.2 Dominio: entrevistas, catálogos, estados (decidir si "En clasificación" es estado o solo evento `CLASIFICADO`), reglas IMILE (plazo, multas, perdidos), equivalencias de repartidores; contraste con `docs/requerimientos/informe-lucg.md`
- [ ] 0.3 Identidad y prototipos de consola y PWA sobre `tokens.css` (el sitio público se ajusta a la misma identidad); prueba de PWA en Android e iPhone reales sin señal; ADR-3 confirmado
- [ ] 0.4 Legal y contable: habilitación postal, política de datos, pólizas, modelo de pago a repartidores
Compuerta: LUCG firma estados, catálogos y pantallas.

## H1 Conector IMILE (sem 4–6) — R10–R14, R20–R26
- [ ] 1.1 Modelo: cuentas, envíos, referencias, bultos, eventos, registrar_evento, derivar_estado (TDD)
- [ ] 1.2 Importador de llegada y de entregas: detección, parseo, normalización, idempotencia, reporte
- [ ] 1.3 Pendientes, antigüedad, vencimientos, multa estimada, controles de calidad
- [ ] 1.4 Equivalencias de repartidor, cargos y liquidación por paquete entregado
- [ ] 1.5 Consola: carga de archivos, tablero IMILE, reporte de cierre de mes
Compuerta: un mes real cargado; pendientes y liquidación cuadran con lo calculado a mano.

## H2 Núcleo operativo (sem 7–10) — R01–R03, R30–R33
- [ ] 2.1 Cuentas, contratos y reglas; usuarios y roles; RLS completa
- [ ] 2.2 Máquina de estados completa y custodia; pruebas de toda transición
- [ ] 2.3 Relación de llegada, recepción por escaneo, acta, aceptación tácita, notificación
- [ ] 2.4 Captura rápida, etiqueta LUCG e impresión
- [ ] 2.5 Clasificación, inventario físico vs lógico, bloqueos
Compuerta: una recepción real con diferencias documentada en acta.

## H3 Rutas y app del repartidor (sem 11–15) — R34, R40–R45
- [ ] 3.1 Hojas de ruta, vehículos (R34), asignación por escaneo, confirmación de recepción, transferencias
- [ ] 3.2 PWA base: instalación, sesión por dispositivo, descarga de ruta, cola local
- [ ] 3.3 Entrega: receptor, firma, fotos, coordenadas, recaudo básico, parcial
- [ ] 3.4 Novedades, política de intentos, cierre de ruta, FALTANTE
- [ ] 3.5 Sincronización idempotente, conflictos, bandeja del coordinador
Compuerta: ruta completa sin señal sincronizada sin pérdidas en Android e iPhone.

## H4 Cierre del MVP (sem 16–18) — R50–R54
- [ ] 4.1 Devoluciones a aliado y a IMILE con acta
- [ ] 4.2 Reporte diario a cuentas; exportación de facturables
- [ ] 4.3 PQR mínimo, tablero operativo con indicadores por repartidor (R53), semáforo de vencimientos, novedad visible a la cuenta (R54)
- [ ] 4.4 Inventario inicial, capacitación, dos semanas en paralelo, primer PR `dev → main` de la plataforma a prod
Compuerta: diez días de conciliación sin diferencias; MVP en prod.

## H5 Portal y clientes directos (sem 19–24) — R60–R66
- [ ] 5.1 Tarifas con historial
- [ ] 5.2 Portal transaccional y de aliados
- [ ] 5.3 Mostrador, envíos salientes, transportador tercero
- [ ] 5.4 Recogidas y viajes troncales con modalidad y costo
- [ ] 5.5 Seguimiento público y avisos al destinatario (WhatsApp)
- [ ] 5.6 Sitio público integrado (R65): acceso clientes, rastrear envío, cotización como solicitud
Compuerta: un cliente directo opera un mes sin ayuda.

## H6 Dinero (sem 25–30) — R70–R75
- [ ] 6.1 Recaudo completo
- [ ] 6.2 Cargos, prefacturas, integración contable
- [ ] 6.3 Cartera y cuentas por pagar
- [ ] 6.4 Liquidaciones por modalidad, documento soporte
- [ ] 6.5 Costos con prorrateo troncal (R74), gastos generales y flujo de caja (R75), rentabilidad, tablero financiero
Compuerta: cierre de mes desde el sistema validado por el contador.
