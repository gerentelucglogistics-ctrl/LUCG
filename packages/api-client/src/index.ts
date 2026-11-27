import createClient from "openapi-fetch";
import type { paths } from "./schema";

/** Cliente tipado. `getToken` devuelve el access token de Supabase Auth del usuario. */
export function crearCliente(baseUrl: string, getToken: () => Promise<string | null>) {
  const client = createClient<paths>({ baseUrl });
  client.use({
    async onRequest({ request }) {
      const t = await getToken();
      if (t) request.headers.set("Authorization", `Bearer ${t}`);
      return request;
    },
  });
  return client;
}
export type { paths };
