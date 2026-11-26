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
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
