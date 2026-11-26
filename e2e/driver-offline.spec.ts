import { expect, test } from "./bypass";

// Prueba de la skill pwa-offline: instalabilidad + apertura sin red (chromium).
// La prueba real en iPhone/WebKit es de la fase 0.3.
test.describe("PWA sin conexión", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "solo chromium");

  test("manifest instalable y abre sin red", async ({ page, context }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Mi ruta de hoy" })).toBeVisible();

    // El service worker debe estar activo y controlando la página antes de cortar la red.
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    if (!(await page.evaluate(() => navigator.serviceWorker.controller !== null))) {
      await page.reload();
    }
    expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);

    // Manifest: datos mínimos de instalabilidad e íconos que responden 200.
    const respuesta = await page.request.get("/manifest.webmanifest");
    expect(respuesta.ok()).toBe(true);
    const manifest = await respuesta.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe("standalone");
    const iconos: { src: string; sizes: string; purpose?: string }[] = manifest.icons;
    const esAny = (i: { purpose?: string }) => (i.purpose ?? "any") === "any";
    expect(iconos.some((i) => i.sizes === "192x192" && esAny(i))).toBe(true);
    expect(iconos.some((i) => i.sizes === "512x512" && esAny(i))).toBe(true);
    expect(iconos.some((i) => i.purpose === "maskable")).toBe(true);
    for (const icono of iconos) {
      const r = await page.request.get(new URL(icono.src, page.url()).toString());
      expect(r.status(), icono.src).toBe(200);
    }

    // Sin red: la app abre desde el precache.
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Mi ruta de hoy" })).toBeVisible();
    await expect(page.getByTestId("estado-red")).toContainText("Sin red");
    await context.setOffline(false);
  });
});
