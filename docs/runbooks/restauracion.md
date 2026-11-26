# Runbook: restauración de base de datos
1. Identificar el respaldo (panel de Supabase → Backups, o dump manual en la bóveda).
2. Restaurar en un proyecto temporal primero; validar conteos (`envios`, `eventos`) y una muestra de evidencias.
3. Ventana de mantenimiento fuera de 5:00–20:00; aviso a coordinación; API en modo solo lectura (variable `READ_ONLY=1`).
4. Restaurar en prod; `supabase migration list` debe coincidir; `just smoke prod`.
5. Registrar en `.planning/STATE.md` y en Sentry (release con nota). Prueba trimestral obligatoria de este runbook.
