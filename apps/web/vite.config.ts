import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.APP_VERSION ?? "dev"),
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // El seguimiento público (/t/:guia) va en su propio chunk para no cargar la consola.
        manualChunks: { tracking: ["./src/tracking/Tracking.tsx"] },
      },
    },
  },
});
