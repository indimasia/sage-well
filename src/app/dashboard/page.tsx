import Link from "next/link";
import JoinButton from "@/components/app/JoinButton";
import LocalTime from "@/components/app/LocalTime";
import { Clock, MapPin, MessageSquare, Video } from "@/components/site/icons";
import { fmtLongDate } from "@/lib/format";
import { getCurrentUser, getTherapistAppointments } from "@/lib/queries";
import type { AppointmentWithPatient } from "@/lib/types";

export const metadata = { title: "Dashboard" };

const WEEK = 7 * 86_400_000;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const appts = await getTherapistAppointments();
  // Server Component renders once per request — a live clock is correct here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const upcoming = appts
    .filter((a) => a.status === "upcoming" && +new Date(a.start_time) >= now)
    .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));
  const past = appts
    .filter((a) => a.status !== "upcoming" || +new Date(a.start_time) < now)
    .sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time));

  const next = upcoming[0];
  const thisWeek = appts.filter(
    (a) => Math.abs(+new Date(a.start_time) - now) <= WEEK,
  ).length;
  const completed = appts.filter((a) => a.status === "completed").length;

  const stats = [
    { k: "Upcoming", v: upcoming.length, s: "sessions" },
    { k: "This week", v: thisWeek, s: "on calendar" },
    { k: "Completed", v: completed, s: "all time" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <header>
        <p className="text-sm text-ink-faint">{fmtLongDate()}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Good day, {user?.name}.
        </h1>
      </header>

      {/* Next appointment hero */}
      {next ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/60">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Next session · <LocalTime iso={next.start_time} mode="day" />
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">
                {next.patient?.name ?? "Client"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <LocalTime iso={next.start_time} mode="time" /> ·{" "}
                  {next.duration_min} min
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  {next.visit_type === "video" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {next.visit_type.replace("_", "-")}
                </span>
                {next.reason && <span>· {next.reason}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <JoinButton
                href={`/session/${next.id}`}
                startIso={next.start_time}
                durationMin={next.duration_min}
              />
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-card px-5 py-3.5 text-[0.95rem] font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-brand"
              >
                <MessageSquare className="h-[18px] w-[18px]" />
                Message
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-hairline bg-card p-6 text-ink-soft">
          No upcoming sessions. Enjoy the calm.
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl border border-hairline bg-card p-4">
            <p className="text-[0.7rem] uppercase tracking-wide text-ink-faint">
              {s.k}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">
              {s.v}
            </p>
            <p className="text-xs text-ink-faint">{s.s}</p>
          </div>
        ))}
      </div>

      {/* Upcoming list */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Upcoming appointments
        </h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {upcoming.length === 0 && (
            <p className="rounded-xl border border-hairline bg-card p-5 text-sm text-ink-soft">
              Nothing scheduled yet.
            </p>
          )}
          {upcoming.map((a) => (
            <ApptRow key={a.id} appt={a} href={`/session/${a.id}`} />
          ))}
        </div>
      </section>

      {/* Past list */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">
            Past &amp; cancelled
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {past.slice(0, 12).map((a) => (
              <ApptRow key={a.id} appt={a} href={`/session/${a.id}`} muted />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ApptRow({
  appt,
  href,
  muted,
}: {
  appt: AppointmentWithPatient;
  href: string;
  muted?: boolean;
}) {
  const statusStyle: Record<string, string> = {
    upcoming: "bg-sage-soft text-sage",
    completed: "bg-brand-50 text-brand-600",
    cancelled: "bg-coral-soft text-coral",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-brand-200 ${
        muted ? "opacity-80" : ""
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold uppercase text-brand">
        {(appt.patient?.name ?? "C").slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">
          {appt.patient?.name ?? "Client"}
        </p>
        <p className="truncate text-sm text-ink-soft">
          {appt.reason || "Session"} ·{" "}
          <span className="capitalize">{appt.visit_type.replace("_", "-")}</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-ink">
          <LocalTime iso={appt.start_time} mode="day" />
        </p>
        <p className="text-xs text-ink-faint">
          <LocalTime iso={appt.start_time} mode="time" />
        </p>
      </div>
      <span
        className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:inline ${statusStyle[appt.status]}`}
      >
        {appt.status}
      </span>
    </Link>
  );
}
