import { useQuery } from "@tanstack/react-query";
import { api } from "../lib";

export default function Consola() {
  const salud = useQuery({ queryKey: ["health"], queryFn: async () => (await api.GET("/api/v1/health")).data });
  return (
    <main style={{ padding: 24 }}>
      <h1>Consola administrativa</h1>
      <p data-testid="api-version">API: {salud.data ? `${salud.data.status} · ${salud.data.version}` : "…"}</p>
    </main>
  );
}
