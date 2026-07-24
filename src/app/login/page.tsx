import Link from "next/link";
import { ArrowRight, Logo } from "@/components/site/icons";
import { ButtonLink } from "@/components/site/ui";

export const metadata = { title: "Log in" };

export default function LoginPage() {
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
          Sign in to your practice
        </h1>
        <p className="mt-3 text-ink-soft">
          Authentication and the demo dashboard are the next build phase. The
          landing experience is live and responsive.
        </p>

        <div className="mt-8 rounded-2xl border border-hairline bg-card p-6 text-left text-sm text-ink-soft">
          <p className="font-semibold text-ink">Coming next</p>
          <ul className="mt-3 space-y-1.5">
            <li>· Supabase Auth with seeded demo accounts</li>
            <li>· Therapist dashboard on real data</li>
            <li>· RLS isolation between accounts</li>
          </ul>
        </div>

        <ButtonLink href="/" variant="secondary" className="mt-8">
          Back to home
          <ArrowRight className="h-[18px] w-[18px]" />
        </ButtonLink>
      </div>
    </main>
  );
}
