import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { dueToday, streak, timeLabel, uid, useAnimo, weekAdherence } from "@/lib/animo";

export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver dashboard — Animo" },
      { name: "description", content: "A calm overview of adherence for family and caregivers, plus a way to send encouragement back." },
      { property: "og:title", content: "Caregiver dashboard — Animo" },
      { property: "og:description", content: "See adherence at a glance and send a warm note back." },
    ],
  }),
  component: Caregiver,
});

function Caregiver() {
  const { state, update } = useAnimo();
  const week = weekAdherence(state);
  const due = dueToday(state);
  const taken = due.filter((d) => d.taken).length;
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const avg = Math.round(week.reduce((a, d) => a + d.pct, 0) / (week.length || 1));

  return (
    <AppShell title="Caregiver view" subtitle={`How things are going for ${state.name}.`} wide>
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Today", value: `${taken}/${due.length}` },
          { label: "This week", value: `${avg}%` },
          { label: "Days in a row", value: String(streak(state)) },
        ].map((s) => (
          <BigCard key={s.label} className="text-center">
            <p className="text-4xl font-semibold text-primary">{s.value}</p>
            <p className="text-base text-muted-foreground">{s.label}</p>
          </BigCard>
        ))}
      </div>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Last 7 days</h2>
        <div className="mt-5 flex items-end gap-3" aria-hidden>
          {week.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div className="flex h-32 items-end rounded-2xl bg-secondary">
                <div className="w-full rounded-2xl bg-leaf" style={{ height: `${Math.max(8, d.pct)}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
              </p>
            </div>
          ))}
        </div>
      </BigCard>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Today in detail</h2>
        <ul className="mt-4 space-y-3">
          {due.map((d) => (
            <li
              key={d.pill.id + d.time}
              className="flex items-center justify-between rounded-2xl bg-secondary px-5 py-4 text-lg"
            >
              <span>
                {d.pill.name} · {timeLabel[d.time]}
              </span>
              <span className="font-semibold">{d.taken ? "Taken" : "Still waiting"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base text-muted-foreground">
          Animo shares only whether a dose was logged — never photos, location or conversations.
        </p>
      </BigCard>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Send some encouragement</h2>
        <label htmlFor="note" className="sr-only">
          Your message
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="The tulips are blooming — call me after breakfast?"
          className="mt-3 w-full rounded-2xl border-2 border-input bg-background p-5 text-xl"
        />
        <div className="mt-4">
          <BigButton
            icon={<Send className="size-7" />}
            onClick={() => {
              if (!note.trim()) return;
              update((s) => ({
                ...s,
                points: s.points + 5,
                messages: [
                  { id: uid(), from: `${s.caregiverName} (family)`, text: note.trim(), at: Date.now() },
                  ...s.messages,
                ],
              }));
              setNote("");
              setSent(true);
            }}
          >
            Send to {state.name}
          </BigButton>
        </div>
        {sent && (
          <p className="mt-3 text-lg text-primary" role="status">
            Sent. It'll appear in Family messages.
          </p>
        )}
      </BigCard>
    </AppShell>
  );
}
