import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Genera los íconos de la PWA desde el logo de marca (no se redibuja ni recolorea).
// Uso: pnpm --filter @lucg/driver generar-iconos
export default defineConfig({
  preset: minimal2023Preset,
  images: ["public/icons/logo.svg"],
});
