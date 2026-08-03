import Link from "next/link";
import LocalTime from "@/components/app/LocalTime";
import { CalendarDays, FileText, Users } from "@/components/site/icons";
import { getTherapistAppointments } from "@/lib/queries";
import type { AppointmentWithPatient } from "@/lib/types";

export const metadata = { title: "Clients" };

type Client = {
  id: string;
  name: string;
  sessions: AppointmentWithPatient[];
};

export default async function ClientsPage() {
  const appts = await getTherapistAppointments();
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  // Group appointments by patient into a client list.
  const byClient = new Map<string, Client>();
  for (const a of appts) {
    const id = a.patient_id;
    if (!byClient.has(id)) {
      byClient.set(id, {
        id,
        name: a.patient?.name ?? "Client",
        sessions: [],
      });
    }
    byClient.get(id)!.sessions.push(a);
  }

  const clients = [...byClient.values()]
    .map((c) => ({
      ...c,
      sessions: c.sessions.sort(
        (x, y) => +new Date(y.start_time) - +new Date(x.start_time),
      ),
    }))
    .sort(
      (a, b) =>
        +new Date(b.sessions[0]?.start_time ?? 0) -
        +new Date(a.sessions[0]?.start_time ?? 0),
    );

  const statusStyle: Record<string, string> = {
    upcoming: "bg-sage-soft text-sage",
    completed: "bg-brand-50 text-brand-600",
    cancelled: "bg-coral-soft text-coral",
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand">
          <Users className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Clients
          </h1>
          <p className="text-ink-soft">
            {clients.length} {clients.length === 1 ? "client" : "clients"} · full
            session history
          </p>
        </div>
      </div>

      {clients.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-hairline bg-card p-8 text-center text-ink-soft">
          No clients yet. Booked sessions will appear here.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-5">
        {clients.map((c) => {
          const past = c.sessions.filter(
            (s) => s.status !== "upcoming" || +new Date(s.start_time) < now,
          );
          const upcoming = c.sessions.length - past.length;
          return (
            <section
              key={c.id}
              className="overflow-hidden rounded-2xl border border-hairline bg-card"
            >
              {/* Client header */}
              <div className="flex flex-wrap items-center gap-4 border-b border-hairline p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-lg font-semibold text-brand">
                  {c.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{c.name}</p>
                  <p className="text-sm text-ink-soft">
                    {c.sessions.length} total · {past.length} completed ·{" "}
                    {upcoming} upcoming
                  </p>
                </div>
              </div>

              {/* Session history */}
              <div className="divide-y divide-hairline/70">
                <p className="flex items-center gap-2 px-5 pt-4 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  <CalendarDays className="h-4 w-4" />
                  Session history
                </p>
                {c.sessions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/session/${s.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-paper-sunk/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {s.reason || "Session"}
                      </p>
                      <p className="text-xs text-ink-faint">
                        <LocalTime iso={s.start_time} mode="date" /> ·{" "}
                        <LocalTime iso={s.start_time} mode="time" /> ·{" "}
                        <span className="capitalize">
                          {s.visit_type.replace("_", "-")}
                        </span>
                      </p>
                    </div>
                    {s.status === "completed" && (
                      <span className="hidden items-center gap-1 text-xs text-ink-faint sm:inline-flex">
                        <FileText className="h-3.5 w-3.5" />
                        Notes
                      </span>
                    )}
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
