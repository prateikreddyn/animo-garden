import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart, Users } from "lucide-react";
import { useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { uid, useAnimo, type AccountRole } from "@/lib/animo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Animo" },
      { name: "description", content: "Choose whether you are the person taking the medicines or someone helping, then set up Animo." },
      { property: "og:title", content: "Sign in | Animo" },
      { property: "og:description", content: "Separate set up for the person taking medicines and for family helpers." },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground";

function LoginPage() {
  const { update } = useAnimo();
  const navigate = useNavigate();
  const [role, setRole] = useState<AccountRole | null>(null);

  const [name, setName] = useState("");
  const [caregivers, setCaregivers] = useState<{ name: string; relation: string }[]>([
    { name: "", relation: "" },
  ]);

  const [helperName, setHelperName] = useState("");
  const [helperRelation, setHelperRelation] = useState("");
  const [patientName, setPatientName] = useState("");

  if (!role) {
    return (
      <AppShell title="Who is using Animo?" subtitle="Pick the one that fits you. You can change it later." back="/">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className="flex w-full items-start gap-4 rounded-3xl border border-border bg-card p-6 text-left shadow-[var(--shadow-soft)]"
          >
            <Heart aria-hidden className="size-9 shrink-0 text-bloom" />
            <span className="min-w-0">
              <span className="block break-words text-2xl font-semibold">I take the medicines</span>
              <span className="mt-1 block text-lg text-muted-foreground">
                Your garden, your daily medicines, and notes from family.
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("caregiver")}
            className="flex w-full items-start gap-4 rounded-3xl border border-border bg-card p-6 text-left shadow-[var(--shadow-soft)]"
          >
            <Users aria-hidden className="size-9 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block break-words text-2xl font-semibold">I help someone</span>
              <span className="mt-1 block text-lg text-muted-foreground">
                See how the week is going and send a note, photo or short video.
              </span>
            </span>
          </button>
        </div>
      </AppShell>
    );
  }

  if (role === "caregiver") {
    return (
      <AppShell title="Set up your helper account" subtitle="Just your name and who you are helping." back="/">
        <BigCard className="space-y-7">
          <div>
            <label htmlFor="helper" className="mb-2 block text-xl font-semibold">
              What is your name?
            </label>
            <input
              id="helper"
              value={helperName}
              onChange={(e) => setHelperName(e.target.value)}
              placeholder="Maria"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="relation" className="mb-2 block text-xl font-semibold">
              How are you related?
            </label>
            <input
              id="relation"
              value={helperRelation}
              onChange={(e) => setHelperRelation(e.target.value)}
              placeholder="Daughter"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="patient" className="mb-2 block text-xl font-semibold">
              Who are you helping?
            </label>
            <input
              id="patient"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Robert"
              className={inputClass}
            />
          </div>
          <BigButton
            onClick={() => {
              const id = uid();
              update((s) => ({
                ...s,
                onboarded: true,
                role: "caregiver",
                activeCaregiverId: id,
                name: patientName.trim() || s.name,
                patients: [
                  { id: s.patients[0]?.id ?? "pt1", name: patientName.trim() || s.name },
                  ...s.patients.slice(1),
                ],
                activePatientId: s.patients[0]?.id ?? "pt1",
                caregivers: [
                  {
                    id,
                    name: helperName.trim() || "Family",
                    relation: helperRelation.trim() || "Family",
                  },
                  ...s.caregivers.filter((c) => c.name.trim() !== helperName.trim()),
                ],
                caregiverName: helperName.trim() || s.caregiverName,
              }));
              navigate({ to: "/caregiver" });
            }}
          >
            Continue
          </BigButton>
          <button
            type="button"
            onClick={() => setRole(null)}
            className="min-h-16 w-full rounded-2xl border-2 border-input px-5 text-xl font-semibold"
          >
            Back
          </button>
        </BigCard>
      </AppShell>
    );
  }

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
            className={inputClass}
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
                  className={inputClass}
                />
                <input
                  aria-label={`Care team member ${i + 1} relationship`}
                  value={c.relation}
                  onChange={(e) =>
                    setCaregivers((list) => list.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)))
                  }
                  placeholder="Daughter"
                  className={inputClass}
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
            They'll only see whether doses were taken, never your camera or conversations.
          </p>
        </div>
        <BigButton
          onClick={() => {
            update((s) => ({
              ...s,
              onboarded: true,
              role: "patient",
            name: name.trim() || s.name,
            patients: [
              { id: s.patients[0]?.id ?? "pt1", name: name.trim() || s.name },
              ...s.patients.slice(1),
            ],
            activePatientId: s.patients[0]?.id ?? "pt1",
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
        <button
          type="button"
          onClick={() => setRole(null)}
          className="min-h-16 w-full rounded-2xl border-2 border-input px-5 text-xl font-semibold"
        >
          Back
        </button>
      </BigCard>
    </AppShell>
  );
}
