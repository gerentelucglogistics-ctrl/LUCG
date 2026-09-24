import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ogDefaults, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | Operador logístico en Urabá`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "logística Urabá",
    "transporte de carga Apartadó",
    "bodega Urabá",
    "almacenamiento",
    "distribución última milla",
    "operador logístico Antioquia",
  ],
  openGraph: {
    ...ogDefaults,
    type: "website",
    url: "/",
    title: `${site.shortName} | ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#011c52",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
