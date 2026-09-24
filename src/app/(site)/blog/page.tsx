import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, gallery, posts } from "@/content/posts";
import { ogDefaults } from "@/lib/site";
import { PageHero } from "@/components/site/page-hero";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Blog",
  description: "Consejos, buenas prácticas y novedades del sector logístico por el equipo de LUCG Logistics.",
  alternates: { canonical: "/blog" },
  openGraph: { ...ogDefaults, url: "/blog", title: "Blog | LUCG Logistics" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Conocimiento que mueve tu operación"
        text="Compartimos experiencias, buenas prácticas y tendencias del transporte, el almacenamiento y la distribución para que tu empresa esté siempre un paso adelante."
      />

      <section className="py-20 lg:py-24">
        <div className="container-site">
          <RevealGroup className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              // El artículo más reciente se muestra destacado a todo el ancho
              <RevealItem key={post.slug} className={i === 0 ? "md:col-span-2 lg:col-span-3" : undefined}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`group block overflow-hidden rounded-3xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/10 ${
                    i === 0 ? "md:grid md:grid-cols-2 md:items-center" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt}
                      fill
                      sizes={
                        i === 0
                          ? "(min-width: 768px) 50vw, 100vw"
                          : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className={i === 0 ? "p-6 md:p-10 lg:p-14" : "p-6"}>
                    <time dateTime={post.date} className="text-xs font-semibold text-muted">
                      {formatDate(post.date)}
                    </time>
                    <h2
                      className={`mt-2 leading-snug font-bold text-navy-900 ${i === 0 ? "text-2xl lg:text-3xl" : "text-xl"}`}
                    >
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                      Leer artículo
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <div className="container-site">
          <SectionHeading
            eyebrow="Galería"
            title="Nuestra operación en imágenes"
            text="Piezas que resumen quiénes somos, cómo trabajamos y los servicios que ofrecemos."
          />
          <RevealGroup stagger={0.05} className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {gallery.map((g) => (
              <RevealItem key={g.n} className="mb-5 break-inside-avoid">
                <a
                  href={g.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
                >
                  <Image
                    src={g.src}
                    alt={g.title}
                    width={826}
                    height={465}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <p className="px-4 py-3 text-sm font-semibold text-navy-900">{g.title}</p>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
