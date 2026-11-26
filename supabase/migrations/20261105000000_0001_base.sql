-- 0001_base: esquema, rol de aplicación, contexto, enums, núcleo y RLS.
-- Compatible con Supabase local y remoto. Ejecutar con `supabase db reset` (local) o `supabase db push`.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create schema if not exists app;

-- Rol con el que se conecta la API (nunca el rol de servicio). La contraseña la fija seed.sql en local/CI y el humano por SQL Editor en el alojado (runbook H-2).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'lucg_api') then
    create role lucg_api login nobypassrls;
  end if;
end $$;
grant usage on schema app to lucg_api;
alter default privileges in schema app grant select, insert, update, delete on tables to lucg_api;
alter default privileges in schema app grant usage, select on sequences to lucg_api;

-- Contexto por transacción --------------------------------------------------
create or replace function app.set_contexto(p_org_tipo text, p_org_id uuid, p_roles text[])
returns void language sql as $$
  select set_config('app.org_tipo', p_org_tipo, true),
         set_config('app.org_id', coalesce(p_org_id::text, ''), true),
         set_config('app.roles', array_to_string(p_roles, ','), true);
$$;
create or replace function app.org_tipo() returns text language sql stable as $$ select current_setting('app.org_tipo', true) $$;
create or replace function app.org_id() returns uuid language sql stable as $$ select nullif(current_setting('app.org_id', true), '')::uuid $$;
create or replace function app.tiene_rol(r text) returns boolean language sql stable as $$
  select r = any(string_to_array(current_setting('app.roles', true), ','))
$$;
create or replace function app.es_interno() returns boolean language sql stable as $$ select app.org_tipo() = 'lucg' $$;

-- Enums ---------------------------------------------------------------------
create type app.tipo_cuenta as enum ('ALIADO','DIRECTO','OCASIONAL','TIENDA');
create type app.tipo_custodia as enum ('ALIADO','VEHICULO_TRONCAL','BODEGA','REPARTIDOR','DESTINATARIO','REMITENTE','TRANSPORTADOR_TERCERO','NINGUNA');
create type app.estado_operativo as enum (
  'GUIA_CREADA','PENDIENTE_RECOGIDA','EN_TRANSITO_A_LUCG','RECIBIDO_BODEGA','CON_DIFERENCIA_RECEPCION',
  'DISPONIBLE_ASIGNACION','BLOQUEADO_BODEGA','ASIGNADO','EN_PODER_REPARTIDOR','EN_RUTA','ENTREGADO',
  'ENTREGADO_PARCIAL','CON_NOVEDAD','REPROGRAMADO','DEVUELTO_BODEGA','FALTANTE','EN_DEVOLUCION',
  'DEVUELTO_REMITENTE','ENTREGADO_TRANSPORTADOR_TERCERO','SINIESTRADO','ANULADO');
create type app.estado_recaudo as enum ('NO_APLICA','PENDIENTE','COBRADO','LEGALIZADO','GIRADO');
create type app.estado_facturacion as enum ('NO_FACTURABLE','FACTURABLE','PREFACTURADO','FACTURADO');
create type app.tipo_evento as enum (
  'ENVIO_CREADO','RELACION_IMPORTADA','RECEPCION_ESCANEO','RECEPCION_CERRADA','DIFERENCIA_RECEPCION','CLASIFICADO',
  'BLOQUEADO','DESBLOQUEADO','ASIGNADO','DESASIGNADO','CUSTODIA_REPARTIDOR','RUTA_INICIADA','INTENTO_EXITOSO',
  'INTENTO_PARCIAL','INTENTO_FALLIDO','NOVEDAD_DECISION','REPROGRAMADO','TRANSFERENCIA','RETORNO_BODEGA','FALTANTE',
  'LOTE_DEVOLUCION','DEVUELTO','ENTREGA_TRANSPORTADOR_TERCERO','SINIESTRO','ANULADO','RECAUDO_COBRADO',
  'RECAUDO_LEGALIZADO','RECAUDO_GIRADO','CARGO_GENERADO','IMILE_LLEGADA','IMILE_ENTREGA','CORRECCION');
create type app.actor_tipo as enum ('USUARIO','CONECTOR','SISTEMA');

-- Utilidades ----------------------------------------------------------------
create or replace function app.touch_actualizado_en() returns trigger language plpgsql as $$
begin new.actualizado_en = now(); return new; end $$;

-- Catálogos -----------------------------------------------------------------
create table app.municipios (
  codigo text primary key, nombre text not null, departamento text not null default 'ANTIOQUIA',
  alias text[] not null default '{}', activo boolean not null default true
);
create table app.zonas (
  id uuid primary key default gen_random_uuid(), municipio_codigo text not null references app.municipios(codigo),
  codigo text unique not null, nombre text not null, activo boolean not null default true
);
create table app.causas_novedad (codigo text primary key, nombre text not null, origen text not null, activo boolean not null default true);
create table app.tipos_receptor (codigo text primary key, nombre text not null, activo boolean not null default true);
create table app.conceptos_cargo (codigo text primary key, nombre text not null, sentido text not null check (sentido in ('COBRO','PAGO')), activo boolean not null default true);

-- Cuentas y usuarios --------------------------------------------------------
create table app.cuentas (
  id uuid primary key default gen_random_uuid(),
  tipo app.tipo_cuenta not null, nombre text not null, nit text, estado text not null default 'ACTIVA',
  contacto jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now(), actualizado_en timestamptz not null default now()
);
create table app.contratos (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid not null references app.cuentas(id),
  vigente_desde date not null, vigente_hasta date,
  reglas jsonb not null default '{"intentos_max":3,"plazo_dias":3,"plazo_habiles":false,"evidencias_requeridas":["foto"],"receptores_permitidos":["DESTINATARIO"],"firma_delegada_permitida":false,"recaudo_permitido":false,"evento_facturable":"ENTREGADO"}'::jsonb,
  formato_reporte jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now(), actualizado_en timestamptz not null default now()
);
create index on app.contratos (cuenta_id, vigente_desde desc);

create table app.usuarios (
  id uuid primary key,                       -- = auth.users.id
  org_tipo text not null check (org_tipo in ('lucg','cuenta')),
  cuenta_id uuid references app.cuentas(id), -- null cuando org_tipo = lucg
  nombre text not null, roles text[] not null default '{}', estado text not null default 'ACTIVO',
  dispositivo_id text,
  creado_en timestamptz not null default now(), actualizado_en timestamptz not null default now(),
  check ((org_tipo = 'lucg' and cuenta_id is null) or (org_tipo = 'cuenta' and cuenta_id is not null))
);
create table app.repartidores (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references app.usuarios(id), nombre text not null, documento text,
  municipios text[] not null default '{}', vinculacion text not null default 'POR_ENTREGA',
  tarifa_por_entrega numeric(12,2), documentos jsonb not null default '[]'::jsonb, activo boolean not null default true,
  creado_en timestamptz not null default now(), actualizado_en timestamptz not null default now()
);
create table app.equivalencias_repartidor (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid not null references app.cuentas(id),
  nombre_externo_normalizado text not null, repartidor_id uuid references app.repartidores(id),
  confirmado boolean not null default false, creado_en timestamptz not null default now(),
  unique (cuenta_id, nombre_externo_normalizado)
);

-- Envíos --------------------------------------------------------------------
create sequence app.guia_lucg_seq;
create table app.envios (
  id uuid primary key default gen_random_uuid(),
  guia_lucg text unique not null default ('LUCG' || lpad(nextval('app.guia_lucg_seq')::text, 9, '0')),
  cuenta_id uuid not null references app.cuentas(id),
  remitente jsonb not null default '{}'::jsonb, destinatario jsonb not null default '{}'::jsonb,
  direccion text, municipio_codigo text references app.municipios(codigo), zona_id uuid references app.zonas(id),
  servicio text, fecha_limite timestamptz, valor_declarado numeric(14,2), monto_recaudo numeric(14,2),
  estado_operativo app.estado_operativo not null default 'GUIA_CREADA',
  estado_recaudo app.estado_recaudo not null default 'NO_APLICA',
  estado_facturacion app.estado_facturacion not null default 'NO_FACTURABLE',
  custodia_tipo app.tipo_custodia not null default 'REMITENTE', custodia_id uuid,
  datos_incompletos boolean not null default false, marcas text[] not null default '{}',
  creado_en timestamptz not null default now(), actualizado_en timestamptz not null default now()
);
create index on app.envios (cuenta_id, estado_operativo);
create index on app.envios (fecha_limite) where estado_operativo not in ('ENTREGADO','DEVUELTO_REMITENTE','ANULADO','SINIESTRADO','ENTREGADO_TRANSPORTADOR_TERCERO');

create table app.referencias_externas (
  id uuid primary key default gen_random_uuid(),
  envio_id uuid not null references app.envios(id) on delete cascade,
  cuenta_id uuid not null references app.cuentas(id),
  tipo text not null, valor text not null,
  unique (cuenta_id, tipo, valor)
);
create index on app.referencias_externas (valor);

create table app.bultos (
  id uuid primary key default gen_random_uuid(),
  envio_id uuid not null references app.envios(id) on delete cascade,
  cuenta_id uuid not null references app.cuentas(id),
  codigo text not null, peso numeric(10,3), dimensiones jsonb,
  estado app.estado_operativo not null default 'GUIA_CREADA',
  custodia_tipo app.tipo_custodia not null default 'REMITENTE', custodia_id uuid,
  unique (cuenta_id, codigo)
);

create table app.eventos (
  id uuid primary key,                       -- UUID generado en el origen (idempotencia natural)
  envio_id uuid not null references app.envios(id),
  bulto_id uuid references app.bultos(id),
  cuenta_id uuid not null references app.cuentas(id),
  tipo app.tipo_evento not null,
  hora_servidor timestamptz not null default now(), hora_dispositivo timestamptz,
  actor_tipo app.actor_tipo not null, actor_id uuid,
  ubicacion_id uuid, coordenadas point, dispositivo_id text,
  payload jsonb not null default '{}'::jsonb, evidencia_pendiente boolean not null default false,
  corrige_evento_id uuid references app.eventos(id)
);
create index on app.eventos (envio_id, hora_servidor);
create index on app.eventos (cuenta_id, tipo, hora_servidor);

create table app.idempotencia (
  clave text primary key, hash_cuerpo text not null, respuesta jsonb, expira_en timestamptz not null
);
create table app.auditoria (
  id bigserial primary key, actor_id uuid, accion text not null, objeto text not null, objeto_id uuid,
  valor_anterior jsonb, valor_nuevo jsonb, motivo text, hora timestamptz not null default now()
);

-- Triggers ------------------------------------------------------------------
create trigger t_cuentas_touch before update on app.cuentas for each row execute function app.touch_actualizado_en();
create trigger t_contratos_touch before update on app.contratos for each row execute function app.touch_actualizado_en();
create trigger t_usuarios_touch before update on app.usuarios for each row execute function app.touch_actualizado_en();
create trigger t_envios_touch before update on app.envios for each row execute function app.touch_actualizado_en();

-- RLS -----------------------------------------------------------------------
alter table app.cuentas enable row level security;
alter table app.contratos enable row level security;
alter table app.usuarios enable row level security;
alter table app.repartidores enable row level security;
alter table app.equivalencias_repartidor enable row level security;
alter table app.envios enable row level security;
alter table app.referencias_externas enable row level security;
alter table app.bultos enable row level security;
alter table app.eventos enable row level security;
alter table app.idempotencia enable row level security;
alter table app.auditoria enable row level security;

-- Interno: todo. Cuenta: solo sus filas. Las tablas sin cuenta_id (usuarios, repartidores, idempotencia, auditoria) son internas
-- salvo la propia fila del usuario.
create policy interno_todo on app.cuentas for all using (app.es_interno()) with check (app.es_interno());
create policy cuenta_propia on app.cuentas for select using (id = app.org_id());
create policy interno_todo on app.contratos for all using (app.es_interno()) with check (app.es_interno());
create policy cuenta_propia on app.contratos for select using (cuenta_id = app.org_id());
create policy interno_todo on app.usuarios for all using (app.es_interno()) with check (app.es_interno());
create policy usuario_propio on app.usuarios for select using (cuenta_id = app.org_id());
create policy interno_todo on app.repartidores for all using (app.es_interno()) with check (app.es_interno());
create policy interno_todo on app.equivalencias_repartidor for all using (app.es_interno()) with check (app.es_interno());
create policy interno_todo on app.envios for all using (app.es_interno()) with check (app.es_interno());
create policy cuenta_propia on app.envios for select using (cuenta_id = app.org_id());
create policy interno_todo on app.referencias_externas for all using (app.es_interno()) with check (app.es_interno());
create policy cuenta_propia on app.referencias_externas for select using (cuenta_id = app.org_id());
create policy interno_todo on app.bultos for all using (app.es_interno()) with check (app.es_interno());
create policy cuenta_propia on app.bultos for select using (cuenta_id = app.org_id());
-- eventos: solo SELECT e INSERT; nunca UPDATE/DELETE
create policy interno_lee on app.eventos for select using (app.es_interno());
create policy interno_inserta on app.eventos for insert with check (app.es_interno());
create policy cuenta_lee on app.eventos for select using (cuenta_id = app.org_id());
create policy interno_todo on app.idempotencia for all using (app.es_interno()) with check (app.es_interno());
create policy interno_todo on app.auditoria for all using (app.es_interno()) with check (app.es_interno());

grant select, insert, update, delete on all tables in schema app to lucg_api;
revoke update, delete on app.eventos from lucg_api;
grant usage, select on all sequences in schema app to lucg_api;
grant execute on all functions in schema app to lucg_api;
