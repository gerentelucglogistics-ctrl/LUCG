import { defineConfig } from "@playwright/test";

// Genera un reporte HTML real con un secreto falso en el título de un paso, para probar
// la compuerta (D-09). No abre navegador.
export default defineConfig({
  testDir: ".",
  testMatch: /planta\.spec\.ts/,
  reporter: [["html", { outputFolder: process.env.PLANTA_SALIDA ?? "planta-report", open: "never" }]],
  use: { trace: "off" },
});
