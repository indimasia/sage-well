"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SESSION_PRICE_CENTS, stripe } from "@/lib/stripe";

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

  // Guard: can't book yourself, and only patient accounts can book.
  if (therapistId === user.id)
    return { error: "You can't book an appointment with yourself." };
  if (user.user_metadata?.role === "therapist")
    return {
      error: "Booking is for client accounts. Sign in as a client to book.",
    };

  // With Stripe configured → pay first, insert on successful return.
  if (stripe) {
    const h = await headers();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: SESSION_PRICE_CENTS,
            product_data: { name: `SageWell session · ${reason}` },
          },
        },
      ],
      metadata: {
        therapist_id: therapistId,
        patient_id: user.id,
        start_time,
        visit_type,
        reason,
      },
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${therapistId}`,
    });

    if (!session.url) return { error: "Could not start checkout." };
    redirect(session.url);
  }

  // No Stripe key → direct booking (demo still works).
  const { error } = await supabase.from("appointments").insert({
    therapist_id: therapistId,
    patient_id: user.id,
    start_time,
    visit_type,
    reason,
    status: "upcoming",
  });

  if (error) {
    return {
      error:
        "Could not book. Booking is available to client/patient accounts only.",
    };
  }

  // Open a chat thread with this therapist (no-op if it already exists).
  await supabase
    .from("threads")
    .upsert(
      { therapist_id: therapistId, patient_id: user.id },
      { onConflict: "therapist_id,patient_id", ignoreDuplicates: true },
    );

  revalidatePath("/portal");
  redirect("/portal?booked=1");
}

/** Ensure a message thread exists with a therapist, then open it. */
export async function openThread(therapistId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: thread } = await supabase
    .from("threads")
    .select("id")
    .eq("therapist_id", therapistId)
    .eq("patient_id", user.id)
    .maybeSingle();

  if (!thread) {
    const { data: created } = await supabase
      .from("threads")
      .insert({ therapist_id: therapistId, patient_id: user.id })
      .select("id")
      .single();
    thread = created;
  }

  redirect(`/portal/messages?thread=${thread?.id ?? ""}`);
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
