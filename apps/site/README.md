# LUCG Logistics — sitio web

Sitio corporativo de **LUCG Logistics S.A.S** (lucglogistics.com), preparado para crecer hacia una plataforma
administrativa y logística.

## Stack

| Pieza         | Elección                                    | Por qué                                                                                   |
| ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Framework     | **Next.js 16** (App Router) + React 19 + TS | Sitio público estático y rápido hoy; APIs, autenticación y panel admin en la misma app mañana |
| Estilos       | **Tailwind CSS v4**                         | Tokens de marca centralizados en `src/app/globals.css`                                    |
| Animaciones   | **Motion** (`motion/react`)                 | Animaciones de entrada, scroll y transiciones; respeta "reducir movimiento" del sistema   |
| Íconos        | lucide-react                                | Íconos consistentes (logos de redes en `components/ui/brand-icons.tsx`)                   |
| Imágenes      | `next/image` + WebP                         | Las fotos pasaron de ~8 MB en PNG a ~1.4 MB en total                                      |

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # compilación de producción
pnpm lint
pnpm format     # Prettier + orden de clases Tailwind
```

## Estructura

```
src/
  app/
    layout.tsx            # <html>, fuentes, metadatos SEO globales
    (site)/               # sitio público (header, footer, botón WhatsApp)
      page.tsx            # inicio
      blog/               # listado + artículo por slug
    sitemap.ts, robots.ts, opengraph-image.jpg, icon.png
  components/
    site/                 # secciones: hero, services, challenges, methodology, coverage, about, contact…
    ui/                   # piezas reutilizables: Reveal, SectionHeading, ButtonLink, íconos de marca
  content/                # TEXTOS: servicios, cobertura, misión/visión, artículos del blog
  lib/site.ts             # datos de contacto, redes, NIT, enlaces de WhatsApp
brand/                    # logos originales en SVG
scripts/prepare-images.mjs  # regenera las imágenes optimizadas
```

**Para cambiar textos, teléfonos o servicios** se edita `src/content/*` o `src/lib/site.ts`; no hace falta tocar
componentes. **Para publicar un artículo** se agrega un objeto al arreglo `posts` en `src/content/posts.ts`.

Paleta: azul `#011C52` (navy-900) y naranja `#DA6106` (brand-600), tomados del logo. Para texto pequeño y botones
se usa `brand-700` (`#b44f04`) para cumplir contraste WCAG AA.

## Despliegue y dominio (GoDaddy)

Recomendado: **Vercel** (creadores de Next.js; despliegue automático con cada push a GitHub).

> ⚠️ El plan gratuito *Hobby* de Vercel es solo para uso no comercial. Para un sitio empresarial corresponde el plan
> **Pro**. Alternativa gratuita con uso comercial permitido: **Netlify** (soporta Next.js; los pasos de DNS son
> equivalentes).

1. Subir este proyecto a un repositorio de GitHub.
2. En vercel.com → **Add New Project** → importar el repositorio (detecta Next.js solo) → **Deploy**.
3. En el proyecto → **Settings → Domains** → agregar `lucglogistics.com` y `www.lucglogistics.com`.
4. En GoDaddy → **Mis productos → lucglogistics.com → DNS**:
   - Eliminar el registro `A` con nombre `@` que viene por defecto ("Parked") y cualquier *Reenvío/Forwarding*.
   - Crear `A` · nombre `@` · valor `76.76.21.21`
   - Crear/editar `CNAME` · nombre `www` · valor `cname.vercel-dns.com`
   - Si Vercel muestra valores distintos en la pantalla de Domains, usar los que muestra Vercel.
5. Esperar la propagación (minutos, máximo 48 h). Vercel emite el certificado HTTPS automáticamente.
6. Cuando el dominio funcione: redirigir o archivar el sitio viejo de GitHub Pages para no duplicar contenido en Google,
   y registrar el sitio en Google Search Console (enviar `https://lucglogistics.com/sitemap.xml`).

> **Correo corporativo:** si más adelante se configura correo con el dominio (Google Workspace, Microsoft 365 o
> GoDaddy), sus registros `MX`/`TXT` conviven con los anteriores; no se deben borrar al configurar Vercel.

## Hoja de ruta hacia la plataforma administrativa

La app ya está separada en un grupo de rutas `(site)`, así que el panel puede vivir en `src/app/(admin)/admin/...`
sin afectar el sitio público.

1. **Base de datos + autenticación:** Supabase (Postgres, Auth y almacenamiento de archivos) u otra opción equivalente.
   Proteger `/admin` con `src/proxy.ts` (en Next 16 reemplaza a `middleware.ts`).
2. **Cotizaciones como leads:** hoy el formulario abre WhatsApp con el mensaje armado. Se puede guardar además cada
   solicitud en la base de datos con una Server Action, para darle seguimiento desde el panel.
3. **Módulos logísticos:** clientes, órdenes de servicio, inventario de bodega, despachos y rastreo de envíos con un
   portal para que el cliente consulte el estado de su carga.
4. **Blog administrable:** mover `src/content/posts.ts` a la base de datos o a un CMS headless (Sanity o Payload).
