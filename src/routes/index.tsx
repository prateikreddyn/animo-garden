import { createFileRoute, Link } from "@tanstack/react-router";
import { Companion } from "@/components/Companion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Animo: A gentle companion for your medicines" },
      {
        name: "description",
        content:
          "Animo helps you take your medicines with a warm digital garden companion, simple pill scanning, and messages from family.",
      },
      { property: "og:title", content: "Animo: A gentle companion for your medicines" },
      {
        property: "og:description",
        content: "Scan your pill, take your dose, and watch your garden thrive. Made for seniors.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-14"
      style={{ background: "var(--gradient-sky)" }}
    >
      <div className="w-full max-w-xl text-center">
        <Companion state="thriving" size={300} className="mx-auto" />
        <h1 className="mt-4 text-5xl font-semibold text-foreground">Animo</h1>
        <p className="mt-4 text-2xl leading-relaxed text-muted-foreground">
          A quiet little garden that keeps you company, and remembers your medicines with you.
        </p>

        <ol className="mx-auto mt-8 space-y-4 text-left text-xl">
          {[
            "Scan your pill so we can check it's the right one.",
            "Say or tap yes when you take it.",
            "Your garden brightens, and your family can send a hello.",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-9 space-y-4">
          <Link
            to="/login"
            className="flex min-h-20 w-full items-center justify-center rounded-3xl bg-primary px-6 text-2xl font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
          >
            Get started
          </Link>
          <Link
            to="/home"
            className="flex min-h-20 w-full items-center justify-center rounded-3xl border border-border bg-card px-6 text-2xl font-semibold text-foreground"
          >
            I've been here before
          </Link>
        </div>
        <p className="mt-6 text-base text-muted-foreground">
          Animo never gives medical advice. Your pharmacist and doctor always come first.
        </p>
      </div>
    </main>
  );
}
