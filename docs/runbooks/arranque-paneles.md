# Runbook: arranque de paneles (fase 0.1)

Guía paso a paso de lo que solo puede hacer una persona en los paneles de GitHub, Supabase, Sentry, Railway y Vercel.
Orden de ejecución: H-1 a H-10.

> Avisos:
> - El agente no crea cuentas ni toca prod (regla 9). Prod y `main` los maneja el desarrollador principal a mano.
> - Nunca pegues secretos en el chat ni en el repositorio. Se cargan en los paneles o con `gh secret set NOMBRE --env dev`.
> - Los valores no secretos que se piden al final de cada paso (refs, hosts, slugs, IDs) sí se devuelven al agente.
> - Marcadores usados abajo: `<ref>` (referencia del proyecto Supabase), `<generada>` (contraseña que tú generas), `<x>` (valor que muestra el panel).

## H-1 GitHub (D-03, D-19)

- [ ] Crear una organización Free de LUCG con un correo de LUCG.
- [ ] Invitar a `jaras97` como Owner.
- [ ] Transferir `gerentelucglogistics-ctrl/LUCG` a la organización (Settings › General › Danger Zone › Transfer ownership). El repositorio se mantiene **Public** (D-19).
- [ ] Settings › Branches: rama por defecto = `dev`. Pitfall 1: los workflows con `schedule` y `workflow_dispatch` solo se leen desde la rama por defecto.
- [ ] Settings › Environments: crear `dev` (Deployment branches: Selected branches → `dev`) y `prod` (Required reviewers = el desarrollador; Deployment branches: Selected → `main`).
- [ ] Settings › Actions › General: "Require approval for all outside collaborators" para workflows de forks y Workflow permissions = Read repository contents.

Evidencia esperada: URL del repositorio dentro de la organización y captura de Environments con las reglas.

## H-2 Supabase (D-02, D-04, D-18)

- [ ] Crear la organización de Supabase a nombre de LUCG en plan Free.
- [ ] Crear los proyectos `lucg-dev` y `lucg-prod` en la región East US (North Virginia, us-east-1).
- [ ] Guardar en un gestor de contraseñas la contraseña del usuario `postgres` de cada proyecto (es `SUPABASE_DB_PASSWORD`).
- [ ] Authentication › Sign In / Providers: desactivar "Allow new users to sign up" en ambos proyectos.
- [ ] Comprobar las claves de firma: `curl https://<ref>.supabase.co/auth/v1/.well-known/jwks.json`. Las claves deben tener `kty` EC o RSA y ninguna `oct` (Pitfall 6).
- [ ] En el SQL Editor de cada proyecto, ANTES del primer despliegue, crear el rol de la API con contraseña propia:
  `create role lucg_api login nobypassrls password '<generada>';`
  Genera la contraseña con `openssl rand -base64 32 | tr -d '/+='`. La migración 0001 usa `if not exists` y no lo recrea, así nunca existe un rol sin contraseña ni con una contraseña pública. Este paso reemplaza el H-3 posterior de RESEARCH.
- [ ] Connect › Session pooler: copiar el host `aws-<N>-us-east-1.pooler.supabase.com` y armar
  `DATABASE_URL=postgresql+psycopg://lucg_api.<ref>:<generada>@<host>:5432/postgres?sslmode=require`
- [ ] Settings › API Keys: copiar la clave publishable `sb_publishable_...` (no es secreta) y, solo en dev, la secret `sb_secret_...`.
- [ ] Account › Access Tokens: crear el token `lucg-ci` (será `SUPABASE_ACCESS_TOKEN`).
- [ ] Recordar que el plan Free no tiene respaldos automáticos (D-04, riesgo aceptado).

Evidencia esperada: devolver al agente el ref de dev, el ref de prod y los hosts del pooler. Captura del JWKS sin claves `oct`.

## H-3 Sentry (D-15, D-18)

- [ ] Crear la organización LUCG en plan Developer (gratis), región US.
- [ ] Crear tres proyectos con el slug exacto: `api` (Python/FastAPI), `web` (React) y `driver` (React).
- [ ] Copiar los 3 DSN (no son secretos fuertes, pero no los pegues en el repositorio).
- [ ] Settings › Security & Privacy: activar Data Scrubber y Default Scrubbers, y activar "Prevent Storing of IP Addresses" (habeas data).
- [ ] Crear un Organization Token con scope de releases: es `SENTRY_AUTH_TOKEN`.

Evidencia esperada: devolver al agente el slug de la organización. Captura de Security & Privacy con los tres ajustes activos.

## H-4 Railway (D-01, D-02, D-18)

- [ ] Crear la cuenta Hobby con un correo de LUCG.
- [ ] Crear el proyecto vacío `lucg`.
- [ ] Crear los entornos `dev` y `prod` (renombrar `production` a `prod`).
- [ ] En cada entorno, crear los servicios vacíos `api` y `worker` SIN conectar repositorio: el despliegue lo hace Actions para respetar el orden migrar → desplegar (D-16).
- [ ] Settings › Config-as-code: `/railway.api.json` para `api` y `/railway.worker.json` para `worker`. Si Railway no resuelve la ruta con `--path-as-root` (A4), configurar en el panel: start command `procrastinate --app app.jobs.worker.app worker` para `worker` y healthcheck `/api/v1/health` para `api`.
- [ ] Región US East (Virginia).
- [ ] Variables por entorno, en ambos servicios. No crees `APP_VERSION` a mano: la fija el pipeline en cada despliegue con `railway variables`.

| Variable | Valor |
| --- | --- |
| `APP_ENV` | `dev` o `prod` según el entorno |
| `DATABASE_URL` | la armada en H-2 (pooler, rol `lucg_api`) |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_JWKS_URL` | `https://<ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| `SUPABASE_JWT_AUDIENCE` | `authenticated` |
| `SENTRY_DSN` | DSN del proyecto `api` |
| `CORS_ORIGINS` (dev) | `https://app-dev.lucglogistics.com,https://repartidor-dev.lucglogistics.com` |
| `CORS_ORIGINS` (prod) | `https://app.lucglogistics.com,https://repartidor.lucglogistics.com` |
| `CORS_ORIGIN_REGEX` (solo dev) | `^https://lucg-(web\|driver)-[a-z0-9-]+\.vercel\.app$` (previews, Pitfall 11) |

- [ ] En el servicio `api`: Settings › Networking › Custom Domain: `api-dev.lucglogistics.com` (dev) y `api.lucglogistics.com` (prod). Anotar el CNAME y el TXT que muestra Railway.
- [ ] Project Settings › Tokens: un project token por entorno (dev y prod). Cada uno es el `RAILWAY_TOKEN` de su entorno de GitHub.

Evidencia esperada: captura de los dos entornos con sus servicios y variables (sin valores secretos visibles), y el CNAME y TXT anotados para H-6.

## H-5 Vercel (D-10, D-18)

- [ ] Verificar que el proyecto existente `lucg` (sitio) está en la cuenta de LUCG y en qué plan está (Hobby). A14: anotar el riesgo de uso comercial en Hobby aceptado por D-18.
- [ ] Reconectar Git al repositorio transferido si Vercel lo pide.
- [ ] Proyecto `lucg`: Root Directory `apps/site`, "Include files outside the root directory" activo, Production Branch `main`, variable `ENABLE_EXPERIMENTAL_COREPACK=1`, "Skip deployments when there are no changes to the root directory" activo.
- [ ] AVISO (Pitfall 4): no redesplegar Production del sitio a mano hasta que `main` reciba el monorepo (H-10).
- [ ] Crear `lucg-web` (Root `apps/web`, framework Vite, salida `dist`) y `lucg-driver` (Root `apps/driver`), ambos con Corepack activo.
- [ ] Variables de `lucg-web` y `lucg-driver`: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (valor: la clave publishable), `VITE_SENTRY_DSN` (DSN de `web` o de `driver`) y `VITE_APP_ENV`. Valores de prod en Production y valores de dev en Preview (todas las ramas).
- [ ] En los 3 proyectos: Settings › Deployment Protection › Protection Bypass for Automation → generar secreto. Cargar como `VERCEL_BYPASS_SITE`, `VERCEL_BYPASS_WEB` y `VERCEL_BYPASS_DRIVER` en GitHub (Pitfall 3).
- [ ] Account Settings › Tokens: crear `VERCEL_TOKEN` para el respaldo de A10.

Evidencia esperada: devolver al agente el Project ID de los 3 proyectos y el Team ID si existe.

## H-6 Dominios y DNS en Vercel (D-05, D-06)

- [ ] Proyecto `lucg`: dominio `lucglogistics.com` (Production) y `dev.lucglogistics.com` (Edit › Connect to an environment: Preview, Git Branch `dev`).
- [ ] Proyecto `lucg-web`: `app.lucglogistics.com` (Production) y `app-dev.lucglogistics.com` (Preview, rama `dev`).
- [ ] Proyecto `lucg-driver`: `repartidor.lucglogistics.com` y `repartidor-dev.lucglogistics.com` (misma lógica).
- [ ] Dashboard › Domains › lucglogistics.com › DNS Records: crear CNAME `api-dev` → `<x>.up.railway.app` y el TXT de verificación exactamente como lo muestra Railway. Repetir para `api` (prod).
- [ ] Comprobar: `dig +short api-dev.lucglogistics.com CNAME` y `dig +short TXT <nombre-del-txt>`.

Evidencia esperada: salida de `dig` con el CNAME y el TXT, y captura de la lista de dominios por proyecto.

## H-7 Secretos y variables de GitHub

Los secretos los carga el humano (Settings › Secrets and variables › Actions, o `gh secret set NOMBRE --env dev`). Las variables no secretas de repositorio y del entorno `dev` las puede cargar el agente con `gh variable set` (plan 11).

| Nombre | Nivel | Tipo | Origen |
| --- | --- | --- | --- |
| `API_URL_DEV`, `URL_SITE_DEV`, `URL_WEB_DEV`, `URL_DRIVER_DEV` | repositorio | variable | URLs de dev (H-6) |
| `API_URL_PROD`, `URL_SITE_PROD`, `URL_WEB_PROD`, `URL_DRIVER_PROD` | repositorio | variable | URLs de prod (H-6) |
| `SENTRY_ORG` | repositorio | variable | slug de H-3 |
| `VERCEL_TEAM_ID` | repositorio | variable | H-5 |
| `VERCEL_PROJECT_ID_SITE`, `VERCEL_PROJECT_ID_WEB`, `VERCEL_PROJECT_ID_DRIVER` | repositorio | variable | H-5 |
| `SENTRY_AUTH_TOKEN` | repositorio | secreto | H-3 |
| `VERCEL_BYPASS_SITE`, `VERCEL_BYPASS_WEB`, `VERCEL_BYPASS_DRIVER` | repositorio | secreto | H-5 |
| `VERCEL_TOKEN` | repositorio | secreto | H-5 |
| `E2E_USER_ADMIN`, `E2E_PASS_ADMIN` | repositorio | secreto | usuario admin de pruebas |
| `SUPABASE_PROJECT_REF`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | entorno `dev` | variable | H-2 |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `RAILWAY_TOKEN`, `SUPABASE_SECRET_KEY` | entorno `dev` | secreto | H-2 y H-4 |
| `SUPABASE_PROJECT_REF`, `SUPABASE_URL` | entorno `prod` | variable | H-2 |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `RAILWAY_TOKEN` | entorno `prod` | secreto | H-2 y H-4 |

- [ ] Cargar todos los secretos de la tabla.
- [ ] Avisar al agente para que cargue las variables no secretas.

Evidencia esperada: captura de la lista de nombres de secretos (sin valores) por nivel.

## H-8 Protección de ramas (D-17)

Solo se exigen checks que siempre reportan (B-1).

- [ ] `dev`: exige los checks `api` y `web`, con `enforce_admins` en true para que nadie haga push directo. La pone el agente en el plan 11 con `gh api -X PUT repos/<org>/LUCG/branches/dev/protection`. Sin revisiones obligatorias, porque `cierre-fase` fusiona con squash.
- [ ] `main`: exige PR y los checks `api`, `web` y `visual-sitio`. `visual-sitio` siempre reporta: sale verde sin comparar si el PR no toca `apps/site` ni `packages/ui`. La pone el humano (regla 9).
- [ ] `e2e-preview` NO es requerido: no puede pasar en el primer PR porque `api-dev` aún no existe.

Evidencia esperada: captura de las reglas de ambas ramas.

## H-9 Usuario admin de prod para la evidencia (D-12, D-15)

- [ ] Supabase prod › Authentication › Add user: correo de LUCG, contraseña en el gestor, auto-confirm.
- [ ] En el SQL Editor de prod:
  ```sql
  update auth.users
     set raw_app_meta_data = raw_app_meta_data || '{"org_tipo":"lucg","roles":["superadministrador"]}'::jsonb
   where email = '<correo>';
  ```
- [ ] En dev el usuario lo siembra el pipeline.

Evidencia esperada: el usuario aparece en Authentication con los metadatos de aplicación.

## H-10 Prod (D-07)

Lo ejecuta el humano. El agente no abre PR hacia `main`.

- [ ] Abrir el PR a mano: `gh pr create --base main --head dev`.
- [ ] Esperar el CI completo, incluido `visual-sitio` (D-11).
- [ ] Fusionar con **merge commit, sin squash** (W-7): así `dev` y `main` comparten historia y el siguiente PR `dev → main` no trae conflictos falsos.
- [ ] Aprobar el entorno `prod` en el workflow "Despliegue a prod".
- [ ] Comprobar `https://api.lucglogistics.com/api/v1/health`: `version` = SHA corto, `db` true, `rol_db` = `lucg_api`.
- [ ] Abrir los 3 dominios de prod: `lucglogistics.com`, `app.lucglogistics.com`, `repartidor.lucglogistics.com`.
- [ ] En Sentry, verificar errores de prueba con `environment=prod` de la API, la consola y la PWA.
- [ ] Correr el workflow "Salud diaria" con Run workflow.
- [ ] Pegar los enlaces de evidencia en `.planning/phases/00.1-arranque-t-cnico/verificacion.md`.

Evidencia esperada: enlaces al PR, al run de despliegue, al health de prod y a los eventos de Sentry.
