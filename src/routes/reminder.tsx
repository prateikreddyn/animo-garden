import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { dueToday, timeLabel, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/reminder")({
  head: () => ({
    meta: [
      { title: "A gentle reminder — Animo" },
      { name: "description", content: "A soft nudge about the next medicine, with a camera scan or a spoken yes." },
      { property: "og:title", content: "A gentle reminder — Animo" },
      { property: "og:description", content: "Your next dose, whenever you're ready." },
    ],
  }),
  component: Reminder,
});

function Reminder() {
  const { state } = useAnimo();
  const next = dueToday(state).find((d) => !d.taken);

  if (!next) {
    return (
      <AppShell title="All done for today" subtitle="Nothing is waiting. Enjoy your day.">
        <BigCard>
          <BigLink to="/companion" tone="primary">
            Visit your garden
          </BigLink>
        </BigCard>
      </AppShell>
    );
  }

  return (
    <AppShell title="Whenever you're ready" subtitle="No rush at all.">
      <BigCard className="text-center">
        <Bell aria-hidden className="mx-auto size-16 text-primary" />
        <h2 className="mt-4 text-3xl font-semibold">{next.pill.name}</h2>
        <p className="mt-2 text-xl text-muted-foreground">
          Your {timeLabel[next.time].toLowerCase()} dose · {next.pill.dose}
        </p>
        {next.pill.note && <p className="mt-2 text-lg text-muted-foreground">{next.pill.note}</p>}

        <div className="mt-8 space-y-4">
          <Link
            to="/scan"
            search={{ pillId: next.pill.id, time: next.time }}
            className="flex min-h-20 w-full items-center justify-center rounded-3xl bg-primary text-2xl font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
          >
            Scan this pill
          </Link>
          <Link
            to="/scan"
            search={{ pillId: next.pill.id, time: next.time, mode: "voice" }}
            className="flex min-h-20 w-full items-center justify-center rounded-3xl border border-border bg-card text-2xl font-semibold"
          >
            Skip the camera — just say yes
          </Link>
          <Link
            to="/home"
            className="flex min-h-16 w-full items-center justify-center rounded-3xl text-xl font-semibold text-muted-foreground"
          >
            Remind me a little later
          </Link>
        </div>
      </BigCard>
    </AppShell>
  );
}
