import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { ShieldCheck } from "@/components/site/icons";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "therapist";
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
        Welcome back, {name}.
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        Signed in as{" "}
        <span className="font-medium text-ink">{user.email}</span> with the{" "}
        <span className="font-medium capitalize text-ink">{role}</span> role.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            t: "Next: caseload & appointments",
            b: "Real Supabase data pulled per-therapist, isolated by RLS.",
          },
          {
            t: "Next: booking & session notes",
            b: "Writable appointment rows and SOAP notes saved to Postgres.",
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
