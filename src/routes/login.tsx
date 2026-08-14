import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { useAnimo } from "@/lib/animo";

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
  const [caregiver, setCaregiver] = useState("");

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
          <label htmlFor="caregiver" className="mb-2 block text-xl font-semibold">
            Who should we share good news with?
          </label>
          <input
            id="caregiver"
            value={caregiver}
            onChange={(e) => setCaregiver(e.target.value)}
            placeholder="Maria, my daughter"
            className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground"
          />
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
              caregiverName: caregiver.trim() || s.caregiverName,
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
