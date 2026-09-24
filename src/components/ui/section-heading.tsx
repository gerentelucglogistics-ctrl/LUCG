import { Reveal } from "./reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, text, align = "left", tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase ${
          dark ? "text-brand-400" : "text-brand-700"
        }`}
      >
        <span className="h-0.5 w-6 rounded-full bg-current" />
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {text && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{text}</p>}
    </Reveal>
  );
}
