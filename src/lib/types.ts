export type VisitType = "video" | "in_person";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type Therapist = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  years_experience: number;
  rating: number;
  avatar_url: string | null;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

export type Appointment = {
  id: string;
  therapist_id: string;
  patient_id: string;
  start_time: string;
  started_at: string | null;
  ended_at: string | null;
  duration_min: number;
  visit_type: VisitType;
  status: AppointmentStatus;
  reason: string;
  stripe_session_id: string | null;
  amount_cents: number;
  currency: string;
  payment_status: "paid" | "demo" | "refunded" | "failed";
  paid_at: string | null;
  created_at: string;
};

export type SessionNote = {
  id: string;
  appointment_id: string;
  therapist_id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

/** Appointment joined with the other party's profile, for list views. */
export type AppointmentWithPatient = Appointment & { patient: Patient | null };
export type AppointmentWithTherapist = Appointment & {
  therapist: Therapist | null;
};

export type PatientAppointment = AppointmentWithTherapist & {
  note: SessionNote | null;
};
