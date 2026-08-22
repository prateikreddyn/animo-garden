import { createFileRoute } from "@tanstack/react-router";
import { Award, Camera, Heart, Sparkles } from "lucide-react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { streak, useAnimo, weekAdherence } from "@/lib/animo";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Your milestones — Animo" },
      { name: "description", content: "Positive milestones, points and weekly invitations — never streak-loss guilt." },
      { property: "og:title", content: "Your milestones — Animo" },
      { property: "og:description", content: "Gentle milestones and weekly invitations, framed as encouragement." },
    ],
  }),
  component: Rewards,
});

function Rewards() {
  const { state } = useAnimo();
  const s = streak(state);
  const week = weekAdherence(state);
  const done = week.filter((d) => d.pct >= 100).length;

  const milestones = [
    { icon: Camera, label: "First pill scanned", earned: state.logs.length > 0, points: 20 },
    { icon: Sparkles, label: "Three days together", earned: s >= 3, points: 50 },
    { icon: Heart, label: "A note from family", earned: state.messages.length > 0, points: 15 },
    { icon: Award, label: "A full week of visits", earned: s >= 7, points: 100 },
  ];

  return (
    <AppShell title="Your milestones" subtitle="Small good moments, collected.">
      <BigCard className="text-center">
        <p className="text-6xl font-semibold text-primary">{state.points}</p>
        <p className="text-xl text-muted-foreground">points gathered so far</p>
        <p className="mt-4 text-xl">
          {s > 0
            ? `${s} day${s === 1 ? "" : "s"} in a row. Keep your streak going — it's a nice one.`
            : "Today is a fresh start, and that's a perfectly good place to begin."}
        </p>
      </BigCard>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">This week</h2>
        <p className="text-lg text-muted-foreground">
          An invitation, not an obligation: {done} of 7 days complete.
        </p>
        <div className="mt-5 flex items-end justify-between gap-2" aria-hidden>
          {week.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div className="mx-auto flex h-28 w-full items-end rounded-2xl bg-secondary">
                <div
                  className="w-full rounded-2xl bg-primary transition-all"
                  style={{ height: `${Math.max(8, d.pct)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(d.date).toLocaleDateString(undefined, { weekday: "narrow" })}
              </p>
            </div>
          ))}
        </div>
      </BigCard>

      <div className="mt-5 space-y-4">
        {milestones.map((m) => (
          <BigCard key={m.label} className={`flex items-center gap-5 ${m.earned ? "" : "opacity-80"}`}>
            <m.icon
              aria-hidden
              className={`size-10 ${m.earned ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{m.label}</h3>
              <p className="text-base text-muted-foreground">
                {m.earned ? `Earned · +${m.points} points` : "Waiting for you, whenever it happens"}
              </p>
            </div>
          </BigCard>
        ))}
      </div>

    </AppShell>
  );
}
