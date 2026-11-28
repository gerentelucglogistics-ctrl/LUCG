import fs from "node:fs";
import { ARCHIVO_SESION } from "./sesion";
import { expect, test as base } from "./bypass";

// La sesión la escribe el proyecto setup (dependencies). Se comprueba al correr la prueba, no al
// cargar el archivo: Playwright carga las specs antes de que setup escriba admin.json.
const hay = () => fs.existsSync(ARCHIVO_SESION);
const test = base.extend({
  storageState: async ({}, use) => {
    await use(hay() ? ARCHIVO_SESION : undefined);
  },
});

test("el administrador con sesión entra a la consola y la API aplica su contexto", async ({ page }) => {
  test.skip(!hay(), "sin sesión de e2e (el setup se omitió por falta de variables)");
  await page.goto("/consola");
  await expect(page.getByTestId("yo-rol-db")).toHaveText("lucg_api");
  await expect(page.getByTestId("yo-org-tipo")).toHaveText("lucg");
});
