import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import {
  fingerprintFromDataUrl,
  timeLabel,
  uid,
  useAnimo,
  type TimeOfDay,
} from "@/lib/animo";

export const Route = createFileRoute("/add-pill")({
  head: () => ({
    meta: [
      { title: "Add a pill | Animo" },
      { name: "description", content: "Register a medicine with a reference photo and simple details so Animo can check it later." },
      { property: "og:title", content: "Add a pill | Animo" },
      { property: "og:description", content: "Register a medicine with a photo and simple details." },
    ],
  }),
  component: AddPill,
});

const ALL: TimeOfDay[] = ["morning", "afternoon", "evening"];

function AddPill() {
  const { update } = useAnimo();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [note, setNote] = useState("");
  const [times, setTimes] = useState<TimeOfDay[]>(["morning"]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    const fingerprint = photo ? await fingerprintFromDataUrl(photo) : undefined;
    update((s) => ({
      ...s,
      pills: [
        ...s.pills,
        {
          id: uid(),
          name: name.trim() || "New medicine",
          dose: dose.trim() || "One dose",
          note: note.trim(),
          times: times.length ? times : ["morning"],
          ...(photo ? { photo } : {}),
          ...(fingerprint ? { fingerprint } : {}),
        },
      ],
    }));
    navigate({ to: "/medicines" });
  };

  return (
    <AppShell title="Add a pill" subtitle="A photo now means Animo can check it every time.">
      <BigCard className="space-y-7">
        <div>
          <label htmlFor="pname" className="mb-2 block text-xl font-semibold">
            Name on the bottle
          </label>
          <input
            id="pname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl"
          />
        </div>
        <div>
          <label htmlFor="pdose" className="mb-2 block text-xl font-semibold">
            How much to take
          </label>
          <input
            id="pdose"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="10 mg, one tablet"
            className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-2xl placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <span className="mb-3 block text-xl font-semibold">When do you take it?</span>
          <div className="flex flex-wrap gap-3">
            {ALL.map((t) => {
              const on = times.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTimes((cur) => (on ? cur.filter((x) => x !== t) : [...cur, t]))}
                  className={`min-h-16 rounded-2xl px-6 text-xl font-semibold ${
                    on ? "bg-primary text-primary-foreground" : "border-2 border-input bg-background"
                  }`}
                >
                  {timeLabel[t]}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="pnote" className="mb-2 block text-xl font-semibold">
            Anything to remember (optional)
          </label>
          <input
            id="pnote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Small white round tablet"
            className="min-h-16 w-full rounded-2xl border-2 border-input bg-background px-5 text-xl placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <span className="mb-3 block text-xl font-semibold">A photo of the pill</span>
          {photo && <img src={photo} alt="Reference photo of this pill" className="mb-4 w-48 rounded-2xl" />}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => setPhoto(String(r.result));
              r.readAsDataURL(f);
            }}
          />
          <BigButton tone="soft" icon={<Camera className="size-8" />} onClick={() => fileRef.current?.click()}>
            {photo ? "Take a different photo" : "Take a photo"}
          </BigButton>
          <p className="mt-2 text-base text-muted-foreground">
            You can skip this | Animo will simply ask you to confirm by voice instead.
          </p>
        </div>

        <BigButton onClick={save}>Save this medicine</BigButton>
      </BigCard>
    </AppShell>
  );
}
