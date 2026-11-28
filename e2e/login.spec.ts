import { expect, test } from "./bypass";

const usuario = process.env.E2E_USER_ADMIN;
const clave = process.env.E2E_PASS_ADMIN;

test("el administrador entra y la API aplica su contexto", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "local", "el formulario con la clave real solo se llena en local (D-10)");
  test.skip(!usuario || !clave, "sin credenciales de e2e");
  await page.goto("/login");
  await page.getByLabel("Correo").fill(usuario!);
  await page.getByLabel("Contraseña").fill(clave!);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/consola/);
  await expect(page.getByTestId("yo-rol-db")).toHaveText("lucg_api");
  await expect(page.getByTestId("yo-org-tipo")).toHaveText("lucg");
});

test("credenciales malas muestran error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Correo").fill("nadie@example.invalid");
  await page.getByLabel("Contraseña").fill("clave-inventada-e2e-0000");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});
