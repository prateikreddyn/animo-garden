import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { uid, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Animo" },
      { name: "description", content: "A simple sign in for Animo, with room for a caregiver to help set things up." },
      { property: "og:title", content: "Sign in — Animo" },
      { property: "og:description", content: "Simple, caregiver-friendly sign in for Animo." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { update } = useAnimo();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [caregivers, setCaregivers] = useState<{ name: string; relation: string }[]>([
    { name: "", relation: "" },
  ]);

  return (
    <AppShell
      title="Let's set you up"
      subtitle="Just two things. A family member can help with this part."
      back="/"
    >
      <BigCard className="space-y-7">
        <div>
          <label htmlFor="name" className="mb-2 block text-xl font-semibold">
            What should Animo call you?
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Robert"
            className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <span className="mb-2 block text-xl font-semibold">Who should we share good news with?</span>
          <div className="space-y-3">
            {caregivers.map((c, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                <input
                  aria-label={`Care team member ${i + 1} name`}
                  value={c.name}
                  onChange={(e) =>
                    setCaregivers((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  placeholder="Maria"
                  className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground"
                />
                <input
                  aria-label={`Care team member ${i + 1} relationship`}
                  value={c.relation}
                  onChange={(e) =>
                    setCaregivers((list) => list.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)))
                  }
                  placeholder="Daughter"
                  className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCaregivers((list) => [...list, { name: "", relation: "" }])}
            className="mt-3 min-h-16 w-full rounded-2xl border-2 border-input px-5 text-xl font-semibold"
          >
            Add another person
          </button>
          <p className="mt-2 text-base text-muted-foreground">
            They'll only see whether doses were taken — never your camera or conversations.
          </p>
        </div>
        <BigButton
          onClick={() => {
            update((s) => ({
              ...s,
              onboarded: true,
              name: name.trim() || s.name,
              caregivers: (() => {
                const list = caregivers
                  .filter((c) => c.name.trim())
                  .map((c) => ({ id: uid(), name: c.name.trim(), relation: c.relation.trim() || "Family" }));
                return list.length ? list : s.caregivers;
              })(),
              caregiverName: caregivers[0]?.name.trim() || s.caregiverName,
            }));
            navigate({ to: "/home" });
          }}
        >
          Continue
        </BigButton>
      </BigCard>
    </AppShell>
  );
}
