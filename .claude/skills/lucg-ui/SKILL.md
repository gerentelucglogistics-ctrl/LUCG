---
name: lucg-ui
description: Identidad visual y convenciones de interfaz del sitio público, consola, portal y PWA: tokens de marca, tipografías, componentes compartidos, tamaños táctiles, estados de pantalla, textos en español operativo. Cárgala junto con frontend-design antes de crear o cambiar pantallas.
---

# Interfaz LUCG

## Identidad (una sola para sitio público, consola, portal y PWA)
- Fuente única: `packages/ui/src/tokens.css` (Tailwind 4 `@theme`). Cada app hace `@import "tailwindcss"; @import "@lucg/ui/tokens.css";`.
  Un cambio de marca se hace solo ahí y lo heredan las cuatro interfaces. El sitio público (`apps/site`) se adapta a estos tokens, no al revés.
- Paleta del logo: azul `navy-900` (#011C52) y naranja `brand-600` (#DA6106). Texto pequeño y botones sobre blanco: `brand-700` (AA).
  Neutros: `ink`, `muted`, `line`, `paper`. Estados: `estado-ok`, `estado-alerta`, `estado-error`, `estado-info` (+ `-fondo`). Nunca hex sueltos.
- Tipografías: Inter (texto) y Montserrat 600–800 (títulos, `font-display`). En `apps/site` vía `next/font`; en las apps Vite, auto-alojadas (fase 0.1).
- Logos originales en `brand/` (SVG). No redibujar ni recolorear el logo.
- Tono visual: sobrio y operativo. Fondos oscuros `navy-900/950` con retícula sutil solo en cabeceras del sitio; la consola y la PWA son claras.
- Prototipos y decisiones de diseño de la fase 0.3 se reflejan en `tokens.css` y en esta skill el mismo día.

## Convenciones
- Componentes desde `packages/ui` (shadcn/ui + Tailwind). No crear botones o inputs sueltos en las apps.
- Textos en español de Colombia, operativos y cortos: "Confirmar entrega", "Reportar novedad", "Escanear bulto".
  Términos del dominio exactos (ver `lucg-dominio`). Sin tecnicismos ("sincronizar" sí; "idempotente" no).
- PWA: objetivos táctiles ≥ 44×44 px; una acción principal por pantalla; flujo de entrega en ≤ 4 toques sin contar
  fotos; contraste AA para sol directo; zonas seguras de iOS (`env(safe-area-inset-*)`); sin hover como único estado.
- Estados obligatorios en toda lista o formulario: cargando, vacío con instrucción, error con reintento, sin conexión.
- Consola: tablas con filtros persistentes, acciones en lote por escaneo, confirmaciones con motivo en acciones sensibles.
- Plazos: semáforo `estado-ok` / `estado-alerta` / `estado-error` siempre acompañado de fecha límite y tiempo restante (nunca solo color).
- Fechas en America/Bogota con formato `d MMM yyyy, HH:mm`; cifras en pesos con separador de miles.
- Iconografía Lucide. Accesibilidad: etiquetas en inputs, foco visible, lectores de pantalla en botones de icono.
- Sitio público (`apps/site`, Next.js 16): leer `apps/site/AGENTS.md` antes de tocarlo; textos en `src/content/*` y `src/lib/site.ts`.
