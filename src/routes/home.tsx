import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  Flower2,
  Heart,
  MessageCircle,
  Pill,
  Settings as SettingsIcon,
  Sparkles,
  Users,
} from "lucide-react";
import { Companion } from "@/components/Companion";
import { BigLink } from "@/components/BigButton";
import { activeCaregiver, companionCopy, companionState, dueToday, streak, useAnimo } from "@/lib/animo";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home | Animo" },
      { name: "description", content: "Your day at a glance: today's medicines, your garden, and messages from family." },
      { property: "og:title", content: "Home | Animo" },
      { property: "og:description", content: "Today's medicines, your garden companion, and family messages." },
    ],
  }),
  component: Home,
});

function Home() {
  const { state, hydrated } = useAnimo();
  const isCaregiver = hydrated && state.role === "caregiver";
  const due = dueToday(state);
  const left = due.filter((d) => !d.taken).length;
  const cs = companionState(state);
  const unread = state.messages.filter((m) => !m.read).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <main className="min-h-screen pb-16" style={{ background: "var(--gradient-sky)" }}>
      <div className="mx-auto w-full max-w-2xl px-5 pt-8">
        <p className="text-xl text-muted-foreground">{hydrated ? greeting : "Hello"},</p>

        <h1 className="break-words text-4xl font-semibold">
          {hydrated ? (isCaregiver ? activeCaregiver(state).name : state.name) : "Friend"}
        </h1>
        {isCaregiver && (
          <p className="mt-1 break-words text-lg text-muted-foreground">Helping {state.name}</p>
        )}

        <section className="mt-6 rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
          <Companion state={cs} size={240} className="mx-auto" />
          <h2 className="text-2xl font-semibold">
            {isCaregiver ? `${state.name}'s garden` : companionCopy[cs].title}
          </h2>
          <p className="mt-1 text-lg text-muted-foreground">
            {isCaregiver
              ? left === 0
                ? "Everything for today is logged."
                : `${left} ${left === 1 ? "medicine is" : "medicines are"} still open today.`
              : left === 0
                ? "Everything for today is done. Lovely."
                : `${left} ${left === 1 ? "medicine is" : "medicines are"} waiting whenever you're ready.`}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-base font-semibold text-secondary-foreground">
            <Sparkles aria-hidden className="size-5" />
            {streak(state)} day{streak(state) === 1 ? "" : "s"} together · {state.points} points
          </p>
        </section>

        <nav className="mt-6 space-y-4" aria-label="Main">
          {isCaregiver ? (
            <>
              <BigLink
                to="/caregiver"
                tone="primary"
                icon={<Users className="size-9" />}
                hint="Adherence and send a note"
              >
                Caregiver view
              </BigLink>
              <BigLink to="/medicines" icon={<Pill className="size-8" />} hint="What is due today">
                Today's medicines
              </BigLink>
              <BigLink to="/add-pill" icon={<Pill className="size-8" />} hint="Register a photo and details">
                Add a pill
              </BigLink>
              <BigLink to="/rewards" icon={<Sparkles className="size-8" />} hint="Milestones together">
                Milestones
              </BigLink>
              <BigLink to="/companion" icon={<Flower2 className="size-8" />} hint="See how the garden looks">
                Visit garden
              </BigLink>
            </>
          ) : (
            <>
              <BigLink to="/reminder" tone="primary" icon={<Camera className="size-9" />} hint={`${left} left today`}>
                Take today's medicine
              </BigLink>
              <BigLink to="/medicines" icon={<Pill className="size-8" />} hint="See your day">
                Today's medicines
              </BigLink>
              <BigLink to="/companion" icon={<Flower2 className="size-8" />} hint="Say hello to your garden">
                Visit companion
              </BigLink>
              <BigLink to="/chat" icon={<MessageCircle className="size-8" />} hint="A friendly chat, never medical advice">
                Talk to Animo
              </BigLink>
              <BigLink
                to="/family"
                tone="accent"
                icon={<Heart className="size-8" />}
                hint={unread ? `${unread} new note${unread === 1 ? "" : "s"}` : "Notes and photos"}
              >
                Family messages
              </BigLink>
              <BigLink to="/rewards" icon={<Sparkles className="size-8" />} hint="Your milestones">
                Milestones
              </BigLink>
              <BigLink to="/add-pill" icon={<Pill className="size-8" />} hint="Register a photo and details">
                Add a pill
              </BigLink>
            </>
          )}
          <BigLink to="/settings" icon={<SettingsIcon className="size-8" />} hint="Text size, voice, account">
            Settings
          </BigLink>
        </nav>
      </div>
    </main>
  );
}
