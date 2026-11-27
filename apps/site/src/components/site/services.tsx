"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { whatsappUrl } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId)!;

  return (
    <section id="servicios" className="bg-paper py-24 lg:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Nuestros servicios"
            title={
              <>
                Soluciones para cada <span className="text-brand-600">eslabón</span> de tu cadena
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-md text-muted lg:pb-2">
            Integramos almacenamiento, transporte y distribución en una sola operación, para que tengas un único aliado
            responsable de tu carga de principio a fin.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[20rem_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Servicios"
            onKeyDown={(e) => {
              const idx = services.findIndex((s) => s.id === activeId);
              const target = {
                ArrowDown: idx + 1,
                ArrowRight: idx + 1,
                ArrowUp: idx - 1,
                ArrowLeft: idx - 1,
                Home: 0,
                End: services.length - 1,
              }[e.key];
              if (target === undefined) return;
              e.preventDefault();
              const next = services[(target + services.length) % services.length];
              setActiveId(next.id);
              document.getElementById(`tab-${next.id}`)?.focus();
            }}
            className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {services.map((s, i) => {
              const selected = s.id === activeId;
              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={selected ? `panel-${s.id}` : undefined}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(s.id)}
                  className={`relative flex min-w-[15rem] snap-start items-center gap-4 rounded-2xl p-4 text-left transition-colors duration-300 lg:min-w-0 lg:p-5 ${
                    selected ? "text-white" : "bg-white text-navy-900 hover:bg-navy-50"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="service-tab"
                      className="absolute inset-0 rounded-2xl bg-navy-900 shadow-xl shadow-navy-900/20"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                  <span
                    className={`relative grid size-12 shrink-0 place-items-center rounded-xl transition-colors ${
                      selected ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-600"
                    }`}
                  >
                    <s.icon className="size-6" />
                  </span>
                  <span className="relative">
                    <span className={`block text-xs font-semibold ${selected ? "text-white/60" : "text-muted"}`}>
                      0{i + 1} · {s.kicker}
                    </span>
                    <span className="mt-0.5 block font-display font-bold">{s.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[36rem] overflow-hidden rounded-3xl bg-white shadow-xl shadow-navy-900/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`panel-${active.id}`}
                aria-labelledby={`tab-${active.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid h-full md:grid-cols-[1fr_16rem] xl:grid-cols-[1fr_20rem]"
              >
                <div className="order-2 p-6 sm:p-10 md:order-1">
                  <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="text-2xl font-extrabold text-navy-900 sm:text-3xl"
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease }}
                    className="mt-4 leading-relaxed text-muted"
                  >
                    {active.summary}
                  </motion.p>
                  <ul className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    {active.capabilities.map((c, i) => (
                      <motion.li
                        key={c.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease }}
                        className="flex gap-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800">
                          <c.icon className="size-[18px]" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-navy-900">{c.title}</span>
                          <span className="mt-0.5 block text-sm text-muted">{c.text}</span>
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  <a
                    href={whatsappUrl(
                      `Hola LUCG Logistics, quiero cotizar el servicio de ${active.title.toLowerCase()}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-10 inline-flex items-center gap-2 font-bold text-brand-700"
                  >
                    Cotizar {active.kicker.toLowerCase()}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease }}
                  className="relative order-1 h-56 md:order-2 md:h-auto"
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="(min-width: 768px) 20rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-y-0 left-0 hidden w-1.5 bg-brand-600 md:block" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
