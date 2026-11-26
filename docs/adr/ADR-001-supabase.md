# ADR-001: Supabase como base de datos, autenticación y almacenamiento
**Estado:** Aceptada · **Fecha:** 2026-11-05 · **Deciden:** desarrollador principal, gerencia LUCG
## Contexto
Equipo de 2–3 personas sin administrador de sistemas; respaldos y seguridad desde el día uno; costos bajos.
## Decisión
PostgreSQL gestionado en Supabase con Auth y Storage. Proyectos separados para dev y prod; prod en plan de pago.
## Opciones consideradas
| Opción | Complejidad | Costo | Escalabilidad | Familiaridad |
|---|---|---|---|---|
| Supabase | Baja | Decenas de USD/mes | Suficiente hasta 10x | Alta |
| PostgreSQL en VPS propio | Media | Bajo en licencia, alto en horas | Manual | Media |
| RDS / Cloud SQL | Alta | Mayor | Alta | Media |
## Consecuencias
+ Auth, storage y respaldos resueltos; PostgreSQL estándar exportable; storage compatible con S3.
− Proveedor extranjero (región East US); latencia aceptable; dependencia de límites del plan.
## Revisar si
Evidencias superan lo previsto; se requiere residencia de datos en Colombia.
