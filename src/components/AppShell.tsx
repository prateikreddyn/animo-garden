import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({
  title,
  subtitle,
  back = "/home",
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  back?: string | null;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--gradient-sky)" }}>
      <div className={`mx-auto w-full px-5 pt-6 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
        <header className="mb-7">
          {back && (
            <Link
              to={back}
              className="mb-5 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-card px-5 text-lg font-semibold text-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
            >
              <ArrowLeft aria-hidden className="size-6" />
              Back
            </Link>
          )}
          <h1 className="text-4xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-xl text-muted-foreground">{subtitle}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}

export function BigCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`animate-rise rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </section>
  );
}
