import Link from "next/link";
import AppShell from "@/components/app/AppShell";
import Conversations from "@/components/app/Conversations";
import JoinButton from "@/components/app/JoinButton";
import LocalTime from "@/components/app/LocalTime";
import {
  ArrowRight,
  Clock,
  Logo,
  MapPin,
  MessageSquare,
  Plus,
  ShieldCheck,
  Video,
} from "@/components/site/icons";
import { ButtonLink } from "@/components/site/ui";
import {
  getConversations,
  getCurrentUser,
  getPatientAppointments,
} from "@/lib/queries";

export const metadata = { title: "Client portal" };

const invoices = [
  { id: "INV-1042", date: "Jun 12", amount: "$120.00", status: "Paid" },
  { id: "INV-1031", date: "May 29", amount: "$120.00", status: "Paid" },
  { id: "INV-1020", date: "May 15", amount: "$120.00", status: "Paid" },
];

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
  const conversations = await getConversations();
  // Server Component renders once per request — a live clock is correct here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = appts
    .filter((a) => a.status === "upcoming" && +new Date(a.start_time) >= now)
    .sort((a, b) => +new Date(a.start_time) - +new Date(b.start_time));

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
                <Link
                  href="#messages"
                  aria-label="Message your therapist"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-brand"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Link>
                <JoinButton
                  href={`/session/${a.id}`}
                  startIso={a.start_time}
                  durationMin={a.duration_min}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Messages */}
      <section id="messages" className="mt-10 scroll-mt-20">
        <h2 className="font-display text-xl font-semibold text-ink">
          Messages
        </h2>
        <div className="mt-4">
          <Conversations
            conversations={conversations}
            currentUserId={user.id}
            viewerRole="patient"
          />
        </div>
      </section>

      {/* Billing */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Billing history
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-hairline bg-card">
          {invoices.map((inv, i) => (
            <div
              key={inv.id}
              className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="font-medium text-ink">{inv.id}</span>
              <span className="text-ink-faint">{inv.date}</span>
              <span className="text-ink-soft">{inv.amount}</span>
              <span className="rounded-full bg-sage-soft px-2.5 py-0.5 text-xs font-medium text-sage">
                {inv.status}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          Invoices are illustrative — no live payment processing in this demo.
        </p>
      </section>
    </AppShell>
  );
}
