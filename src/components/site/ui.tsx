import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "inverse";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-[0.95rem] font-medium leading-none transition-all duration-200 disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Primary trustworthy blue
  primary:
    "bg-brand text-white px-6 py-3.5 shadow-card hover:bg-brand-600 hover:shadow-lift active:translate-y-px",
  // Quiet outline on paper
  secondary:
    "border border-hairline bg-card text-ink px-6 py-3.5 hover:border-brand-200 hover:bg-brand-50",
  // Warm accent — reserved for positive actions
  accent:
    "bg-sage text-white px-6 py-3.5 shadow-card hover:brightness-95 active:translate-y-px",
  ghost: "text-ink-soft px-3 py-2 hover:text-brand",
  // White button for use on brand/dark backgrounds
  inverse:
    "bg-white text-brand px-6 py-3.5 shadow-card hover:bg-brand-50 active:translate-y-px",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return (
    <Link className={`${buttonBase} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

/** Small label above a section heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
      <span className="h-px w-6 bg-brand-400" aria-hidden />
      {children}
    </span>
  );
}

/** Trust pill — bordered chip with an icon. */
export function Pill({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card/80 px-3.5 py-1.5 text-sm font-medium text-ink-soft backdrop-blur">
      {icon}
      {children}
    </span>
  );
}
