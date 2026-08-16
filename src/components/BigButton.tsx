import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex w-full min-h-20 items-center gap-4 rounded-3xl px-6 py-4 text-left text-2xl font-semibold shadow-[var(--shadow-soft)] transition-all hover:scale-[1.015] active:scale-[0.99] disabled:opacity-60";

const tones = {
  primary: "bg-primary text-primary-foreground",
  soft: "bg-card text-foreground border border-border",
  accent: "bg-accent text-accent-foreground",
} as const;

type Tone = keyof typeof tones;

export function BigLink({
  to,
  icon,
  children,
  hint,
  tone = "soft",
  ...rest
}: {
  to: string;
  icon?: ReactNode;
  children: ReactNode;
  hint?: string;
  tone?: Tone;
} & Omit<ComponentProps<typeof Link>, "to" | "children">) {
  return (
    <Link to={to} className={`${base} ${tones[tone]}`} {...(rest as object)}>
      {icon && <span aria-hidden className="shrink-0">{icon}</span>}
      <span>
        <span className="block">{children}</span>
        {hint && <span className="block text-base font-normal opacity-80">{hint}</span>}
      </span>
    </Link>
  );
}

export function BigButton({
  icon,
  children,
  hint,
  tone = "primary",
  className = "",
  ...rest
}: {
  icon?: ReactNode;
  children: ReactNode;
  hint?: string;
  tone?: Tone;
} & ComponentProps<"button">) {
  return (
    <button className={`${base} ${tones[tone]} ${className}`} {...rest}>
      {icon && <span aria-hidden className="shrink-0">{icon}</span>}
      <span>
        <span className="block">{children}</span>
        {hint && <span className="block text-base font-normal opacity-80">{hint}</span>}
      </span>
    </button>
  );
}
