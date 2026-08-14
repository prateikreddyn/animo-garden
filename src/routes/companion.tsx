import { createFileRoute } from "@tanstack/react-router";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { Companion } from "@/components/Companion";
import { companionCopy, companionState, dueToday, streak, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/companion")({
  head: () => ({
    meta: [
      { title: "Your garden — Animo" },
      { name: "description", content: "A warm little garden that brightens when you take your medicines and rests gently when it's waiting." },
      { property: "og:title", content: "Your garden — Animo" },
      { property: "og:description", content: "Your companion's state, always kind, never scolding." },
    ],
  }),
  component: CompanionPage,
});

function CompanionPage() {
  const { state } = useAnimo();
  const cs = companionState(state);
  const due = dueToday(state);
  const taken = due.filter((d) => d.taken).length;

  return (
    <AppShell title="Your garden" subtitle="It's happy you stopped by.">
      <BigCard className="text-center">
        <Companion state={cs} size={320} className="mx-auto" />
        <h2 className="text-3xl font-semibold">{companionCopy[cs].title}</h2>
        <p className="mt-2 text-xl text-muted-foreground">{companionCopy[cs].body}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-secondary p-5">
            <p className="text-3xl font-semibold">
              {taken}/{due.length}
            </p>
            <p className="text-base text-muted-foreground">doses today</p>
          </div>
          <div className="rounded-3xl bg-secondary p-5">
            <p className="text-3xl font-semibold">{streak(state)}</p>
            <p className="text-base text-muted-foreground">days together</p>
          </div>
        </div>
      </BigCard>

      <div className="mt-5 space-y-4">
        <BigLink to="/reminder" tone="primary">
          Take a medicine
        </BigLink>
        <BigLink to="/chat">Chat with Animo</BigLink>
      </div>

      <p className="mt-6 text-center text-base text-muted-foreground">
        Your garden never wilts. On quieter days it simply waits, and brightens the moment you return.
      </p>
    </AppShell>
  );
}
