import { defineConfig, devices } from "@playwright/test";

const web = process.env.BASE_URL_WEB ?? "http://localhost:5173";
const driver = process.env.BASE_URL_DRIVER ?? "http://localhost:5174";

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: { trace: "retain-on-failure", screenshot: "only-on-failure", locale: "es-CO", timezoneId: "America/Bogota" },
  projects: [
    { name: "local", use: { ...devices["Desktop Chrome"], baseURL: web }, metadata: { driver } },
    { name: "local-driver", use: { ...devices["Pixel 7"], baseURL: driver, permissions: ["camera", "geolocation"], geolocation: { latitude: 7.8839, longitude: -76.6273 } } },
    { name: "preview", use: { ...devices["Desktop Chrome"], baseURL: web } },
    { name: "dev", use: { ...devices["Desktop Chrome"], baseURL: web } },
    { name: "dev-driver", use: { ...devices["iPhone 14"], baseURL: driver, permissions: ["camera", "geolocation"] } },
  ],
});
