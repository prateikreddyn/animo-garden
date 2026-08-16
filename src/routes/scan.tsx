import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, CheckCircle2, HelpCircle, Mic } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { Companion } from "@/components/Companion";
import { VoiceConfirm } from "@/components/VoiceConfirm";
import {
  MATCH_THRESHOLD,
  compareFingerprints,
  fingerprintFromCanvas,
  speak,
  timeLabel,
  todayKey,
  uid,
  useAnimo,
  type TimeOfDay,
} from "@/lib/animo";

type Search = { pillId: string; time: TimeOfDay; mode?: "voice" | undefined };

export const Route = createFileRoute("/scan")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    pillId: String(search["pillId"] ?? ""),
    time: (["morning", "afternoon", "evening"].includes(String(search["time"]))
      ? String(search["time"])
      : "morning") as TimeOfDay,
    mode: search["mode"] === "voice" ? "voice" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Check your pill — Animo" },
      { name: "description", content: "Hold your pill up to the camera so Animo can check it's the right one." },
      { property: "og:title", content: "Check your pill — Animo" },
      { property: "og:description", content: "A calm camera check before you take your dose." },
    ],
  }),
  component: Scan,
});

type Stage = "capture" | "match" | "mismatch" | "done";

function Scan() {
  const { pillId, time, mode } = Route.useSearch();
  const { state, update } = useAnimo();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<Stage>(mode === "voice" ? "match" : "capture");
  const [shot, setShot] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [camError, setCamError] = useState(false);

  const pill = state.pills.find((p) => p.id === pillId) ?? state.pills[0];

  const stopCam = useCallback(() => {
    const v = videoRef.current;
    const s = v?.srcObject as MediaStream | null;
    s?.getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
  }, []);

  useEffect(() => {
    if (stage !== "capture") return;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play();
        }
      })
      .catch(() => setCamError(true));
    return () => {
      cancelled = true;
      stopCam();
    };
  }, [stage, stopCam]);

  const evaluate = useCallback(
    async (canvas: HTMLCanvasElement) => {
      setShot(canvas.toDataURL("image/jpeg", 0.7));
      const fp = await fingerprintFromCanvas(canvas);
      const ref = pill?.fingerprint;
      // No reference photo registered yet: treat as a match and offer to save it.
      const sim = ref ? compareFingerprints(fp, ref) : 1;
      setScore(sim);
      stopCam();
      if (sim >= MATCH_THRESHOLD) {
        setStage("match");
        speak(`This is your ${pill?.name}, your ${timeLabel[time].toLowerCase()} dose.`, state.voiceOn);
      } else {
        setStage("mismatch");
      }
    },
    [pill, state.voiceOn, stopCam, time],
  );

  const capture = useCallback(async () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    c.width = 256;
    c.height = 256;
    c.getContext("2d")!.drawImage(v, 0, 0, 256, 256);
    await evaluate(c);
  }, [evaluate]);

  const confirmTaken = () => {
    update((s) => ({
      ...s,
      points: s.points + 10,
      logs: [
        ...s.logs,
        {
          id: uid(),
          pillId: pill!.id,
          time,
          date: todayKey(),
          method: mode === "voice" ? "voice" : "scan",
          at: Date.now(),
        },
      ],
    }));
    speak(`Wonderful. You've taken your ${pill?.name}.`, state.voiceOn);
    setStage("done");
  };

  if (!pill) {
    return (
      <AppShell title="No pill selected" back="/medicines">
        <BigCard>Please pick a medicine from today's list.</BigCard>
      </AppShell>
    );
  }

  if (stage === "done") {
    return (
      <AppShell title={`You've taken your ${pill.name}`} back={null} subtitle="That's all it takes. Well done.">
        <BigCard className="text-center">
          <Companion state="celebrating" size={260} className="mx-auto" />
          <p className="text-xl">
            Your garden is glowing, and {state.caregiverName} will see a little note that today's{" "}
            {timeLabel[time].toLowerCase()} dose is done.
          </p>
          <div className="mt-6 space-y-4">
            <BigButton onClick={() => navigate({ to: "/companion" })}>Visit your garden</BigButton>
            <Link
              to="/medicines"
              className="flex min-h-16 w-full items-center justify-center rounded-3xl border border-border bg-card text-xl font-semibold"
            >
              Back to today's list
            </Link>
          </div>
        </BigCard>
      </AppShell>
    );
  }

  if (stage === "mismatch") {
    return (
      <AppShell title="Let's double-check" back="/medicines" subtitle="No harm done — this happens often.">
        <BigCard className="space-y-6">
          <div className="flex items-start gap-4 rounded-3xl bg-secondary p-5">
            <HelpCircle aria-hidden className="size-10 shrink-0 text-primary" />
            <p className="text-xl">
              This one doesn't look quite like the {pill.name} we have on file. It might just be the light, or it
              might be a different pill. A quick word with {state.caregiverName} or your pharmacist will sort it out.
            </p>
          </div>
          {shot && (
            <img src={shot} alt="The pill you just photographed" className="mx-auto w-48 rounded-2xl" />
          )}
          <BigButton
            onClick={() => {
              setStage("capture");
              setShot(null);
            }}
          >
            Try the photo again
          </BigButton>
          <BigButton tone="soft" onClick={() => setStage("match")}>
            I'm sure it's the right pill
          </BigButton>
          <Link
            to="/family"
            className="flex min-h-16 w-full items-center justify-center rounded-3xl bg-accent text-xl font-semibold text-accent-foreground"
          >
            Ask {state.caregiverName}
          </Link>
        </BigCard>
      </AppShell>
    );
  }

  if (stage === "match") {
    return (
      <AppShell title="That looks right" back="/medicines">
        <BigCard className="text-center">
          <CheckCircle2 aria-hidden className="mx-auto size-20 text-primary" />
          <h2 className="mt-3 text-3xl font-semibold">{pill.name}</h2>
          <p className="mt-2 text-xl text-muted-foreground">
            Your {timeLabel[time].toLowerCase()} dose · {pill.dose}
          </p>
          {mode !== "voice" && score > 0 && (
            <p className="mt-2 text-base text-muted-foreground">Photo check: {Math.round(score * 100)}% alike</p>
          )}

          {(mode === "voice" || voiceOpen) && (
            <div className="mt-6 text-left">
              <VoiceConfirm
                autoStart={false}
                question={`Have you taken your ${pill.name}?`}
                onYes={confirmTaken}
                onNo={() => navigate({ to: "/medicines" })}
              />
            </div>
          )}

          <div className="mt-8 space-y-4">
            <BigButton onClick={confirmTaken} icon={<CheckCircle2 className="size-9" />}>
              Yes, taking it now
            </BigButton>
            {mode !== "voice" && !voiceOpen && (
              <BigButton
                tone="soft"
                onClick={() => setVoiceOpen(true)}
                icon={<Mic className="size-8" />}
                hint="For tired days"
              >
                Say it out loud instead
              </BigButton>
            )}
            <Link
              to="/medicines"
              className="flex min-h-16 w-full items-center justify-center rounded-3xl text-xl font-semibold text-muted-foreground"
            >
              Not just yet
            </Link>
          </div>
        </BigCard>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Hold up your ${pill.name}`} back="/medicines" subtitle="Anywhere in the frame is fine.">
      <BigCard className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-muted" style={{ aspectRatio: "1 / 1" }}>
          <video ref={videoRef} playsInline muted className="size-full object-cover" />
          {camError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xl">
              The camera isn't available right now. You can still confirm by voice below.
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <BigButton onClick={capture} disabled={camError} icon={<Camera className="size-9" />}>
          Take the photo
        </BigButton>
        <label className="flex min-h-20 w-full cursor-pointer items-center justify-center rounded-3xl border border-border bg-card px-6 text-xl font-semibold">
          Choose a photo instead
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const img = new Image();
              img.src = URL.createObjectURL(f);
              await img.decode();
              const c = canvasRef.current!;
              c.width = 256;
              c.height = 256;
              c.getContext("2d")!.drawImage(img, 0, 0, 256, 256);
              await evaluate(c);
            }}
          />
        </label>
        <BigButton tone="accent" onClick={() => setStage("match")} icon={<Mic className="size-8" />} hint="No camera needed">
          Confirm by voice instead
        </BigButton>
      </BigCard>
    </AppShell>
  );
}
