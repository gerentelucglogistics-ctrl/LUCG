import { Reveal } from "@/components/ui/reveal";

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-36 pb-20 text-white lg:pt-44 lg:pb-24">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute -right-32 -bottom-32 size-96 rounded-full bg-brand-600/20 blur-3xl" />
      <Reveal className="relative container-site max-w-4xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">
          <span className="h-0.5 w-6 rounded-full bg-current" />
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
        {text && <p className="mt-6 max-w-2xl text-lg text-white/70">{text}</p>}
      </Reveal>
    </section>
  );
}
