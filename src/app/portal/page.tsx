import Link from "next/link";
import AppShell from "@/components/app/AppShell";
import { ArrowRight, Logo, ShieldCheck } from "@/components/site/icons";
import { ButtonLink } from "@/components/site/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Client portal" };

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticated client → real portal shell.
  if (user) {
    const role = (user.user_metadata?.role as string) ?? "patient";
    const name =
      (user.user_metadata?.display_name as string) ||
      (user.email ?? "").split("@")[0];
    return (
      <AppShell name={name} email={user.email ?? ""} role={role}>
        <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-sm text-sage">
          <ShieldCheck className="h-4 w-4" />
          Signed in · session verified
        </p>

        <h1 className="mt-6 font-display text-4xl font-semibold text-ink">
          Hello, {name}.
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Signed in as{" "}
          <span className="font-medium text-ink">{user.email}</span> ·{" "}
          <span className="font-medium capitalize text-ink">{role}</span>.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "Next: upcoming appointments",
              b: "Your visits pulled from Supabase, visible only to you.",
            },
            {
              t: "Next: secure messaging & billing",
              b: "Private threads with your therapist and invoice history.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border border-hairline bg-card p-6"
            >
              <p className="font-semibold text-ink">{c.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.b}</p>
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

  // Public / unauthenticated → invite to sign in.
  return (
    <main className="grid flex-1 place-items-center px-5 py-20">
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-ink"
          aria-label="SageWell home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <Logo className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-semibold">SageWell</span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-semibold text-ink">
          Your care, in one place
        </h1>
        <p className="mt-3 text-ink-soft">
          Sign in to view your appointments, messages and billing.
        </p>

        <ButtonLink href="/login" className="group mt-8">
          Sign in to your portal
          <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </div>
    </main>
  );
}
