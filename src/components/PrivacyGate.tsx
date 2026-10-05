import { ShieldCheck } from "lucide-react";
import { useAnimo } from "@/lib/animo";

export const privacyPoints = [
  "Everything you enter, like names, medicines, photos and messages, is saved only on this device.",
  "Pill photos are used only to check you have the right pill. They are never sent anywhere.",
  "Voice is used only while you speak to confirm a dose. Nothing is recorded or kept.",
  "We do not sell, share, or show ads with your information.",
  "Animo never gives medical advice. Your doctor and pharmacist always come first.",
  "You can remove people and information anytime in Settings, or clear it by removing the app.",
];

export function PrivacyGate() {
  const { state, update, hydrated } = useAnimo();
  if (!hydrated || state.privacyAccepted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95 px-5 py-8 backdrop-blur"
    >
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]">
        <ShieldCheck aria-hidden className="size-12 text-primary" />
        <h1 id="privacy-title" className="mt-3 break-words text-4xl font-semibold text-foreground">
          Your privacy
        </h1>
        <p className="mt-2 break-words text-xl text-muted-foreground">
          Before we begin, here is how Animo looks after your information.
        </p>
        <ul className="mt-6 space-y-4 text-lg text-foreground">
          {privacyPoints.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden className="mt-2 size-3 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0 break-words">{p}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => update((s) => ({ ...s, privacyAccepted: true }))}
          className="mt-8 flex min-h-20 w-full items-center justify-center rounded-3xl bg-primary px-6 text-2xl font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
        >
          I understand, continue
        </button>
      </div>
    </div>
  );
}
