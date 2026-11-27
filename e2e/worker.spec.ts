import { expect, test } from "./bypass";

const usuario = process.env.E2E_USER_ADMIN;
const clave = process.env.E2E_PASS_ADMIN;
const api = process.env.BASE_URL_API;
const supabaseUrl = process.env.E2E_SUPABASE_URL;
const apikey = process.env.E2E_SUPABASE_PUBLISHABLE_KEY;

test.skip(
  !usuario || !clave || !api || !supabaseUrl || !apikey,
  "faltan variables de e2e (usuario, API o Supabase)",
);

test("el worker procesa el job de prueba (ping)", async ({ request }) => {
  const login = await request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    headers: { apikey: apikey! },
    data: { email: usuario, password: clave },
  });
  expect(login.ok()).toBeTruthy();
  const { access_token: token } = await login.json();
  const auth = { Authorization: `Bearer ${token}` };

  const ping = await request.post(`${api}/api/v1/diagnostico/ping`, { headers: auth });
  expect(ping.ok()).toBeTruthy();
  const { job_id: jobId } = await ping.json();

  await expect
    .poll(
      async () => {
        const r = await request.get(`${api}/api/v1/diagnostico/jobs/${jobId}`, { headers: auth });
        return (await r.json()).estado;
      },
      { timeout: 60_000, intervals: [1000, 2000, 5000] },
    )
    .toBe("succeeded");
});

test("sin token la API responde 401", async ({ request }) => {
  const r = await request.post(`${api}/api/v1/diagnostico/ping`);
  expect(r.status()).toBe(401);
});
