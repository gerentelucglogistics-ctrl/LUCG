import { expect, test } from "@playwright/test";

// Falla a propósito para imitar un reporte de fallo; el secreto falso queda en el título del paso.
test("planta", async () => {
  await test.step(`Fill ${process.env.E2E_PASS_FALSO ?? ""}`, async () => {});
  expect(1).toBe(2);
});
