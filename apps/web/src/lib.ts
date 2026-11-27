import { createClient } from "@supabase/supabase-js";
import { crearCliente } from "@lucg/api-client";

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
export const api = crearCliente(import.meta.env.VITE_API_URL.replace(/\/api\/v1$/, ""), async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
});
