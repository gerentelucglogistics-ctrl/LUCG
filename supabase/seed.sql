-- Seed de catálogos (local y pruebas). Nunca datos reales.
insert into app.municipios (codigo, nombre, alias) values
 ('05045','APARTADÓ', array['APARTADO']),
 ('05147','CAREPA', array['CAREPA']),
 ('05172','CHIGORODÓ', array['CHIGORODO']),
 ('05480','MUTATÁ', array['MUTATA']),
 ('05490','NECOCLÍ', array['NECOCLI']),
 ('05665','SAN PEDRO DE URABÁ', array['SAN PEDRO DE URABA']),
 ('05659','SAN JUAN DE URABÁ', array['SAN JUAN DE URABA']),
 ('05051','ARBOLETES', array['ARBOLETES']),
 ('05837','TURBO', array['TURBO'])
on conflict (codigo) do nothing;

insert into app.causas_novedad (codigo, nombre, origen) values
 ('AUSENTE','Destinatario ausente','DESTINATARIO'),
 ('NO_CONTACTABLE','No contactable','DESTINATARIO'),
 ('RECHAZADO','Rechazado por el destinatario','DESTINATARIO'),
 ('DIRECCION_INCORRECTA','Dirección incorrecta','REMITENTE'),
 ('ZONA_RIESGO','Zona de riesgo','EXTERNO'),
 ('CLIMA','Condiciones naturales','EXTERNO'),
 ('DANO','Bulto dañado','LUCG'),
 ('REPROGRAMADO_DESTINATARIO','Destinatario pide otra fecha','DESTINATARIO'),
 ('OTRO','Otra novedad','OTRO')
on conflict (codigo) do nothing;

insert into app.tipos_receptor (codigo, nombre) values
 ('DESTINATARIO','Destinatario'),('FAMILIAR','Familiar'),('HIJO','Hijo o hija'),('PADRE','Padre o madre'),
 ('AMIGO','Amigo'),('AUTORIZADO','Persona autorizada'),('PORTERIA','Portería'),('VECINO','Vecino'),
 ('TIENDA','Tienda o establecimiento autorizado'),('OTRO','Otro receptor')
on conflict (codigo) do nothing;

insert into app.conceptos_cargo (codigo, nombre, sentido) values
 ('ENTREGA','Paquete entregado','COBRO'),('INTENTO','Intento fallido','COBRO'),('DEVOLUCION','Devolución gestionada','COBRO'),
 ('MULTA_RETRASO','Multa por retraso','PAGO'),('PERDIDO','Paquete perdido','PAGO'),
 ('PAGO_ENTREGA','Pago al repartidor por entrega','PAGO'),('DESCUENTO_FALTANTE','Descuento por faltante','COBRO')
on conflict (codigo) do nothing;

-- Cuenta IMILE (aliado) con contrato de 2 días
insert into app.cuentas (id, tipo, nombre) values ('00000000-0000-0000-0000-000000000001','ALIADO','IMILE') on conflict do nothing;
insert into app.contratos (cuenta_id, vigente_desde, reglas) values
 ('00000000-0000-0000-0000-000000000001', current_date,
  '{"intentos_max":2,"plazo_dias":2,"plazo_habiles":false,"evidencias_requeridas":["foto"],"receptores_permitidos":["DESTINATARIO","FAMILIAR","HIJO","PADRE","AMIGO","AUTORIZADO","PORTERIA","VECINO","OTRO"],"firma_delegada_permitida":false,"recaudo_permitido":false,"evento_facturable":"ENTREGADO"}');
