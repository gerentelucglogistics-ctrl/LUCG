import { expect, test } from "@playwright/test";

test("la consola carga y muestra la versión de la API", async ({ page }) => {
  await page.goto("/consola");
  await expect(page.getByRole("heading", { name: "Consola administrativa" })).toBeVisible();
  await expect(page.getByTestId("api-version")).not.toHaveText(/…/);
});
