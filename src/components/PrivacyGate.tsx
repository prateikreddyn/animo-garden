import { ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAnimo } from "@/lib/animo";
import policy from "@/content/privacy-policy.md?raw";

export function PrivacyPolicyText() {
  return (
    <div className="space-y-4 break-words text-lg text-foreground [&_a]:text-primary [&_a]:underline [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_hr]:border-border [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown>{policy}</ReactMarkdown>
    </div>
  );
}

export function PrivacyGate() {
  const { state, update, hydrated } = useAnimo();
  if (!hydrated || state.privacyAccepted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Privacy policy"
      className="fixed inset-0 z-50 flex flex-col bg-background/95 px-4 py-6 backdrop-blur"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]">
        <ShieldCheck aria-hidden className="size-12 shrink-0 text-primary" />
        <p className="mt-2 text-xl text-muted-foreground">
          Before we begin, please read how Animo looks after your information.
        </p>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border p-4">
          <PrivacyPolicyText />
        </div>
        <button
          type="button"
          onClick={() => update((s) => ({ ...s, privacyAccepted: true }))}
          className="mt-5 flex min-h-20 w-full shrink-0 items-center justify-center rounded-3xl bg-primary px-6 text-2xl font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
        >
          I agree, continue
        </button>
      </div>
    </div>
  );
}
