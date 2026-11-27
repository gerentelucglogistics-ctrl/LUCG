import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as Sentry from "@sentry/react";
import "./index.css";

const Consola = React.lazy(() => import("./consola/Consola"));
const Portal = React.lazy(() => import("./portal/Portal"));
const Tracking = React.lazy(() => import("./tracking/Tracking"));
const Login = React.lazy(() => import("./Login"));

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment: import.meta.env.VITE_APP_ENV, release: __APP_VERSION__ });
}

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/consola/*", element: <Consola /> },
  { path: "/portal/*", element: <Portal /> },
  { path: "/t/:guia", element: <Tracking /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <React.Suspense fallback={<p>Cargando…</p>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
);
