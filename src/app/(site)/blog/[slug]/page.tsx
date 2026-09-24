import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { formatDate, getPost, posts } from "@/content/posts";
import { ogDefaults, site, whatsappUrl, defaultQuoteMessage } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      ...ogDefaults,
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-navy-950 pt-36 pb-40 text-white lg:pt-44">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <Reveal className="relative container-site max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Volver al blog
          </Link>
          <p className="mt-8 text-sm font-semibold text-brand-400">
            {post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <h1 className="mt-3 text-4xl leading-[1.1] font-extrabold sm:text-5xl">{post.title}</h1>
        </Reveal>
      </header>

      <div className="container-site max-w-3xl">
        <div className="relative -mt-28 aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>

        <p className="mt-12 text-xl leading-relaxed text-navy-900">{post.intro}</p>

        {post.sections.map((s, i) => (
          <Reveal key={s.title} className="mt-14">
            <h2 className="flex items-baseline gap-3 text-2xl font-extrabold text-navy-900 sm:text-3xl">
              <span className="font-display text-base text-brand-700">0{i + 1}</span>
              {s.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{s.intro}</p>
            <ul className="mt-6 grid gap-3">
              {s.points.map((p) => (
                <li key={p} className="flex gap-3 rounded-xl bg-paper p-4">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-navy-900">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal className="my-20 rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
          <p className="text-2xl font-extrabold">¿Quieres aplicar estas prácticas en tu operación?</p>
          <p className="mt-3 text-white/70">
            En {site.shortName} te ayudamos a diseñar una logística más segura y eficiente.
          </p>
          <ButtonLink href={whatsappUrl(defaultQuoteMessage)} className="mt-6">
            <WhatsAppIcon className="size-5" /> Hablemos por WhatsApp
          </ButtonLink>
        </Reveal>
      </div>
    </article>
  );
}
