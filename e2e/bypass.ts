import { expect, test as base } from "@playwright/test";

// Pasa la protección de Vercel con la cookie de bypass del proyecto (Pitfall 3).
// No se usa extraHTTPHeaders: la cabecera viajaría también a la API y rompería CORS.
// El secreto nunca se imprime.
export const test = base.extend<{ bypassVercel: void }>({
  bypassVercel: [
    async ({ page }, use, testInfo) => {
      const nombre = testInfo.project.metadata?.bypassEnv as string | undefined;
      const secreto = nombre ? process.env[nombre] : undefined;
      const baseURL = testInfo.project.use.baseURL;
      if (secreto && baseURL) {
        await page.goto(
          `${baseURL}/?x-vercel-protection-bypass=${encodeURIComponent(secreto)}&x-vercel-set-bypass-cookie=true`,
        );
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
