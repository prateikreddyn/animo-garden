import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell, BigCard } from "@/components/AppShell";
import { dueToday, timeLabel, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "Today's medicines — Animo" },
      { name: "description", content: "A calm list of the medicines planned for today, with what's already been taken." },
      { property: "og:title", content: "Today's medicines — Animo" },
      { property: "og:description", content: "See what's planned for today and what's already done." },
    ],
  }),
  component: Medicines,
});

function Medicines() {
  const { state } = useAnimo();
  const due = dueToday(state);

  return (
    <AppShell title="Today's medicines" subtitle="Take them in any order that suits you.">
      <div className="space-y-4">
        {due.map(({ pill, time, taken }) => (
          <BigCard key={pill.id + time} className="flex items-center gap-5">
            <div
              className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                taken ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
              aria-hidden
            >
              {taken ? <Check className="size-8" /> : timeLabel[time][0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{pill.name}</h2>
              <p className="text-lg text-muted-foreground">
                {timeLabel[time]} · {pill.dose}
              </p>
            </div>
            {taken ? (
              <span className="rounded-full bg-secondary px-4 py-2 text-base font-semibold">Taken</span>
            ) : (
              <Link
                to="/scan"
                search={{ pillId: pill.id, time }}
                className="min-h-16 rounded-2xl bg-primary px-6 py-4 text-xl font-semibold text-primary-foreground"
              >
                Take
              </Link>
            )}
          </BigCard>
        ))}
        {due.length === 0 && (
          <BigCard>
            <p className="text-xl">No medicines added yet. You can add one whenever you like.</p>
          </BigCard>
        )}
      </div>
    </AppShell>
  );
}
