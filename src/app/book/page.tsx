import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Logo, Star } from "@/components/site/icons";
import { getCurrentUser, getTherapists } from "@/lib/queries";

export const metadata = { title: "Find a therapist" };

export default async function BookDirectoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const therapists = await getTherapists();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
      <Link href="/" className="inline-flex items-center gap-2.5 text-ink">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
          <Logo className="h-5 w-5" />
        </span>
        <span className="font-display text-xl font-semibold">SageWell</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Find a therapist
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Browse our practitioners and book a video or in-person visit.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {therapists.map((t) => (
          <Link
            key={t.id}
            href={`/book/${t.id}`}
            className="group flex flex-col rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-brand-200"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-lg font-semibold text-brand">
                {t.name.replace(/^Dr\.?\s*/, "").slice(0, 1) || "T"}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{t.name || "Therapist"}</p>
                <p className="truncate text-sm text-brand-600">{t.specialty}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
              {t.bio}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm text-ink-faint">
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-sage" />
                  {t.rating.toFixed(1)}
                </span>
                <span>{t.years_experience} yrs</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-brand transition-transform group-hover:translate-x-0.5">
                Book <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
