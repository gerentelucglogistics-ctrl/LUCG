"use client";

import { motion } from "motion/react";
import { coverage } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

// Contorno simplificado de Colombia (proyección lineal lon/lat → viewBox 400×500)
const COLOMBIA =
  "M65.8 120.1 L80 123.5 L84.6 138.1 L100 113.4 L120 97.4 L121.5 69.8 L143.1 50.9 L163.1 43.6 L190.8 43.6 L221.5 27.6 L240 10.2 L258.5 20.3 L250.8 34.9 L224.6 49.4 L203.1 78.5 L200 104.7 L212.3 127.9 L218.5 157 L258.5 168.6 L310.8 194.8 L360 191.9 L369.2 218 L360 244.2 L375.4 273.3 L360 290.7 L381.5 337.2 L298.5 340.1 L313.8 360.5 L292.3 375 L304.6 401.2 L295.4 494.2 L270.8 482.6 L230.8 441.9 L196.9 441.9 L163.1 398.3 L129.2 375 L95.4 360.5 L64.6 348.8 L18.5 331.4 L21.5 316.9 L49.2 296.5 L67.7 258.7 L61.5 232.6 L64.6 180.2 L49.2 162.8 Z";

const HUB = { x: 88.3, y: 143 };

const destinations = [
  { name: "Cartagena", x: 122.8, y: 70.1, bend: -0.3 },
  { name: "Barranquilla", x: 144.6, y: 53.5, bend: 0.12 },
  { name: "Medellín", x: 120.9, y: 190.4, bend: 0.25 },
  { name: "Bogotá", x: 167.1, y: 235.2, bend: 0.25 },
  { name: "Cali", x: 91.4, y: 271.8, bend: 0.2 },
] as const;

const international = [
  { name: "Centroamérica", x: 12, y: 72, bend: 0.25 },
  { name: "Caribe y el mundo", x: 100, y: 10, bend: -0.2 },
];

function arc(from: { x: number; y: number }, to: { x: number; y: number }, bend = 0.25) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return `M${from.x} ${from.y} Q${mx - dy * bend} ${my + dx * bend} ${to.x} ${to.y}`;
}

export function Coverage() {
  return (
    <section id="cobertura" className="py-24 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Nuestra cobertura"
            title={
              <>
                Conectamos <span className="text-brand-600">Urabá</span> con el mundo
              </>
            }
            text="Desde Apartadó llevamos tu mercancía a toda la región, a las principales ciudades del país y, con aliados estratégicos, al exterior."
          />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {coverage.map((c) => (
              <RevealItem
                key={c.title}
                className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-navy-900/10"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-600 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="grid size-11 place-items-center rounded-xl bg-navy-900 text-white">
                  <c.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-navy-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.text}</p>
                {c.places && <p className="mt-3 text-xs font-semibold text-brand-700">{c.places}</p>}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-4 sm:p-8">
          <div className="absolute inset-0 bg-grid" />
          <svg
            viewBox="0 0 400 500"
            className="relative mx-auto w-full max-w-md"
            role="img"
            aria-label="Mapa de Colombia con rutas desde Apartadó hacia Cartagena, Barranquilla, Medellín, Bogotá, Cali y destinos internacionales"
          >
            <defs>
              <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.1" fill="rgb(255 255 255 / 0.22)" />
              </pattern>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <motion.path
              d={COLOMBIA}
              fill="url(#dots)"
              stroke="rgb(255 255 255 / 0.35)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />

            {[...destinations, ...international].map((d, i) => {
              const intl = i >= destinations.length;
              return (
                <g key={d.name}>
                  <motion.path
                    d={arc(HUB, d, d.bend)}
                    fill="none"
                    stroke={intl ? "rgb(255 255 255 / 0.55)" : "var(--color-brand-500)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 + i * 0.15, ease: "easeOut" }}
                  />
                  <path
                    d={arc(HUB, d, d.bend)}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeDasharray="2 22"
                    strokeLinecap="round"
                    className="animate-dash"
                    opacity="0.9"
                  />
                  {!intl && (
                    <>
                      <circle cx={d.x} cy={d.y} r="4" fill="white" />
                      <text x={d.x + 9} y={d.y + 4} className="fill-white font-sans text-[11px] font-semibold">
                        {d.name}
                      </text>
                    </>
                  )}
                  {intl && (
                    <text
                      x={d.x + (d.y < 40 ? 8 : 0)}
                      y={d.y < 40 ? d.y + 4 : d.y - 8}
                      className="fill-white/70 font-sans text-[10px] font-semibold tracking-wider uppercase"
                    >
                      {d.name} ↗
                    </text>
                  )}
                </g>
              );
            })}

            <circle cx={HUB.x} cy={HUB.y} r="28" fill="url(#glow)" />
            <circle cx={HUB.x} cy={HUB.y} r="7" fill="var(--color-brand-500)" stroke="white" strokeWidth="2.5">
              <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
            </circle>
            <g transform={`translate(${HUB.x - 78} ${HUB.y + 10})`}>
              <rect width="66" height="22" rx="11" fill="var(--color-brand-600)" />
              <text x="33" y="15" textAnchor="middle" className="fill-white font-sans text-[11px] font-bold">
                Apartadó
              </text>
            </g>
          </svg>

          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-brand-500" /> Centro de operaciones
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-brand-500" /> Rutas nacionales
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-white/55" /> Rutas internacionales
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
