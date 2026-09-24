import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/brand-icons";

const socials = [
  { href: site.social.facebook, label: "Facebook", icon: FacebookIcon },
  { href: site.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: site.social.tiktok, label: "TikTok", icon: TikTokIcon },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600" />
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Image src="/img/logo-blanco.webp" alt={site.name} width={116} height={64} className="h-16 w-auto" />
          <p className="mt-5 max-w-sm text-white/60">
            Soluciones logísticas seguras, rápidas y eficientes. Conectamos Urabá con Colombia y el mundo.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Pie de página">
          <p className="font-display text-sm font-bold tracking-wider uppercase">Navegación</p>
          <ul className="mt-5 grid gap-3 text-white/60">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contacto" className="transition hover:text-brand-400">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-display text-sm font-bold tracking-wider uppercase">Contacto</p>
          <ul className="mt-5 grid gap-4 text-white/60">
            <li>
              <a href={`tel:${site.phone}`} className="flex gap-3 transition hover:text-brand-400">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 break-all transition hover:text-brand-400">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-500" /> {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
              <span>
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} · {site.address.country}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          <p>NIT {site.nit}</p>
        </div>
      </div>
    </footer>
  );
}
