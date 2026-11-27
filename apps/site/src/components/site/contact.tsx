"use client";

import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { services } from "@/content/home";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";

const channels = [
  { icon: Phone, label: "Teléfono / WhatsApp", value: site.phoneDisplay, href: `tel:${site.phone}` },
  { icon: Mail, label: "Correo electrónico", value: site.email, href: `mailto:${site.email}` },
  {
    icon: MapPin,
    label: "Dirección",
    value: `${site.address.street}, ${site.address.city}, ${site.address.region}`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${site.address.street}, ${site.address.city}, ${site.address.region}, ${site.address.country}`,
    )}`,
  },
];

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition focus:border-brand-500 focus:bg-white/10 focus:outline-none";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const lines = [
      "Hola LUCG Logistics, quiero solicitar una cotización.",
      "",
      `*Nombre:* ${get("nombre")}`,
      get("empresa") && `*Empresa:* ${get("empresa")}`,
      `*Servicio:* ${get("servicio")}`,
      get("origen") && `*Origen:* ${get("origen")}`,
      get("destino") && `*Destino:* ${get("destino")}`,
      get("detalle") && `*Detalle:* ${get("detalle")}`,
    ].filter(Boolean);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section id="contacto" className="relative py-24 lg:py-32">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy-950 text-white">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
          <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-brand-600/25 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-12 px-4 py-8 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:p-16 [&>*]:min-w-0">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">
                <span className="h-0.5 w-6 rounded-full bg-current" />
                Contáctanos
              </p>
              <h2 className="mt-4 text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl">
                ¿Listo para optimizar tu <span className="text-brand-500">logística</span>?
              </h2>
              <p className="mt-5 text-lg text-white/70">
                Cuéntanos qué necesitas mover o almacenar y te respondemos con una propuesta a la medida.
              </p>

              <ul className="mt-10 grid gap-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-brand-500/60 hover:bg-white/5"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                        <c.icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-white/50">{c.label}</span>
                        <span className="block text-sm font-semibold [overflow-wrap:anywhere] sm:text-base">
                          {c.value}
                        </span>
                      </span>
                      <ArrowRight className="ml-auto size-4 shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-brand-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-8"
                aria-label="Solicitar cotización"
              >
                <h3 className="text-xl font-bold">Solicita tu cotización</h3>
                <p className="mt-1 text-sm text-white/60">Te respondemos por WhatsApp en horario laboral.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Nombre *
                    <input name="nombre" required autoComplete="name" placeholder="Tu nombre" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Empresa
                    <input name="empresa" autoComplete="organization" placeholder="Opcional" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                    Servicio *
                    <select name="servicio" required defaultValue="" className={`${field} [&>option]:text-navy-900`}>
                      <option value="" disabled>
                        Selecciona un servicio
                      </option>
                      {services.map((s) => (
                        <option key={s.id}>{s.title}</option>
                      ))}
                      <option>Solución integral / varios servicios</option>
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Origen
                    <input name="origen" placeholder="Ej. Apartadó" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Destino
                    <input name="destino" placeholder="Ej. Medellín" className={field} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                    Detalle de la carga
                    <textarea
                      name="detalle"
                      rows={3}
                      placeholder="Tipo de mercancía, volumen, peso, fechas…"
                      className={`${field} resize-none`}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-4 font-bold whitespace-nowrap text-white shadow-lg shadow-brand-700/30 transition hover:-translate-y-0.5 hover:bg-brand-800 sm:px-6"
                >
                  <WhatsAppIcon className="size-5" />
                  Enviar por WhatsApp
                  <ArrowRight className="hidden size-4 transition-transform group-hover:translate-x-1 sm:block" />
                </button>
                <p role="status" className="mt-3 min-h-5 text-center text-sm text-emerald-300">
                  {sent && "¡Listo! Abrimos WhatsApp con tu solicitud. Solo presiona enviar."}
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
