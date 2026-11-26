---
name: supabase-convenciones
description: Convenciones de base de datos del proyecto: nombres, esquema app, RLS por cuenta, set_contexto, cómo escribir y probar una migración. Cárgala antes de crear o cambiar tablas, políticas o migraciones.
---

# Convenciones Supabase / PostgreSQL

- Esquema `app` para negocio. Tablas en plural, snake_case, en español sin acentos (`envios`, `hojas_ruta`).
- Claves `id uuid default gen_random_uuid()`, `creado_en timestamptz default now()`, `actualizado_en` con trigger.
- Toda tabla de negocio: `cuenta_id uuid not null references app.cuentas(id)` + índice + RLS habilitado.
- Políticas: `interno_todo` (org_tipo = 'lucg') y `cuenta_propia` (cuenta_id = app.org_id()). En `app.eventos`
  no existen políticas de UPDATE/DELETE y el rol `lucg_api` no tiene esos privilegios.
- Contexto por transacción: la API ejecuta `select app.set_contexto(org_tipo, org_id, roles)` al abrir la sesión.
- Enums en `app` con valores en MAYUSCULAS_SNAKE iguales a los de `packages/domain`.
- Catálogos: columnas `codigo text unique`, `nombre`, `activo`; nunca se borran filas, se desactivan.
- Migraciones: `supabase migration new <nnnn_descripcion>`; una migración por cambio lógico; compatibles hacia atrás
  durante un ciclo (agregar antes de quitar). Probar con `supabase db reset` local y una consulta negativa de RLS.
- Seed solo de catálogos y usuarios sintéticos de pruebas; nunca datos reales.
- Storage: buckets privados `evidencias` e `importaciones`; sin políticas públicas; URLs firmadas desde la API.
- Después de cambiar el esquema: `supabase gen types typescript --local > packages/domain/src/supabase.types.ts`.
