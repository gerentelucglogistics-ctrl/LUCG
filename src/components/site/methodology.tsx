"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { methodology } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";

export function Methodology() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="metodologia" className="relative overflow-hidden bg-navy-900 py-24 text-white lg:py-32">
      <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative container-site">
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow="Cómo trabajamos"
          title={
            <>
              Una metodología <span className="text-brand-500">operativa</span> probada
            </>
          }
          text="Procesos estratégicos para garantizar control, cumplimiento y mejora continua en cada operación."
        />

        <div ref={ref} className="relative mt-16 lg:mt-20">
          {/* Línea de progreso: vertical en móvil, horizontal en escritorio */}
          <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-white/10 lg:top-7 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-0.5 lg:w-auto">
            <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-brand-500 lg:hidden" />
            <motion.div
              style={{ scaleX: progress }}
              className="hidden h-full w-full origin-left bg-brand-500 lg:block"
            />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {methodology.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center"
              >
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-brand-500/50 bg-navy-900 text-brand-400 shadow-[0_0_0_8px_var(--color-navy-900)]">
                  <step.icon className="size-6" />
                  <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-lg font-bold lg:mt-6">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
