# Runbook: incidentes
Severidades: S1 bodega o repartidores no pueden operar; S2 función degradada con alternativa; S3 defecto sin impacto operativo.
- S1: contingencia en papel (planilla numerada), aviso a coordinación, `/incident-response` para triage, estado cada 30 min, postmortem sin culpas en 48 h.
- Fuentes: Sentry (errores), `/health`, logs de la plataforma, Supabase (métricas), bandeja de sincronización.
- Nunca corregir datos a mano en producción: evento CORRECCION o migración revisada.
