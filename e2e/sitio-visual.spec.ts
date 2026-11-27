import { expect, test } from "./bypass";

// D-11: el sitio con tokens únicos debe verse igual que producción.
// sitio-prod genera la línea base; sitio-preview la compara (misma ruta de captura).
const paginas = [
  { ruta: "/", captura: "inicio.png" },
  { ruta: "/blog", captura: "blog.png" },
  { ruta: "/blog/recomendaciones-logistica-de-calidad", captura: "post.png" },
  { ruta: "/ruta-que-no-existe", captura: "no-encontrada.png" },
];

for (const { ruta, captura } of paginas) {
  test(`el sitio se ve igual en ${ruta}`, async ({ page }) => {
    await page.goto(ruta, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(captura, {
      fullPage: true,
      mask: [page.locator('a[href*="wa.me"]')],
    });
  });
}
