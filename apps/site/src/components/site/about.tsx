import Image from "next/image";
import { identity } from "@/content/home";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const facts = [
  { label: "Razón social", value: site.legalName },
  { label: "NIT", value: site.nit },
  { label: "Tipo de empresa", value: "Sociedad por Acciones Simplificada" },
  { label: "Alcance", value: "Nacional e internacional" },
];

export function About() {
  return (
    <section id="nosotros" className="bg-paper py-24 lg:py-32">
      <div className="container-site">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative grid h-[28rem] grid-cols-5 grid-rows-6 gap-3 sm:h-[34rem] sm:gap-4">
            <div className="relative col-span-3 row-span-4 overflow-hidden rounded-3xl">
              <Image
                src="/img/equipo.webp"
                alt="Integrante del equipo LUCG en bodega"
                fill
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl">
              <Image
                src="/img/operario-puerto.webp"
                alt="Operario frente a grúas portuarias al atardecer"
                fill
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl">
              <Image
                src="/img/escaneo.webp"
                alt="Escaneo de código de barras en una caja LUCG"
                fill
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-3 row-span-2 flex flex-col justify-center rounded-3xl bg-brand-700 p-5 text-white sm:p-6">
              <p className="font-display text-xl leading-tight font-extrabold sm:text-2xl">{site.tagline}</p>
              <p className="mt-1 text-sm text-white/90">Apartadó · Urabá · Antioquia</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Nosotros"
              title={
                <>
                  Somos más que una <span className="text-brand-600">solución logística</span>
                </>
              }
              text="LUCG Logistics es un operador logístico ubicado estratégicamente en Urabá, diseñado para ayudar a las empresas a reducir costos, mejorar tiempos de entrega y mantener control total de su operación."
            />
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">
                No somos solo un proveedor: nos convertimos en el aliado que entiende tu negocio, con servicios
                integrales de transporte, almacenamiento y distribución, trazabilidad y cobertura nacional e
                internacional.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {facts.map((f) => (
                  <div key={f.label} className="bg-white p-4">
                    <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{f.label}</dt>
                    <dd className="mt-1 text-sm font-bold text-navy-900">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        <RevealGroup className="mt-20 grid gap-5 md:grid-cols-3">
          {identity.map((item) => (
            <RevealItem
              key={item.title}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
            >
              <div className="absolute -top-16 -right-16 size-40 rounded-full bg-navy-50 transition-transform duration-500 group-hover:scale-150" />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-navy-900 text-white transition-colors duration-300 group-hover:bg-brand-600">
                <item.icon className="size-6" />
              </span>
              <h3 className="relative mt-6 text-xl font-extrabold text-navy-900">{item.title}</h3>
              <p className="relative mt-3 leading-relaxed text-muted">{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
