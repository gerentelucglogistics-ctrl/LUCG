import fs from "node:fs";
import { test as setup } from "@playwright/test";
import { cookiesDeBypass } from "./bypass";
import { ARCHIVO_SESION } from "./sesion";

// Obtiene la sesión de Supabase por API (nunca llenando el formulario) y la guarda como
// storageState. Nada de lo que contiene se imprime: ni sesión, ni clave, ni correo.
setup("sesión de administrador por API", async ({ request }, testInfo) => {
  const email = process.env.E2E_USER_ADMIN;
  const password = process.env.E2E_PASS_ADMIN;
  const supabaseUrl = process.env.E2E_SUPABASE_URL;
  const apikey = process.env.E2E_SUPABASE_PUBLISHABLE_KEY;
  const faltan = !email || !password || !supabaseUrl || !apikey;
  if (faltan) fs.rmSync(ARCHIVO_SESION, { force: true });
  setup.skip(faltan, "faltan variables de e2e (usuario o Supabase)");

  const r = await request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    headers: { apikey: apikey! },
    data: { email, password },
  });
  if (!r.ok()) throw new Error(`login por API: HTTP ${r.status()}`);
  const sesion = await r.json();
  sesion.expires_at ??= Math.floor(Date.now() / 1000) + sesion.expires_in;

  const baseURL = testInfo.project.use.baseURL!;
  const nombre = testInfo.project.metadata?.bypassEnv as string | undefined;
  const secreto = nombre ? process.env[nombre] : undefined;
  const cookies = secreto ? await cookiesDeBypass(baseURL, secreto) : [];

  const clave = `sb-${new URL(supabaseUrl!).hostname.split(".")[0]}-auth-token`;
  fs.mkdirSync("playwright/.auth", { recursive: true });
  fs.writeFileSync(
    ARCHIVO_SESION,
    JSON.stringify({
      cookies,
      origins: [
        { origin: new URL(baseURL).origin, localStorage: [{ name: clave, value: JSON.stringify(sesion) }] },
      ],
    }),
    { mode: 0o600 },
  );
});
