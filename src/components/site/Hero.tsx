import Reveal from "@/components/Reveal";
import { ArrowRight, Check, Lock, ShieldCheck, Video } from "./icons";
import { ButtonLink, Pill } from "./ui";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="absolute -right-40 top-[-10%] -z-0 h-[36rem] w-[36rem] rounded-full bg-brand-100/50 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-24">
        {/* Copy */}
        <div>
          <Reveal>
            <Pill icon={<ShieldCheck className="h-4 w-4 text-sage" />}>
              HIPAA-ready infrastructure · BAA available
            </Pill>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-balance font-display text-[2.3rem] font-semibold leading-[1.06] text-ink sm:text-6xl sm:leading-[1.04]">
              Run your practice.{" "}
              <br className="hidden sm:block" />
              <span className="text-brand">Protect</span> your patients.{" "}
              <br className="hidden sm:block" />
              <span className="italic text-ink-soft">Skip the spreadsheet.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              SageWell is the calm, secure home for independent therapists and
              small behavioral-health practices — booking, sessions, notes and
              billing, held to real clinical-grade privacy.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login" className="group">
                For therapists
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/portal" variant="secondary">
                For clients
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-faint">
              {[
                "No setup fees",
                "Cancel anytime",
                "Data stays isolated by design",
              ].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-sage" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Product glimpse */}
        <Reveal delay={200} className="relative">
          <div className="relative rounded-[1.6rem] border border-hairline bg-card p-3 shadow-lift">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 px-3 pb-3 pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
              <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
              <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
              <span className="ml-3 text-xs text-ink-faint">sagewell.app / dashboard</span>
            </div>

            <div className="rounded-2xl bg-paper p-5">
              <p className="text-sm text-ink-faint">Good morning, Dr. Adeyemi</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-ink">
                Your next session
              </p>

              {/* next-appointment card */}
              <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Jordan M.</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      Anxiety follow-up · 50 min
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-sage">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                    10:30 AM
                  </span>
                </div>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sage py-2.5 text-sm font-medium text-white">
                  <Video className="h-4 w-4" />
                  Join secure call
                </button>
              </div>

              {/* stat row */}
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[
                  { k: "Sessions", v: "12", s: "this week" },
                  { k: "Notes due", v: "3", s: "pending" },
                  { k: "Revenue", v: "$2.4k", s: "MTD" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-xl border border-hairline bg-card p-3"
                  >
                    <p className="text-[0.68rem] uppercase tracking-wide text-ink-faint">
                      {s.k}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-ink">
                      {s.v}
                    </p>
                    <p className="text-[0.68rem] text-ink-faint">{s.s}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-paper-sunk px-3 py-2 text-xs text-ink-soft">
                <Lock className="h-3.5 w-3.5 text-brand" />
                End-to-end encrypted · Row-level isolated
              </div>
            </div>
          </div>

          {/* floating badge */}
          <div className="absolute -bottom-5 -left-4 hidden rotate-[-4deg] items-center gap-2 rounded-xl border border-hairline bg-card px-3.5 py-2.5 shadow-card lg:flex">
            <ShieldCheck className="h-5 w-5 text-sage" />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-ink">RLS enforced</p>
              <p className="text-[0.68rem] text-ink-faint">at the database</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
