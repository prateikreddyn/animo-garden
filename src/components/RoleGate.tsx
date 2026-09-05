import { Link } from "@tanstack/react-router";
import { AppShell, BigCard } from "@/components/AppShell";
import { useAnimo, type AccountRole } from "@/lib/animo";

/**
 * Shows a gentle notice when the current on-device account is not the one
 * this page belongs to, with a one tap way to switch.
 */
export function RoleGate({ allow, children }: { allow: AccountRole; children: React.ReactNode }) {
  const { state, update, hydrated } = useAnimo();

  if (!hydrated) return null;
  if (state.role === allow) return <>{children}</>;

  const forCaregiver = allow === "caregiver";

  return (
    <AppShell
      title={forCaregiver ? "This page is for helpers" : "This page is for the person taking medicines"}
      subtitle="You can switch accounts whenever you like."
      back="/home"
    >
      <BigCard className="space-y-5">
        <p className="text-xl leading-relaxed">
          {forCaregiver
            ? "The caregiver view lives in the helper account, where family can follow the week and send a note."
            : "Family messages live in the account of the person taking the medicines, so their notes stay private."}
        </p>
        <button
          type="button"
          onClick={() => update((s) => ({ ...s, role: allow }))}
          className="flex min-h-20 w-full items-center justify-center rounded-3xl bg-primary px-6 text-2xl font-semibold text-primary-foreground"
        >
          {forCaregiver ? "Switch to helper account" : "Switch to my account"}
        </button>
        <Link
          to="/home"
          className="flex min-h-20 w-full items-center justify-center rounded-3xl border-2 border-input px-6 text-2xl font-semibold"
        >
          Back home
        </Link>
      </BigCard>
    </AppShell>
  );
}
