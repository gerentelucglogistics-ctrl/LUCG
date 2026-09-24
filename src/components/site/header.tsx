"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { navLinks, site, whatsappUrl, defaultQuoteMessage } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: bloquea el scroll, aísla el resto de la página y gestiona el foco
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const outside = document.querySelectorAll<HTMLElement>("main, footer, [data-menu-inert]");
    outside.forEach((el) => (el.inert = open));
    if (open) firstLinkRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      outside.forEach((el) => (el.inert = false));
    };
  }, [open]);

  const solid = scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-18 items-center justify-between gap-6 lg:h-20">
        <Link href="/" className="relative z-10 block shrink-0" aria-label={`${site.shortName} — inicio`}>
          <Image
            src={solid ? "/img/logo.webp" : "/img/logo-blanco.webp"}
            alt={site.name}
            width={95}
            height={52}
            priority
            className="h-11 w-auto lg:h-13"
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-500 after:transition-transform hover:after:scale-x-100 ${
                solid ? "text-navy-900" : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone}`}
            className={`flex items-center gap-2 text-sm font-semibold ${solid ? "text-navy-900" : "text-white"}`}
          >
            <Phone className="size-4 text-brand-500" />
            {site.phoneDisplay}
          </a>
          <a
            href={whatsappUrl(defaultQuoteMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/30 transition hover:-translate-y-0.5 hover:bg-brand-800"
          >
            <WhatsAppIcon className="size-4" />
            Cotizar ahora
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className={`relative z-10 grid size-11 place-items-center rounded-full lg:hidden ${
            solid ? "text-navy-900" : "text-white"
          }`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex flex-col bg-navy-950 bg-grid px-6 pt-28 pb-10 lg:hidden"
          >
            <nav aria-label="Móvil" className="flex flex-col">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-bold text-white"
                  >
                    {l.label}
                    <span className="text-sm text-brand-400">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto grid gap-3">
              <a
                href={whatsappUrl(defaultQuoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-brand-700 py-4 font-bold text-white"
              >
                <WhatsAppIcon className="size-5" /> Cotizar por WhatsApp
              </a>
              <a
                href={`tel:${site.phone}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-4 font-bold text-white"
              >
                <Phone className="size-5" /> {site.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
