import { expect, request as pwRequest, test as base } from "@playwright/test";

// Pasa la protección de Vercel con la cookie de bypass del proyecto (Pitfall 3).
// No se usa extraHTTPHeaders global: la cabecera viajaría también a la API y rompería CORS.
// El secreto solo va como cabecera hacia el host de Vercel, nunca en una URL ni en una
// acción de página (así no queda en pasos, trazas ni reportes). El secreto nunca se imprime.
export async function cookiesDeBypass(baseURL: string, secreto: string) {
  const rc = await pwRequest.newContext({
    baseURL,
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": secreto,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
  try {
    await rc.get("/");
    const { cookies } = await rc.storageState();
    if (cookies.length === 0) throw new Error("Vercel no devolvió la cookie de bypass");
    return cookies;
  } finally {
    await rc.dispose();
  }
}

export const test = base.extend<{ bypassVercel: void }>({
  bypassVercel: [
    async ({ context }, use, testInfo) => {
      const nombre = testInfo.project.metadata?.bypassEnv as string | undefined;
      const secreto = nombre ? process.env[nombre] : undefined;
      const baseURL = testInfo.project.use.baseURL;
      if (secreto && baseURL) {
        await context.addCookies(await cookiesDeBypass(baseURL, secreto));
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
