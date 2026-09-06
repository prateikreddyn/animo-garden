import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import {
  activeCaregiver,
  activePatient,
  caregiverNames,
  selectCaregiver,
  selectPatient,
  uid,
  useAnimo,
} from "@/lib/animo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Animo" },
      { name: "description", content: "Text size, spoken confirmations and what your family can see." },
      { property: "og:title", content: "Settings | Animo" },
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

function ProfileButton({
  name,
  tag,
  detail,
  active,
  onClick,
}: {
  name: string;
  tag: string;
  detail?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-20 w-full rounded-3xl border-2 px-6 py-4 text-left ${active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}
    >
      <span className="flex flex-wrap items-center gap-3">
        <span className="min-w-0 break-words text-xl font-semibold">{name}</span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${active ? "bg-primary-foreground/20" : "bg-secondary text-secondary-foreground"}`}
        >
          {tag}
        </span>
      </span>
      {detail && <span className="mt-1 block break-words text-base opacity-80">{detail}</span>}
    </button>
  );
}

function Profiles() {
  const { state, update } = useAnimo();
  const [newPatient, setNewPatient] = useState("");
  const current = state.role === "caregiver" ? activeCaregiver(state).name : activePatient(state).name;

  return (
    <BigCard className="mt-5">
      <h2 className="text-2xl font-semibold">Who is using this device?</h2>
      <p className="mt-2 break-words text-lg text-muted-foreground">
        Signed in as {current}. Tap any name below to switch.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {state.patients.map((p) => (
          <ProfileButton
            key={p.id}
            name={p.name}
            tag="Patient"
            detail="Takes the medicines"
            active={state.role === "patient" && activePatient(state).id === p.id}
            onClick={() => update((s) => selectPatient(s, p.id))}
          />
        ))}
        {state.caregivers.map((c) => (
          <ProfileButton
            key={c.id}
            name={c.name}
            tag="Caregiver"
            detail={c.relation}
            active={state.role === "caregiver" && activeCaregiver(state).id === c.id}
            onClick={() => update((s) => selectCaregiver(s, c.id))}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          aria-label="Name of another person taking medicines"
          value={newPatient}
          onChange={(e) => setNewPatient(e.target.value)}
          placeholder="Add another person taking medicines"
          className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-xl"
        />
        <BigButton
          tone="soft"
          onClick={() => {
            const name = newPatient.trim();
            if (!name) return;
            update((s) => ({ ...s, patients: [...s.patients, { id: uid(), name }] }));
            setNewPatient("");
          }}
        >
          Add patient
        </BigButton>
      </div>
    </BigCard>
  );
}

function CareTeam() {
  const { state, update } = useAnimo();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <BigCard className="mt-5">
      <h2 className="text-2xl font-semibold">Care team</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Everyone here can see whether doses were logged, and send you a note.
      </p>
      <ul className="mt-4 space-y-3">
        {state.caregivers.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-4 rounded-2xl bg-secondary px-5 py-4">
            <span className="min-w-0">
              <span className="block break-words text-xl font-semibold">{c.name}</span>
              <span className="block break-words text-base text-muted-foreground">
                {c.relation}
                {c.phone ? ` · ${c.phone}` : ""}
              </span>
            </span>
            {state.caregivers.length > 1 && (
              <button
                type="button"
                onClick={() => update((s) => ({ ...s, caregivers: s.caregivers.filter((x) => x.id !== c.id) }))}
                className="min-h-14 rounded-2xl border-2 border-input px-5 text-lg font-semibold"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <input
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-xl"
        />
        <input
          aria-label="Relationship"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Son, nurse, friend"
          className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-xl"
        />
        <input
          aria-label="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-xl"
        />
      </div>
      <div className="mt-4">
        <BigButton
          tone="soft"
          onClick={() => {
            if (!name.trim()) return;
            update((s) => ({
              ...s,
              caregivers: [
                ...s.caregivers,
                {
                  id: uid(),
                  name: name.trim(),
                  relation: relation.trim() || "Family",
                  ...(phone.trim() ? { phone: phone.trim() } : {}),
                },
              ],
            }));
            setName("");
            setRelation("");
            setPhone("");
          }}
        >
          Add to care team
        </BigButton>
      </div>
    </BigCard>
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
        <Toggle
          label="Evening mode"
          hint="Softer, darker colours that are easy on the eyes at night."
          on={state.darkMode}
          onChange={(v) => update((s) => ({ ...s, darkMode: v }))}
        />
      </div>

      <Profiles />

      <CareTeam />

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Your privacy</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Pill photos stay on this device. {caregiverNames(state)} only ever see whether a dose was logged, no
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
