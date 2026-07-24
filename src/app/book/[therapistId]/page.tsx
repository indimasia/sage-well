import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Star } from "@/components/site/icons";
import { getCurrentUser, getTherapist } from "@/lib/queries";
import BookingForm from "./BookingForm";

export const metadata = { title: "Book a visit" };

export default async function BookTherapistPage({
  params,
}: {
  params: Promise<{ therapistId: string }>;
}) {
  const { therapistId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const therapist = await getTherapist(therapistId);
  if (!therapist) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-8">
      <Link
        href="/book"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-brand"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        All therapists
      </Link>

      {/* Profile */}
      <div className="mt-6 flex items-start gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-50 font-display text-2xl font-semibold text-brand">
          {therapist.name.replace(/^Dr\.?\s*/, "").slice(0, 1) || "T"}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {therapist.name}
          </h1>
          <p className="text-brand-600">{therapist.specialty}</p>
          <div className="mt-1 flex items-center gap-3 text-sm text-ink-faint">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-sage" />
              {therapist.rating.toFixed(1)}
            </span>
            <span>{therapist.years_experience} yrs experience</span>
          </div>
        </div>
      </div>

      {therapist.bio && (
        <p className="mt-4 leading-relaxed text-ink-soft">{therapist.bio}</p>
      )}

      <hr className="mt-8 border-hairline" />

      {user.role === "therapist" && (
        <p className="mt-6 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          You&rsquo;re signed in as a therapist. Booking writes to a{" "}
          <em>patient</em> account — sign in as a client to complete one.
        </p>
      )}

      <BookingForm therapistId={therapist.id} />
    </main>
  );
}
