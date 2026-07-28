import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const metadata = { title: "Booking confirmed" };

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!stripe || !session_id) redirect("/portal");

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status === "paid") {
    const m = session.metadata ?? {};
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert once — stripe_session_id is unique, so a refresh is a no-op.
    if (user && m.therapist_id && m.start_time) {
      await supabase.from("appointments").insert({
        therapist_id: m.therapist_id,
        patient_id: user.id,
        start_time: m.start_time,
        visit_type: m.visit_type ?? "video",
        reason: m.reason ?? "Therapy session",
        status: "upcoming",
        stripe_session_id: session.id,
      });
      await supabase
        .from("threads")
        .upsert(
          { therapist_id: m.therapist_id, patient_id: user.id },
          { onConflict: "therapist_id,patient_id", ignoreDuplicates: true },
        );
    }
    redirect("/portal?booked=1");
  }

  redirect("/portal");
}
