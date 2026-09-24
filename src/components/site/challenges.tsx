"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { challenges, results } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Challenges() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-site grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Retos que resolvemos"
            title={
              <>
                Menos pérdidas de <span className="text-brand-600">tiempo, dinero y control</span>
              </>
            }
            text="Muchas empresas enfrentan fallas en su operación logística que impactan su productividad y competitividad. Estos son los problemas que eliminamos."
          />
          <ol className="mt-10 border-t border-line">
            {challenges.map((c, i) => (
              <motion.li
                key={c}
                initial="idle"
                whileInView="solved"
                viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                className="flex items-center gap-4 border-b border-line py-4"
              >
                <span className="w-7 font-display text-sm font-bold text-brand-700">0{i + 1}</span>
                <span className="flex-1">
                  <motion.span
                    variants={{ idle: { color: "#55607a" }, solved: { color: "#011c52" } }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="relative font-semibold"
                  >
                    {c}
                    <motion.span
                      aria-hidden="true"
                      variants={{ idle: { scaleX: 0 }, solved: { scaleX: 1 } }}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-1/2 left-0 h-px w-full origin-left bg-navy-900/40"
                    />
                  </motion.span>
                </span>
                <motion.span
                  variants={{ idle: { scale: 0, opacity: 0 }, solved: { scale: 1, opacity: 1 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.55 }}
                  className="grid size-7 place-items-center rounded-full bg-brand-600 text-white"
                >
                  <Check className="size-4" strokeWidth={3} />
                  <span className="sr-only">Resuelto</span>
                </motion.span>
              </motion.li>
            ))}
          </ol>
        </div>

        <div>
          <div className="rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">Resultados</p>
            <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">Lo que logras con LUCG Logistics</h3>
            <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
              {results.map((r) => (
                <RevealItem
                  key={r.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-brand-500/50 hover:bg-white/[0.06]"
                >
                  <span className="grid size-11 place-items-center rounded-xl border border-brand-500/40 text-brand-400 transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <r.icon className="size-5" />
                  </span>
                  <p className="mt-4 font-display font-bold">{r.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{r.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-8 border-t border-white/10 pt-6 text-white/70">
              Nuestro compromiso es <span className="font-semibold text-brand-400">impulsar tu operación</span> para que
              alcances mejores resultados todos los días.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
