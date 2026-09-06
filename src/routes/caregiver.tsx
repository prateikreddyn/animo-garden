import { createFileRoute } from "@tanstack/react-router";
import { Camera, Send, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { RoleGate } from "@/components/RoleGate";
import { dueToday, streak, timeLabel, uid, useAnimo, weekAdherence } from "@/lib/animo";

const MAX_BYTES = 4 * 1024 * 1024;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("read failed"));
    fr.readAsDataURL(file);
  });
}


export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver dashboard | Animo" },
      { name: "description", content: "A calm overview of adherence for family and caregivers, plus a way to send encouragement back." },
      { property: "og:title", content: "Caregiver dashboard | Animo" },
      { property: "og:description", content: "See adherence at a glance and send a warm note back." },
    ],
  }),
  component: CaregiverPage,
});

function CaregiverPage() {
  return (
    <RoleGate allow="caregiver">
      <Caregiver />
    </RoleGate>
  );
}

function Caregiver() {
  const { state, update } = useAnimo();
  const week = weekAdherence(state);
  const due = dueToday(state);
  const taken = due.filter((d) => d.taken).length;
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const sender = state.caregivers.find((c) => c.id === senderId) ?? state.caregivers[0];

  const pickMedia = async (file: File | undefined, kind: "photo" | "video") => {
    if (!file) return;
    setSent(false);
    if (file.size > MAX_BYTES) {
      setMediaError(
        kind === "video"
          ? "That clip is a bit large. Please share a short video under 4 MB."
          : "That photo is a bit large. Please pick one under 4 MB.",
      );
      return;
    }
    try {
      const url = await readFileAsDataUrl(file);
      setMediaError(null);
      if (kind === "photo") setPhoto(url);
      else setVideo(url);
    } catch {
      setMediaError("Sorry, that file could not be read. Try another one.");
    }
  };

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
        <h2 className="text-2xl font-semibold">Care team</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {state.caregivers.map((c) => (
            <li key={c.id} className="rounded-2xl bg-secondary px-5 py-4">
              <p className="text-xl font-semibold">{c.name}</p>
              <p className="text-base text-muted-foreground">
                {c.relation}
                {c.phone ? ` · ${c.phone}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </BigCard>

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
              className="flex items-center justify-between gap-4 rounded-2xl bg-secondary px-5 py-4 text-lg"
            >
              <span className="min-w-0 break-words">
                {d.pill.name} · {timeLabel[d.time]}
              </span>
              <span className="shrink-0 font-semibold">{d.taken ? "Taken" : "Still waiting"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base text-muted-foreground">
          Animo shares only whether a dose was logged, never photos, location or conversations.
        </p>
      </BigCard>

      <BigCard className="mt-5">
        <h2 className="text-2xl font-semibold">Send some encouragement</h2>
        <p className="mt-3 text-lg text-muted-foreground">Who's writing?</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {state.caregivers.map((c) => {
            const active = sender?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSenderId(c.id);
                  setSent(false);
                }}
                className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold ${active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}
              >
                {c.name}
                <span className="block text-sm font-normal opacity-80">{c.relation}</span>
              </button>
            );
          })}
        </div>
        <label htmlFor="note" className="sr-only">
          Your message
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="The tulips are blooming, call me after breakfast?"
          className="mt-3 w-full rounded-2xl border-2 border-input bg-background p-5 text-xl"
        />
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          capture="user"
          className="sr-only"
          onChange={(e) => {
            void pickMedia(e.target.files?.[0], "photo");
            e.target.value = "";
          }}
        />
        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          capture="user"
          className="sr-only"
          onChange={(e) => {
            void pickMedia(e.target.files?.[0], "video");
            e.target.value = "";
          }}
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <BigButton tone="soft" icon={<Camera className="size-7" />} onClick={() => photoRef.current?.click()}>
            {photo ? "Change selfie" : "Add a selfie or photo"}
          </BigButton>
          <BigButton tone="soft" icon={<Video className="size-7" />} onClick={() => videoRef.current?.click()}>
            {video ? "Change video" : "Add a short video"}
          </BigButton>
        </div>

        {mediaError && (
          <p className="mt-3 text-lg text-muted-foreground" role="status">
            {mediaError}
          </p>
        )}

        {(photo || video) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {photo && (
              <figure className="relative overflow-hidden rounded-2xl bg-secondary">
                <img src={photo} alt="Photo you are about to send" className="w-full" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                  className="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full bg-background text-foreground shadow"
                >
                  <X className="size-6" />
                </button>
              </figure>
            )}
            {video && (
              <figure className="relative overflow-hidden rounded-2xl bg-secondary">
                <video src={video} controls playsInline className="w-full" />
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  aria-label="Remove video"
                  className="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full bg-background text-foreground shadow"
                >
                  <X className="size-6" />
                </button>
              </figure>
            )}
          </div>
        )}

        <div className="mt-4">
          <BigButton
            icon={<Send className="size-7" />}
            onClick={() => {
              if (!note.trim() && !photo && !video) return;
              try {
                update((s) => ({
                  ...s,
                  points: s.points + 5,
                  messages: [
                    {
                      id: uid(),
                      from: sender ? `${sender.name} (${sender.relation.toLowerCase()})` : `${s.caregiverName} (family)`,
                      text: note.trim(),
                      ...(photo ? { photo } : {}),
                      ...(video ? { video } : {}),
                      at: Date.now(),
                    },
                    ...s.messages,
                  ],
                }));
              } catch {
                setMediaError("There wasn't room to save that. Try a smaller photo or clip.");
                return;
              }
              setNote("");
              setPhoto(null);
              setVideo(null);
              setMediaError(null);
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
