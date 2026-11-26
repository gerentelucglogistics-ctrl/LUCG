# Runbook: despliegue
- Dev: automático al fusionar en `dev` (`deploy-dev.yml`), seguido de `e2e-dev.yml`.
- Prod: el desarrollador principal abre y fusiona a mano el PR `dev → main`. Antes: `/deploy-checklist`, `/security-review`, dump de la base
  de prod (`supabase db dump -f respaldo-$(date +%F).sql --linked`). Al fusionar: Vercel publica `main`; `deploy-prod.yml` espera la aprobación
  del entorno `prod`, migra, despliega API y worker y corre el humo. El agente no participa (hook `guardia-prod.sh`).
- Reversión: redesplegar la imagen anterior (Railway/Fly: redeploy del release previo; Vercel: "promote" del despliegue previo). Migraciones son compatibles hacia atrás un ciclo; si no, ejecutar la migración de reversión documentada en el PR.
- Verificación post-despliegue: `just smoke <dev|prod>`, Sentry sin errores nuevos 30 min.
