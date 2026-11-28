# ADR-008: Dos ambientes en la nube (dev y prod) con ramas `dev` y `main`
**Estado:** Aceptada · Enmendada por ADR-009 (2026-11-28) · **Fecha:** 2026-11-26 · **Deciden:** desarrollador principal
## Decisión
- `dev` → ambiente **dev** (Supabase dev, API dev, dominios dev en Vercel). Las ramas `fase/...` se fusionan aquí por PR con CI verde;
  el despliegue y las pruebas contra dev son automáticos. Aquí trabaja el agente en modo YOLO.
- `main` → ambiente **prod**. Solo cambia cuando el desarrollador principal fusiona a mano el PR `dev → main`, con una sola aprobación de jaras97 (ADR-009). Vercel publica `main`
  en los dominios de producción; `deploy-prod.yml` migra la base y despliega la API con la aprobación del entorno `prod` de GitHub.
- Local (Supabase CLI) no cuenta como ambiente compartido.
## Por qué no `main` = dev
Vercel publica la rama de producción (`main`) en el dominio real con cada merge; el sitio público ya está en producción en ese repo.
## Consecuencias
+ Encaja con Vercel sin configuración especial; el peor caso de un error del agente es un dev roto.
− Migraciones deben ser compatibles hacia atrás un ciclo (el front de prod puede publicarse antes de que termine la migración).
− Hay que mantener `dev` adelante de `main` (nunca commits directos en `main`; hotfix = rama desde `main`, PR a `main` y luego a `dev`).
## Dominios sugeridos
prod: `lucglogistics.com` (site), `app.` (consola, portal, seguimiento), `repartidor.` (PWA), `api.`.
dev: `dev.`, `app-dev.`, `repartidor-dev.`, `api-dev.` (o los dominios `*.vercel.app` de la rama `dev`).
