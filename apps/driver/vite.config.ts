import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.APP_VERSION ?? "dev") },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "LUCG Repartidor",
        short_name: "LUCG",
        description: "App del repartidor de LUCG LOGISTICS",
        lang: "es-CO",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#011c52",
        icons: [
          { src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ["**/*.{js,css,html,png,svg,ico,webmanifest}"],
        runtimeCaching: [
          { urlPattern: ({ url }) => url.pathname.startsWith("/api/"), handler: "NetworkFirst", options: { cacheName: "api", networkTimeoutSeconds: 8 } },
        ],
      },
    }),
  ],
});
