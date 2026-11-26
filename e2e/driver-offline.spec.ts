import { expect, test } from "@playwright/test";

// Esqueleto de la prueba de la skill pwa-offline. Se completa en la fase 3.5.
test.describe("PWA sin conexión", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "solo chromium");
  test("abre sin red y muestra pendientes", async ({ page, context }) => {
    const base = process.env.BASE_URL_DRIVER ?? "http://localhost:5174";
    await page.goto(base);
    await expect(page.getByRole("heading", { name: "Mi ruta de hoy" })).toBeVisible();
    await context.setOffline(true);
    await page.reload().catch(() => undefined);
    await expect(page.getByTestId("estado-red")).toContainText("Sin red");
    await context.setOffline(false);
  });
});
