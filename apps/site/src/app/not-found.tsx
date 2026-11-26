import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main className="grid min-h-[80vh] flex-1 place-items-center bg-navy-950 bg-grid px-5 pt-24 text-center text-white">
        <div>
          <p className="font-display text-8xl font-extrabold text-brand-500">404</p>
          <h1 className="mt-4 text-3xl font-extrabold">Esta ruta no está en nuestro mapa</h1>
          <p className="mt-3 text-white/70">La página que buscas no existe o fue movida.</p>
          <ButtonLink href="/" className="mt-8">
            Volver al inicio
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </MotionConfig>
  );
}
