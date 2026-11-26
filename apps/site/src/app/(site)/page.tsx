import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { Challenges } from "@/components/site/challenges";
import { Methodology } from "@/components/site/methodology";
import { Coverage } from "@/components/site/coverage";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/img/logo.webp`,
  image: `${site.url}/img/hero-operario.webp`,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  taxID: site.nit,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: "CO",
  },
  areaServed: ["Urabá", "Colombia"],
  sameAs: Object.values(site.social),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Services />
      <Challenges />
      <Methodology />
      <Coverage />
      <About />
      <Contact />
    </>
  );
}
