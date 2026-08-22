import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell, BigCard } from "@/components/AppShell";
import { Companion } from "@/components/Companion";
import { companionState, dueToday, speak, streak, uid, useAnimo, type AnimoState } from "@/lib/animo";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Talk to Animo | Animo" },
      { name: "description", content: "A friendly chat with your companion: reminders, encouragement and small talk, never medical advice." },
      { property: "og:title", content: "Talk to Animo | Animo" },
      { property: "og:description", content: "Warm small talk and gentle reminders, never medical advice." },
    ],
  }),
  component: Chat,
});

const MEDICAL = /(dose|dosage|side effect|symptom|pain|blood pressure|sugar|should i take|prescri|diagnos|doctor|stop taking|double)/i;

function reply(text: string, s: AnimoState): string {
  const left = dueToday(s).filter((d) => !d.taken);
  if (MEDICAL.test(text)) {
    return "That's a question for a real expert, and I'd rather you get it right than get it from me. Your pharmacist or doctor can answer it properly, would you like to call them, or ask " + s.caregiverName + " to help?";
  }
  if (/lonely|alone|sad|down|miss/i.test(text)) {
    return "Thank you for telling me. I'm glad to sit here with you. When you feel up to it, a short call with " + s.caregiverName + " might feel even better than talking to me.";
  }
  if (/pill|medicine|medication|take/i.test(text)) {
    return left.length
      ? `You have ${left.length} left today, the next one is your ${left[0]!.pill.name}. No rush; I'll be here when you're ready.`
      : "Everything for today is taken care of. Your garden is looking lovely because of it.";
  }
  if (/garden|plant|flower|you/i.test(text)) {
    return "The garden's doing well. It brightens a little every time you visit, and it never minds waiting.";
  }
  if (/thank|good|great|fine|well|happy/i.test(text)) {
    return `That's lovely to hear. You've kept things going ${streak(s)} day${streak(s) === 1 ? "" : "s"} in a row now.`;
  }
  return "I like hearing from you. Tell me about your morning, or ask me what's left to take today.";
}

function Chat() {
  const { state, update } = useAnimo();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chat.length]);

  const send = (value: string) => {
    const t = value.trim();
    if (!t) return;
    const answer = reply(t, state);
    update((s) => ({
      ...s,
      chat: [
        ...s.chat,
        { id: uid(), role: "user", text: t, at: Date.now() },
        { id: uid(), role: "animo", text: answer, at: Date.now() + 1 },
      ],
    }));
    speak(answer, state.voiceOn);
    setText("");
  };

  return (
    <AppShell title="Talk to Animo" subtitle="Company and encouragement, never medical advice.">
      <BigCard className="mb-5 flex items-center gap-5">
        <Companion state={companionState(state)} size={110} />
        <p className="text-lg text-muted-foreground">
          I can remind, encourage and chat. For anything about your health, I'll point you to a real person.
        </p>
      </BigCard>

      <div className="space-y-4" role="log" aria-live="polite">
        {state.chat.map((m) => (
          <div
            key={m.id}
            className={`max-w-[92%] rounded-3xl p-5 text-xl leading-relaxed shadow-[var(--shadow-soft)] ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-card text-card-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {["What's left today?", "How's the garden?", "I'm feeling a bit lonely"].map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="min-h-14 rounded-2xl border border-border bg-card px-5 text-lg font-semibold"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className="mt-5 flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <label htmlFor="msg" className="sr-only">
          Write a message to Animo
        </label>
        <input
          id="msg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say hello…"
          className="min-h-16 flex-1 rounded-2xl border-2 border-input bg-background px-5 text-xl"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex min-h-16 min-w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
        >
          <Send aria-hidden className="size-7" />
        </button>
      </form>
    </AppShell>
  );
}
