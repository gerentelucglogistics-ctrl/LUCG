import { defineConfig, devices } from "@playwright/test";

const web = process.env.BASE_URL_WEB ?? "http://localhost:5173";
const driver = process.env.BASE_URL_DRIVER ?? "http://localhost:5174";

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  expect: {
    // Ruta compartida sin {projectName}: sitio-preview compara contra la línea base de sitio-prod.
    toHaveScreenshot: {
      pathTemplate: "{testDir}/__visual__/{testFilePath}/{arg}{ext}",
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },
  use: { trace: "off", video: "off", screenshot: "only-on-failure", locale: "es-CO", timezoneId: "America/Bogota" },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: web },
      metadata: { bypassEnv: "VERCEL_BYPASS_WEB" },
    },
    {
      name: "local",
      dependencies: ["setup"],
      testMatch: [/smoke/, /login/, /worker/, /consola-sesion/],
      use: { ...devices["Desktop Chrome"], baseURL: web },
      metadata: { driver },
    },
    {
      name: "local-driver",
      testMatch: /driver-offline/,
      use: { ...devices["Pixel 7"], baseURL: driver, permissions: ["camera", "geolocation"], geolocation: { latitude: 7.8839, longitude: -76.6273 } },
    },
    {
      name: "preview",
      dependencies: ["setup"],
      testMatch: [/smoke/, /login/, /consola-sesion/],
      use: { ...devices["Desktop Chrome"], baseURL: web },
      metadata: { bypassEnv: "VERCEL_BYPASS_WEB" },
    },
    {
      name: "dev",
      dependencies: ["setup"],
      testMatch: [/smoke/, /login/, /worker/, /consola-sesion/],
      use: { ...devices["Desktop Chrome"], baseURL: web },
      metadata: { bypassEnv: "VERCEL_BYPASS_WEB" },
    },
    {
      // chromium: D-13 se prueba en chromium; la prueba real en iPhone es de la fase 0.3.
      name: "dev-driver",
      testMatch: /driver-offline/,
      use: { ...devices["Pixel 7"], baseURL: driver, permissions: ["camera", "geolocation"] },
      metadata: { bypassEnv: "VERCEL_BYPASS_DRIVER" },
    },
    {
      // Línea base visual: sitio público en producción (solo lectura, sin secreto).
      name: "sitio-prod",
      testMatch: /sitio-visual/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL_SITE_PROD ?? "https://lucglogistics.com",
        contextOptions: { reducedMotion: "reduce" },
      },
    },
    {
      name: "sitio-preview",
      testMatch: /sitio-visual/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL_SITE_PREVIEW ?? "http://localhost:3000",
        contextOptions: { reducedMotion: "reduce" },
      },
      metadata: { bypassEnv: "VERCEL_BYPASS_SITE" },
    },
  ],
});
