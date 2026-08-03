import { notFound, redirect } from "next/navigation";
import { getAppointment, getCurrentUser, getSessionNote } from "@/lib/queries";
import SessionRoom from "./SessionRoom";

export const metadata = { title: "Session" };

export default async function SessionPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // RLS returns the row only if the user is its therapist or patient.
  const appt = await getAppointment(appointmentId);
  if (!appt) notFound();

  const isTherapist = appt.therapist_id === user.id;
  // Patient note visibility is enforced by RLS and opens only after ended_at.
  const note = await getSessionNote(appointmentId);

  const otherName = isTherapist
    ? (appt.patient?.name ?? "Client")
    : (appt.therapist?.name ?? "Therapist");

  return (
    <main className="min-h-screen bg-paper">
      <SessionRoom
        appointmentId={appointmentId}
        otherName={otherName}
        reason={appt.reason}
        viewerRole={isTherapist ? "therapist" : "patient"}
        startIso={appt.start_time}
        startedAt={appt.started_at}
        endedAt={appt.ended_at}
        visitType={appt.visit_type}
        note={note}
        backHref={isTherapist ? "/dashboard" : "/portal"}
      />
    </main>
  );
}
