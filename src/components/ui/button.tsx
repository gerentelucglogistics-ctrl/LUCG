import Link from "next/link";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 active:scale-[0.98]";

const variants = {
  primary: "bg-brand-700 text-white shadow-lg shadow-brand-700/25 hover:bg-brand-800 hover:-translate-y-0.5",
  navy: "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5",
  ghost: "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
  outline: "border border-navy-900/15 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
} as const;

type Props = React.ComponentProps<"a"> & { variant?: keyof typeof variants; href: string };

export function ButtonLink({ variant = "primary", className = "", href, ...props }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = /^(https?:|mailto:|tel:)/.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        {...props}
      />
    );
  }
  return <Link href={href} className={cls} {...props} />;
}
