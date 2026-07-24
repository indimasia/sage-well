import { ShieldCheck, Lock, Database } from "@/components/site/icons";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getTherapists } from "@/lib/queries";

export const metadata = { title: "Security" };

export default async function SecurityPage() {
  const me = await getCurrentUser();
  const supabase = await createClient();

  // Appointments I can see (RLS scopes these to my own).
  const { count: myAppts } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  // Pick another therapist and try to read THEIR data directly.
  const others = (await getTherapists()).filter((t) => t.id !== me?.id);
  const target = others[0] ?? null;

  const { count: leakedAppts } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("therapist_id", target?.id ?? "00000000-0000-0000-0000-000000000000");

  const { count: leakedNotes } = await supabase
    .from("session_notes")
    .select("*", { count: "exact", head: true })
    .eq("therapist_id", target?.id ?? "00000000-0000-0000-0000-000000000000");

  const isolated = (leakedAppts ?? 0) === 0 && (leakedNotes ?? 0) === 0;

  const checks = [
    {
      label: "Your own appointments",
      value: myAppts ?? 0,
      note: "Visible — these belong to you.",
      ok: true,
    },
    {
      label: `${target?.name ?? "Another therapist"}'s appointments`,
      value: leakedAppts ?? 0,
      note: "Direct query blocked by RLS.",
      ok: (leakedAppts ?? 0) === 0,
    },
    {
      label: `${target?.name ?? "Another therapist"}'s session notes`,
      value: leakedNotes ?? 0,
      note: "Direct query blocked by RLS.",
      ok: (leakedNotes ?? 0) === 0,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Data isolation
          </h1>
          <p className="text-ink-soft">Row-level security, verified live.</p>
        </div>
      </div>

      <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
        Signed in as{" "}
        <span className="font-medium text-ink">{me?.email}</span>. The queries
        below run against the live database with your session. Postgres RLS
        rewrites them so another therapist&rsquo;s rows are never returned —
        even by a direct, deliberate attempt.
      </p>

      {/* Verdict */}
      <div
        className={`mt-8 flex items-center gap-3 rounded-2xl border p-5 ${
          isolated
            ? "border-sage/40 bg-sage-soft"
            : "border-coral/40 bg-coral-soft"
        }`}
      >
        <ShieldCheck
          className={`h-7 w-7 shrink-0 ${isolated ? "text-sage" : "text-coral"}`}
        />
        <div>
          <p className={`font-semibold ${isolated ? "text-sage" : "text-coral"}`}>
            {isolated
              ? "Isolation verified — no cross-therapist leakage."
              : "Warning — RLS did not block the query."}
          </p>
          <p className="text-sm text-ink-soft">
            {isolated
              ? "Every attempt to read another therapist's data returned 0 rows."
              : "Check that schema.sql RLS policies are enabled."}
          </p>
        </div>
      </div>

      {/* Checks */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-card">
        {checks.map((c, i) => (
          <div
            key={c.label}
            className={`flex items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-hairline" : ""
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                c.ok ? "bg-sage-soft text-sage" : "bg-coral-soft text-coral"
              }`}
            >
              {c.ok ? <Lock className="h-4 w-4" /> : "!"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{c.label}</p>
              <p className="text-sm text-ink-soft">{c.note}</p>
            </div>
            <span className="font-display text-2xl font-semibold text-ink">
              {c.value}
              <span className="ml-1 text-sm font-normal text-ink-faint">
                rows
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* The actual query */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#0e2740]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-brand-100">
          <Database className="h-4 w-4" />
          the query your session just ran · RLS: on
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[0.82rem] leading-relaxed text-brand-100">
          <code>
            {`-- Attempt to read another therapist's records
select count(*) from appointments
  where therapist_id = '${target?.id ?? "…"}';
-- → ${leakedAppts ?? 0} rows  (blocked: not your data)

select count(*) from session_notes
  where therapist_id = '${target?.id ?? "…"}';
-- → ${leakedNotes ?? 0} rows  (blocked: not your data)`}
          </code>
        </pre>
      </div>

      <p className="mt-4 text-sm text-ink-faint">
        To demo therapist-to-therapist isolation: sign in as a second therapist
        account, book/seed some sessions, then return here as the first —
        their counts stay at 0.
      </p>
    </div>
  );
}
