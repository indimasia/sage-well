import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import LocalTime from "@/components/app/LocalTime";
import { CalendarDays, FileText, MapPin, Video } from "@/components/site/icons";
import { getCurrentUser, getPatientAppointments } from "@/lib/queries";

export const metadata = { title: "Session history" };

export default async function PortalHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const appts = await getPatientAppointments();
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const past = appts
    .filter((a) => a.status !== "upcoming" || +new Date(a.start_time) < now)
    .sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time));

  const statusStyle: Record<string, string> = {
    upcoming: "bg-sage-soft text-sage",
    completed: "bg-brand-50 text-brand-600",
    cancelled: "bg-coral-soft text-coral",
  };

  return (
    <AppShell name={user.name} email={user.email} role={user.role}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand">
          <CalendarDays className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Session history
          </h1>
          <p className="text-ink-soft">
            {past.length} past {past.length === 1 ? "session" : "sessions"}.
          </p>
        </div>
      </div>

      {past.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-hairline bg-card p-8 text-center text-ink-soft">
          No past sessions yet.{" "}
          <Link href="/book" className="font-medium text-brand underline">
            Book your first visit
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-card">
          {past.map((a, i) => (
            <Link
              key={a.id}
              href={`/session/${a.id}`}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-sunk/50 ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold uppercase text-brand">
                {(a.therapist?.name ?? "T").replace(/^Dr\.?\s*/, "").slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {a.therapist?.name ?? "Therapist"}
                </p>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-ink-soft">
                  <span>{a.reason || "Session"}</span>
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
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-ink">
                  <LocalTime iso={a.start_time} mode="date" />
                </p>
                <p className="text-xs text-ink-faint">
                  <LocalTime iso={a.start_time} mode="time" />
                </p>
              </div>
              {a.status === "completed" && (
                <span className="hidden items-center gap-1 text-xs text-ink-faint md:inline-flex">
                  <FileText className="h-3.5 w-3.5" />
                  View
                </span>
              )}
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle[a.status]}`}
              >
                {a.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
