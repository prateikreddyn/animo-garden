import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Animo" },
      { name: "description", content: "Text size, spoken confirmations and what your family can see." },
      { property: "og:title", content: "Settings — Animo" },
      { property: "og:description", content: "Text size, voice and privacy choices in Animo." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex min-h-24 w-full items-center justify-between gap-5 rounded-3xl border border-border bg-card p-6 text-left"
    >
      <span>
        <span className="block text-2xl font-semibold">{label}</span>
        <span className="block text-base text-muted-foreground">{hint}</span>
      </span>
      <span
        aria-hidden
        className={`flex h-12 w-24 shrink-0 items-center rounded-full p-1.5 transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`size-9 rounded-full bg-background transition-transform ${on ? "translate-x-12" : ""}`}
        />
      </span>
    </button>
  );
}

function SettingsPage() {
  const { state, update } = useAnimo();

  useEffect(() => {
    document.documentElement.classList.toggle("animo-large", state.largeText);
  }, [state.largeText]);

  return (
    <AppShell title="Settings" subtitle="Make Animo comfortable for you.">
      <div className="space-y-4">
        <Toggle
          label="Larger text"
          hint="Everything gets bigger across the app."
          on={state.largeText}
          onChange={(v) => update((s) => ({ ...s, largeText: v }))}
        />
        <Toggle
          label="Speak out loud"
          hint="Animo reads confirmations aloud."
          on={state.voiceOn}
          onChange={(v) => update((s) => ({ ...s, voiceOn: v }))}
        />
      </div>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Your privacy</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Pill photos stay on this device. {state.caregiverName} only ever sees whether a dose was logged — no
          photos, no location, no conversations with Animo.
        </p>
      </BigCard>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">A gentle reminder</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Animo is a companion, not a doctor. For anything about your health, please speak to your pharmacist or
          physician.
        </p>
      </BigCard>
    </AppShell>
  );
}
