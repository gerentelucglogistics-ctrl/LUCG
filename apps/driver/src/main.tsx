import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { db } from "./db";
import "./index.css";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment: import.meta.env.VITE_APP_ENV, release: __APP_VERSION__ });
}
navigator.storage?.persist?.();

function App() {
  const [pendientes, setPendientes] = React.useState(0);
  const [online, setOnline] = React.useState(navigator.onLine);
  React.useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    db.eventos_pendientes.where("estado").equals("pendiente").count().then(setPendientes);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return (
    <main style={{ padding: 16, paddingTop: "max(16px, env(safe-area-inset-top))" }}>
      <h1>Mi ruta de hoy</h1>
      <p data-testid="estado-red">{online ? "Con red" : "Sin red"} · pendientes de sincronizar: <span data-testid="pendientes">{pendientes}</span></p>
      <p>Fase 3.2: descarga de ruta, escaneo y entrega.</p>
    </main>
  );
}

// Ruta de diagnóstico (D-15): error de prueba solo de cliente hacia Sentry; no llama a la API.
function Diagnostico() {
  const [enviado, setEnviado] = React.useState<string | null>(null);
  const enviar = () => {
    if (!window.confirm("¿Enviar un error de prueba a Sentry?")) return;
    if (!import.meta.env.VITE_SENTRY_DSN) {
      setEnviado("Sentry no está configurado");
      return;
    }
    Sentry.captureException(new Error("Error de prueba Sentry (PWA)"));
    setEnviado("Error enviado");
  };
  return (
    <main style={{ padding: 16, paddingTop: "max(16px, env(safe-area-inset-top))" }}>
      <h1>Diagnóstico</h1>
      <button type="button" onClick={enviar} style={{ minHeight: 44, minWidth: 44, padding: "0 16px" }}>
        Enviar error de prueba
      </button>
      {enviado && <p role="status">{enviado}</p>}
    </main>
  );
}

const Raiz = location.pathname === "/diagnostico" ? Diagnostico : App;
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><Raiz /></React.StrictMode>);
