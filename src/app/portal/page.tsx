import Link from "next/link";
import { ArrowRight, Logo } from "@/components/site/icons";
import { ButtonLink } from "@/components/site/ui";

export const metadata = { title: "Client portal" };

export default function PortalPage() {
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
          The client portal — appointments, secure messaging and billing
          history — is the next build phase.
        </p>

        <ButtonLink href="/" variant="secondary" className="mt-8">
          Back to home
          <ArrowRight className="h-[18px] w-[18px]" />
        </ButtonLink>
      </div>
    </main>
  );
}
