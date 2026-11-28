import fs from "node:fs";
import { ARCHIVO_SESION } from "./sesion";
import { expect, test } from "./bypass";

test.skip(!fs.existsSync(ARCHIVO_SESION), "sin sesión de e2e (el setup se omitió)");
test.use({ storageState: ARCHIVO_SESION });

test("el administrador con sesión entra a la consola y la API aplica su contexto", async ({ page }) => {
  await page.goto("/consola");
  await expect(page.getByTestId("yo-rol-db")).toHaveText("lucg_api");
  await expect(page.getByTestId("yo-org-tipo")).toHaveText("lucg");
});
