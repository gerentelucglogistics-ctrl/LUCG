import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const entrar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
      if (error) throw error;
    },
    onSuccess: () => navigate("/consola"),
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    entrar.mutate();
  }

  const error = entrar.error as { code?: string; status?: number } | null;
  const credencialesMalas = error?.code === "invalid_credentials" || error?.status === 400;

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Iniciar sesión</h1>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Correo
          <input
            type="email"
            autoComplete="username"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="h-11 rounded border border-line px-3 text-base focus-visible:outline-2 focus-visible:outline-navy-700"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="h-11 rounded border border-line px-3 text-base focus-visible:outline-2 focus-visible:outline-navy-700"
          />
        </label>
        <button
          type="submit"
          disabled={entrar.isPending}
          className="h-11 rounded bg-brand-700 px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-navy-700 disabled:opacity-60"
        >
          {entrar.isPending ? "Entrando…" : "Entrar"}
        </button>
        {entrar.isError && (
          <p role="alert" className="rounded bg-estado-error-fondo p-3 text-sm text-estado-error">
            {credencialesMalas ? "Correo o contraseña incorrectos" : "No pudimos iniciar sesión. Intenta de nuevo."}
          </p>
        )}
      </form>
    </main>
  );
}
