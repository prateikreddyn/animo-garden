import { createFileRoute } from "@tanstack/react-router";
import { Heart, Phone } from "lucide-react";
import { useEffect } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { RoleGate } from "@/components/RoleGate";
import { caregiverLabel, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Family messages | Animo" },
      { name: "description", content: "Short notes and photos from the people who love you, kept in one calm place." },
      { property: "og:title", content: "Family messages | Animo" },
      { property: "og:description", content: "Notes and photos from family, in one calm place." },
    ],
  }),
  component: () => (
    <RoleGate allow="patient">
      <Family />
    </RoleGate>
  ),
});

function Family() {
  const { state, update } = useAnimo();

  useEffect(() => {
    update((s) => ({ ...s, messages: s.messages.map((m) => ({ ...m, read: true })) }));
  }, [update]);

  return (
    <AppShell title="Family messages" subtitle="Little hellos from the people who love you.">
      <div className="space-y-4">
        {state.messages.map((m) => (
          <BigCard key={m.id}>
            <div className="flex items-center gap-3">
              <Heart aria-hidden className="size-7 text-bloom" />
              <h2 className="min-w-0 break-words text-xl font-semibold">{m.from}</h2>
            </div>
            {m.photo && (
              <img src={m.photo} alt={`Photo from ${m.from}`} className="mt-4 w-full rounded-2xl" />
            )}
            {m.video && (
              <video
                src={m.video}
                controls
                playsInline
                className="mt-4 w-full rounded-2xl bg-secondary"
                aria-label={`Video from ${m.from}`}
              />
            )}
            {m.text && <p className="mt-3 break-words text-xl leading-relaxed">{m.text}</p>}

            <p className="mt-2 text-base text-muted-foreground">
              {new Date(m.at).toLocaleString(undefined, {
                weekday: "long",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </BigCard>
        ))}
      </div>

      <BigCard className="mt-6 bg-accent text-accent-foreground">
        <div className="flex items-start gap-4">
          <Phone aria-hidden className="size-9 shrink-0" />
          <div>
            <h2 className="text-2xl font-semibold">Hearing a voice is even nicer</h2>
            <p className="mt-1 text-lg">
              Any of them would love a call. Animo is good company, but never a replacement for people.
            </p>
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {state.caregivers.map((c) => (
            <li key={c.id}>
              <a
                href={c.phone ? `tel:${c.phone.replace(/[^0-9+]/g, "")}` : undefined}
                className="flex min-h-20 items-center justify-between gap-4 rounded-2xl bg-background px-5 py-4 text-foreground"
              >
                <span>
                  <span className="block text-xl font-semibold">{c.name}</span>
                  <span className="block text-base text-muted-foreground">{c.relation}</span>
                </span>
                <span className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Phone aria-hidden className="size-6" />
                  {c.phone ? "Call" : "No number yet"}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="sr-only">{state.caregivers.map(caregiverLabel).join(", ")}</p>
      </BigCard>
    </AppShell>
  );
}
