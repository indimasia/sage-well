import Reveal from "@/components/Reveal";
import { ArrowRight } from "./icons";
import { ButtonLink } from "./ui";

export default function CtaBand() {
  return (
    <section className="bg-paper-sunk/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-hairline bg-brand px-8 py-14 text-center sm:px-14 sm:py-20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-[2.5rem] sm:leading-[1.12]">
            Give your practice a calmer, safer home.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Set up in minutes. Bring your caseload. Keep your patients&rsquo;
            privacy intact.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/login" variant="inverse" className="group">
              Start free today
              <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink
              href="#pricing"
              variant="secondary"
              className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              See pricing
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
