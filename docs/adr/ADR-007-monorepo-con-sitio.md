# ADR-007: Un solo repositorio; el sitio público entra como `apps/site`
**Estado:** Aceptada · **Fecha:** 2026-11-26 · **Deciden:** desarrollador principal
## Contexto
El sitio público (lucglogistics.com, Next.js 16 + Tailwind 4) ya existe en el repositorio `LUCG` de la cuenta de GitHub de LUCG,
desplegado en Vercel. La plataforma necesita la misma identidad visual y que el sitio enlace al portal y al seguimiento.
## Decisión
Se trabaja sobre el repositorio existente, convertido en monorepo: el sitio se mueve a `apps/site` (conserva historial, proyecto
de Vercel y dominio) y el kit de la plataforma se agrega alrededor. Identidad única en `packages/ui/src/tokens.css`.
El sitio sigue en Next.js (SEO, blog); consola, portal y PWA siguen en Vite. No se mezclan en una sola app.
## Opciones
Repositorio nuevo separado: aislamiento total, pero tokens y componentes duplicados y dos flujos de trabajo de GSD.
Meter la consola dentro de Next (`(admin)`): contradice ADR-002 (reglas solo en FastAPI) y complica la PWA sin conexión.
## Consecuencias
+ Un repo, un CI, una identidad, activos en la cuenta de LUCG. − Un error en el monorepo puede romper el build del sitio:
se mitiga con ADR-008 (el agente nunca toca `main`) y con Root Directory `apps/site` en el proyecto de Vercel.
