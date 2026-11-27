import * as Sentry from "@sentry/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, supabase } from "../lib";

const boton =
  "h-11 rounded border border-line px-4 text-sm font-semibold text-navy-900 focus-visible:outline-2 focus-visible:outline-navy-700";

export default function Consola() {
  const salud = useQuery({ queryKey: ["health"], queryFn: async () => (await api.GET("/api/v1/health")).data });
  const [conSesion, setConSesion] = useState<boolean | null>(null);
  const [estado, setEstado] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConSesion(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => setConSesion(!!sesion));
    return () => data.subscription.unsubscribe();
  }, []);

  const yo = useQuery({
    queryKey: ["yo"],
    enabled: conSesion === true,
    queryFn: async () => {
      const r = await api.GET("/api/v1/yo");
      if (!r.data) throw new Error("No se pudo cargar tu perfil");
      return r.data;
    },
  });

  async function errorApi() {
    if (!window.confirm("Se enviará un error de prueba desde la API a Sentry. ¿Continuar?")) return;
    try {
      const r = await api.POST("/api/v1/diagnostico/error");
      const codigo = r.response.status;
      setEstado(codigo === 401 || codigo === 403 ? "Sin permiso" : "Error de prueba enviado a la API");
    } catch {
      // Un 500 no manejado sale sin cabeceras CORS: el navegador rechaza la promesa; el error sí llegó a la API.
      setEstado("Error de prueba enviado a la API");
    }
  }

  function errorConsola() {
    if (!window.confirm("Se enviará un error de prueba de la consola a Sentry. ¿Continuar?")) return;
    Sentry.captureException(new Error("Error de prueba Sentry (consola)"));
    setEstado("Error de prueba enviado desde la consola");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Consola administrativa</h1>
      <p data-testid="api-version" className="mb-6 text-sm text-muted">
        API: {salud.data ? `${salud.data.status} · ${salud.data.version}` : "…"}
      </p>

      {conSesion === false && (
        <Link to="/login" className="font-semibold text-brand-700 underline">
          Iniciar sesión
        </Link>
      )}

      {conSesion && (
        <section className="flex flex-col gap-4">
          {yo.isPending && <p>Cargando…</p>}
          {yo.isError && (
            <p role="alert" className="text-estado-error">
              No pudimos cargar tu perfil.{" "}
              <button type="button" onClick={() => yo.refetch()} className="font-semibold underline">
                Reintentar
              </button>
            </p>
          )}
          {yo.data && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted">Usuario</dt>
              <dd data-testid="yo-usuario">{yo.data.usuario}</dd>
              <dt className="text-muted">Rol de base</dt>
              <dd data-testid="yo-rol-db">{yo.data.rol_db}</dd>
              <dt className="text-muted">Tipo de organización</dt>
              <dd data-testid="yo-org-tipo">{yo.data.org_tipo}</dd>
            </dl>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" className={boton} onClick={errorApi}>
              Enviar error de prueba (API)
            </button>
            <button type="button" className={boton} onClick={errorConsola}>
              Enviar error de prueba (consola)
            </button>
            <button type="button" className={boton} onClick={() => supabase.auth.signOut()}>
              Salir
            </button>
          </div>
          {estado && (
            <p role="status" className="text-sm text-estado-info">
              {estado}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
