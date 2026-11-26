import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
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
