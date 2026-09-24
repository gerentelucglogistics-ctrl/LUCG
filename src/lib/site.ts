export const site = {
  name: "LUCG Logistics S.A.S",
  shortName: "LUCG Logistics",
  legalName: "Logística Urabá Conecta Global S.A.S",
  nit: "902054935-5",
  tagline: "Tu carga en manos expertas",
  url: "https://lucglogistics.com",
  description:
    "Operador logístico en Urabá: almacenamiento, transporte, distribución y última milla con cobertura local, nacional e internacional.",
  phone: "+573233705702",
  phoneDisplay: "+57 323 370 5702",
  email: "gerente.lucglogistics@gmail.com",
  address: {
    street: "Calle 91 # 114A-8, Barrio El Salvador",
    city: "Apartadó",
    region: "Antioquia",
    country: "Colombia",
  },
  social: {
    facebook: "https://www.facebook.com/share/1DBeSaqADN/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/lucg_logistics",
    tiktok: "https://www.tiktok.com/@lucglogistics",
  },
} as const;

/** Valores Open Graph compartidos: las rutas que redefinen `openGraph` los reemplazan por completo. */
export const ogDefaults = {
  siteName: site.name,
  locale: "es_CO",
  images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: site.name }],
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.phone.replace("+", "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultQuoteMessage = "Hola LUCG Logistics, quiero cotizar un servicio logístico.";

export const navLinks = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#metodologia", label: "Cómo trabajamos" },
  { href: "/#cobertura", label: "Cobertura" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
] as const;
