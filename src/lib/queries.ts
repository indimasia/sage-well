import { createClient } from "@/lib/supabase/server";
import type {
  AppointmentWithPatient,
  AppointmentWithTherapist,
  Message,
  PatientAppointment,
  SessionNote,
  Therapist,
} from "@/lib/types";

/** Current auth user + role/name derived from metadata. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.user_metadata?.role as string) ?? "patient";
  const name =
    (user.user_metadata?.display_name as string) ||
    (user.email ?? "").split("@")[0];
  return { id: user.id, email: user.email ?? "", role, name };
}

/** Appointments for the signed-in therapist, joined with patient. */
export async function getTherapistAppointments(): Promise<
  AppointmentWithPatient[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*, patient:patients(*)")
    .order("start_time", { ascending: true });
  return (data as AppointmentWithPatient[]) ?? [];
}

/** Appointments for the signed-in patient, joined with therapist. */
export async function getPatientAppointments(): Promise<
  PatientAppointment[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*, therapist:therapists(*), note:session_notes(*)")
    .order("start_time", { ascending: true });
  return (data as unknown as PatientAppointment[]) ?? [];
}

/** Public therapist directory. */
export async function getTherapists(): Promise<Therapist[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("therapists")
    .select("*")
    .order("rating", { ascending: false });
  return (data as Therapist[]) ?? [];
}

export async function getTherapist(id: string): Promise<Therapist | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("therapists")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Therapist) ?? null;
}

/** One appointment (RLS-scoped), joined with both parties. */
export async function getAppointment(
  id: string,
): Promise<(AppointmentWithPatient & AppointmentWithTherapist) | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*, patient:patients(*), therapist:therapists(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as AppointmentWithPatient & AppointmentWithTherapist) ?? null;
}

export async function getSessionNote(
  appointmentId: string,
): Promise<SessionNote | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("session_notes")
    .select("*")
    .eq("appointment_id", appointmentId)
    .maybeSingle();
  return (data as SessionNote) ?? null;
}

/** Messages the user can see (RLS-scoped), oldest first. */
export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });
  return (data as Message[]) ?? [];
}

export type Conversation = {
  id: string;
  therapist: { id: string; name: string } | null;
  patient: { id: string; name: string } | null;
  messages: Message[];
  lastReadAt: string | null;
};

/** Threads the user participates in, with profiles + messages (oldest first)
 * and this user's read cursor for unread badges. */
export async function getConversations(): Promise<Conversation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("threads")
    .select(
      "id, therapist:therapists(id,name), patient:patients(id,name), messages(*)",
    )
    .order("created_at", { ascending: true, referencedTable: "messages" });

  const { data: reads } = await supabase
    .from("thread_reads")
    .select("thread_id, last_read_at")
    .eq("user_id", user?.id ?? "");

  const readMap = new Map(
    (reads ?? []).map((r) => [r.thread_id as string, r.last_read_at as string]),
  );

  return ((data as unknown as Conversation[]) ?? []).map((c) => ({
    ...c,
    lastReadAt: readMap.get(c.id) ?? null,
  }));
}
