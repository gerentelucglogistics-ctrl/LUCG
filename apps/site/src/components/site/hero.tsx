"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { defaultQuoteMessage, site, whatsappUrl } from "@/lib/site";
import { pillars } from "@/content/home";

const ease = [0.22, 1, 0.36, 1] as const;

const headline = ["Logística", "que", "mueve", "tu", "empresa"];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_75%)]" />
      <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-navy-700/40 blur-3xl" />
      <div className="absolute right-0 -bottom-40 size-[28rem] rounded-full bg-brand-600/20 blur-3xl" />

      <div className="relative container-site grid gap-12 pt-32 pb-16 lg:min-h-[52rem] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:pt-36 lg:pb-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/80 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
            </span>
            Operador logístico en Urabá, Antioquia
          </motion.p>

          <h1 className="mt-6 text-[2.3rem] leading-[1.02] font-extrabold min-[400px]:text-[2.6rem] sm:text-6xl lg:text-7xl">
            <span className="sr-only">Logística que mueve tu empresa hacia adelante</span>
            <span aria-hidden="true">
              {headline.map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.25em] inline-block"
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease }}
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                className="relative inline-block text-brand-500"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease }}
              >
                hacia adelante
                <svg
                  viewBox="0 0 300 20"
                  className="absolute -bottom-3 left-0 h-4 w-full text-brand-500"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 14 C 80 4, 200 4, 298 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 1, ease }}
                  />
                </svg>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Soluciones integrales en almacenamiento, transporte y distribución. Conectamos Urabá con Colombia y el mundo
            con más control, más seguridad y mejores resultados.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href={whatsappUrl(defaultQuoteMessage)}>
              <WhatsAppIcon className="size-5" />
              Cotizar por WhatsApp
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={`tel:${site.phone}`} variant="ghost">
              <Phone className="size-4" />
              Llamar ahora
            </ButtonLink>
          </motion.div>
        </div>

        <HeroVisual />
      </div>

      <PillarsBar />
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ x: 40 }}
      animate={{ x: 0 }}
      transition={{ duration: 1, delay: 0.1, ease }}
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
    >
      {/* Franja naranja en diagonal, eco del estilo gráfico de la marca */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 bg-brand-600 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
      <div className="relative aspect-[4/4.2] overflow-hidden bg-navy-800 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:aspect-[4/4.6]">
        <Image
          src="/img/hero-operario.webp"
          alt="Operario de LUCG Logistics en bodega"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
      </div>

      <TrackingCard />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4, ease }}
        className="absolute top-6 -right-2 flex animate-float items-center gap-3 rounded-2xl bg-white px-4 py-3 text-navy-900 shadow-2xl sm:right-4"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-brand-100 text-brand-600">
          <ShieldCheck className="size-5" />
        </span>
        <div className="text-left">
          <p className="text-sm font-bold">Carga protegida</p>
          <p className="text-xs text-muted">Control en cada etapa</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrackingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.1, ease }}
      className="absolute -bottom-6 left-0 w-[17rem] rounded-2xl border border-white/10 bg-navy-900/85 p-4 shadow-2xl backdrop-blur-xl sm:-left-6 sm:w-80"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-white/60">Envío LUCG-2026-0412</span>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-300">En ruta</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4 text-brand-400" /> Apartadó
        </span>
        <span className="flex items-center gap-1.5">
          Cartagena <MapPin className="size-4 text-white/50" />
        </span>
      </div>
      <div className="relative mt-3 h-6">
        <svg viewBox="0 0 300 24" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line
            x1="4"
            y1="12"
            x2="296"
            y2="12"
            stroke="rgb(255 255 255 / 0.15)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <motion.line
            x1="4"
            y1="12"
            x2="296"
            y2="12"
            stroke="var(--color-brand-500)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.68 }}
            transition={{ duration: 2.2, delay: 1.5, ease }}
          />
        </svg>
        <motion.span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-navy-900 bg-brand-500 shadow-[0_0_0_4px_rgb(240_116_18/0.3)]"
          initial={{ left: "1%" }}
          animate={{ left: "68%" }}
          transition={{ duration: 2.2, delay: 1.5, ease }}
        />
      </div>
      <p className="mt-2 text-xs text-white/50">Trazabilidad en tiempo real · ETA 14:30</p>
    </motion.div>
  );
}

function PillarsBar() {
  return (
    <div className="relative border-t border-white/10 bg-navy-900/60 backdrop-blur">
      <div className="container-site grid grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className={`group flex min-w-0 items-center gap-3 py-5 sm:gap-4 sm:py-8 ${
              i % 2 === 1 ? "pl-4 sm:pl-8" : ""
            } ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""} ${i < 2 ? "border-b border-white/10 lg:border-b-0" : ""}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/15 text-brand-400 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:size-12">
              <p.icon className="size-6" />
            </span>
            <div>
              <p className="font-display text-xs font-bold tracking-wider uppercase sm:text-sm">{p.title}</p>
              <p className="mt-0.5 hidden text-sm text-white/60 sm:block">{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
