import Link from "next/link";
import AppShell from "@/components/app/AppShell";
import BillingHistory from "@/components/app/BillingHistory";
import JoinButton from "@/components/app/JoinButton";
import LocalTime from "@/components/app/LocalTime";
import PatientChatButton from "@/components/app/PatientChatButton";
import {
  ArrowRight,
  Clock,
  Logo,
  MapPin,
  Plus,
  ShieldCheck,
  Video,
} from "@/components/site/icons";
import { ButtonLink } from "@/components/site/ui";
import { getCurrentUser, getPatientAppointments } from "@/lib/queries";

export const metadata = { title: "Client portal" };

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string }>;
}) {
  const user = await getCurrentUser();
  const { booked } = await searchParams;

  // Public / unauthenticated → invite to sign in.
  if (!user) {
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

  const appts = await getPatientAppointments();
  // Server Component renders once per request — a live clock is correct here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = appts
    .filter(
      (a) =>
        a.status === "upcoming" &&
        !a.ended_at &&
        (+new Date(a.start_time) >= now || Boolean(a.started_at)),
    )
    .sort((a, b) => {
      if (a.started_at && !b.started_at) return -1;
      if (!a.started_at && b.started_at) return 1;
      return +new Date(a.start_time) - +new Date(b.start_time);
    });
  const history = appts
    .filter((a) => Boolean(a.ended_at))
    .sort(
      (a, b) =>
        +new Date(b.started_at ?? b.start_time) -
        +new Date(a.started_at ?? a.start_time),
    );
  const billing = [...appts].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );

  return (
    <AppShell name={user.name} email={user.email} role={user.role}>
      {booked && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-lg border border-sage/40 bg-sage-soft px-4 py-2.5 text-sm text-sage">
          <ShieldCheck className="h-4 w-4" />
          Booking confirmed — your appointment is scheduled.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Hello, {user.name}.
        </h1>
        <ButtonLink href="/book" className="group">
          <Plus className="h-[18px] w-[18px]" />
          Book a visit
        </ButtonLink>
      </div>

      {/* Upcoming appointments */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          Upcoming appointments
        </h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {upcoming.length === 0 && (
            <div className="rounded-xl border border-dashed border-hairline bg-card p-6 text-sm text-ink-soft">
              No upcoming visits.{" "}
              <Link href="/book" className="font-medium text-brand underline">
                Book one now
              </Link>
              .
            </div>
          )}
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-hairline bg-card p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold uppercase text-brand">
                {(a.therapist?.name ?? "T").replace(/^Dr\.?\s*/, "").slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {a.therapist?.name ?? "Therapist"}
                </p>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-ink-soft">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <LocalTime iso={a.start_time} mode="day-time" />
                  </span>
                  <span className="inline-flex items-center gap-1 capitalize">
                    {a.visit_type === "video" ? (
                      <Video className="h-3.5 w-3.5" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                    {a.visit_type.replace("_", "-")}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <PatientChatButton therapistId={a.therapist_id} />
                {a.visit_type === "video" && (
                  <JoinButton
                    appointmentId={a.id}
                    href={`/session/${a.id}`}
                    startIso={a.start_time}
                    viewerRole="patient"
                    startedAt={a.started_at}
                    endedAt={a.ended_at}
                    compact
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed video visit records */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Session history
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Completed call times and therapist notes.
        </p>
        <div className="mt-4 space-y-3">
          {history.length === 0 && (
            <div className="rounded-2xl border border-dashed border-hairline bg-card p-6 text-sm text-ink-soft">
              Completed video visits will appear here after your therapist ends the call.
            </div>
          )}
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-hairline bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-ink">
                    {item.therapist?.name ?? "Therapist"}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    {item.reason || "Therapy session"}
                  </p>
                </div>
                <Link
                  href={`/session/${item.id}`}
                  className="rounded-full border border-brand-100 bg-brand-50 px-3.5 py-2 text-sm font-medium text-brand hover:bg-brand-100"
                >
                  View record
                </Link>
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-paper-sunk/60 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-faint">
                    Call started
                  </dt>
                  <dd className="mt-1 text-ink">
                    <LocalTime iso={item.started_at ?? item.start_time} mode="day-time" />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-faint">
                    Call ended
                  </dt>
                  <dd className="mt-1 text-ink">
                    {item.ended_at ? (
                      <LocalTime iso={item.ended_at} mode="day-time" />
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
              {item.note ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["Subjective", item.note.subjective],
                      ["Objective", item.note.objective],
                      ["Assessment", item.note.assessment],
                      ["Plan", item.note.plan],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        {label}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink-faint">
                  Therapist did not add notes for this session.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Billing */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Billing history
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Select any row for appointment and payment details.
        </p>
        <div className="mt-4">
          <BillingHistory appointments={billing} />
        </div>
      </section>
    </AppShell>
  );
}
