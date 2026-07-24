"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BookResult = { error?: string };

/** Book an appointment. RLS requires patient_id to be the signed-in user,
 * so only patient accounts can complete a booking. */
export async function bookAppointment(
  therapistId: string,
  _prev: BookResult,
  formData: FormData,
): Promise<BookResult> {
  const start_time = String(formData.get("start_time") ?? "");
  const visit_type = String(formData.get("visit_type") ?? "video");
  const reason = String(formData.get("reason") ?? "").trim() || "Therapy session";
  const consent = formData.get("consent");

  if (!start_time) return { error: "Pick a date and time." };
  if (!consent) return { error: "Please accept the privacy consent to continue." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("appointments").insert({
    therapist_id: therapistId,
    patient_id: user.id,
    start_time,
    visit_type,
    reason,
    status: "upcoming",
  });

  if (error) {
    // Most likely cause: a therapist account (no patients row) tried to book.
    return {
      error:
        "Could not book. Booking is available to client/patient accounts only.",
    };
  }

  revalidatePath("/portal");
  redirect("/portal?booked=1");
}

export type NoteResult = { ok?: boolean; error?: string };

/** Upsert SOAP session notes. RLS restricts writes to the authoring therapist. */
export async function saveNote(
  appointmentId: string,
  _prev: NoteResult,
  formData: FormData,
): Promise<NoteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const row = {
    appointment_id: appointmentId,
    therapist_id: user.id,
    subjective: String(formData.get("subjective") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    assessment: String(formData.get("assessment") ?? ""),
    plan: String(formData.get("plan") ?? ""),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("session_notes")
    .upsert(row, { onConflict: "appointment_id" });

  if (error)
    return { error: "Could not save. Only the treating therapist can edit notes." };

  revalidatePath(`/session/${appointmentId}`);
  return { ok: true };
}

/** Post a message to a thread. RLS requires the sender to be a participant. */
export async function sendMessage(threadId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: user.id, body });

  revalidatePath("/dashboard/messages");
  revalidatePath("/portal");
}
