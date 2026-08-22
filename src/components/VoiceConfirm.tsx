import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import { BigButton } from "@/components/BigButton";
import { matchesNo, matchesYes, useVoiceInput } from "@/lib/useVoiceInput";

/**
 * "Say it out loud" confirmation. Listens for a yes / not yet answer.
 * Always leaves a tap-friendly fallback visible.
 */
export function VoiceConfirm({
  question,
  onYes,
  onNo,
  autoStart = false,
}: {
  question: string;
  onYes: () => void;
  onNo?: () => void;
  autoStart?: boolean;
}) {
  const [heard, setHeard] = useState<"none" | "yes" | "no" | "unclear">("none");

  const { supported, status, transcript, start, stop } = useVoiceInput({
    onResult: (text, isFinal) => {
      if (matchesYes(text)) {
        setHeard("yes");
        stop();
        onYes();
      } else if (matchesNo(text)) {
        setHeard("no");
        stop();
        onNo?.();
      } else if (isFinal) {
        setHeard("unclear");
      }
    },
  });

  useEffect(() => {
    if (autoStart && supported) start();
  }, [autoStart, supported, start]);

  const listening = status === "listening";

  return (
    <div className="rounded-3xl bg-secondary p-5 text-center">
      <p className="text-xl font-semibold text-secondary-foreground">{question}</p>

      {!supported ? (
        <p className="mt-3 text-lg text-muted-foreground">
          This browser can't listen yet. Please use the button below instead, it does exactly the same thing.
        </p>
      ) : (
        <>
          <BigButton
            className="mt-4"
            tone={listening ? "primary" : "soft"}
            icon={listening ? <Mic className="size-9 animate-breathe" /> : <MicOff className="size-9" />}
            onClick={() => (listening ? stop() : start())}
            hint={listening ? 'Say "yes" or "not yet"' : "Tap, then speak"}
          >
            {listening ? "Listening…" : "Start listening"}
          </BigButton>

          <p aria-live="polite" className="mt-3 min-h-8 text-lg text-muted-foreground">
            {status === "denied"
              ? "Animo needs permission to use the microphone. You can allow it in your browser, or just tap below."
              : status === "error"
                ? "The microphone had a hiccup. Tap to try again, or use the button below."
                : heard === "unclear" && transcript
                  ? `I heard "${transcript}", try saying "yes" or "not yet".`
                  : transcript
                    ? `"${transcript}"`
                    : listening
                      ? "I'm listening…"
                      : ""}
          </p>
        </>
      )}
    </div>
  );
}
