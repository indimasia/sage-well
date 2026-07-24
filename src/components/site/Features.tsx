import Reveal from "@/components/Reveal";
import {
  CalendarClock,
  Lock,
  LockMessage,
  Notes,
  Receipt,
  Video,
} from "./icons";
import { Eyebrow } from "./ui";

const features = [
  {
    Icon: Video,
    title: "Secure video sessions",
    body: "One-click, encrypted rooms with a live call timer and consent indicator. No downloads for your clients, no third-party link juggling.",
    span: "lg:col-span-3 lg:row-span-2",
    feature: true,
  },
  {
    Icon: CalendarClock,
    title: "Scheduling & reminders",
    body: "Real-time availability, automatic reminders, fewer no-shows.",
    span: "lg:col-span-3",
  },
  {
    Icon: Notes,
    title: "Compliant session notes",
    body: "SOAP-structured notes saved straight to your record — never a stray file.",
    span: "lg:col-span-3",
  },
  {
    Icon: Receipt,
    title: "Billing overview",
    body: "Invoices, visit types and revenue in one clear ledger.",
    span: "lg:col-span-2",
  },
  {
    Icon: LockMessage,
    title: "Encrypted messaging",
    body: "Private threads with each client — no PHI in your inbox.",
    span: "lg:col-span-2",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow>One calm workspace</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Everything a session needs, nothing it doesn&rsquo;t.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Purpose-built for behavioral health — so the software stays out of
            the way and the care stays front and centre.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 auto-rows-fr gap-4 lg:grid-cols-6">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 70}
              className={`group flex flex-col rounded-2xl border border-hairline p-7 transition-colors hover:border-brand-200 ${f.span} ${
                f.feature
                  ? "justify-between bg-brand-900 text-white"
                  : "bg-card"
              }`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl ${
                  f.feature
                    ? "bg-white/10 text-brand-100"
                    : "bg-brand-50 text-brand"
                }`}
              >
                <f.Icon className="h-6 w-6" />
              </span>

              {f.feature && <VideoMock />}

              <div className={f.feature ? "mt-6 max-w-sm" : "mt-6"}>
                <h3
                  className={`text-lg font-semibold ${
                    f.feature ? "text-white" : "text-ink"
                  }`}
                >
                  {f.title}
                </h3>
                <p
                  className={`mt-2.5 text-[0.97rem] leading-relaxed ${
                    f.feature ? "text-brand-100" : "text-ink-soft"
                  }`}
                >
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Simulated telehealth call — illustrative only (decorative for a11y). */
function VideoMock() {
  return (
    <div
      aria-hidden
      className="mt-6 select-none rounded-xl border border-white/10 bg-white/5 p-2.5"
    >
      {/* status bar */}
      <div className="flex items-center justify-between text-[0.68rem]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 font-medium text-brand-100">
          <Lock className="h-3 w-3" />
          End-to-end encrypted
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-brand-100">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          12:04
        </span>
      </div>

      {/* participant stage */}
      <div className="relative mt-2 grid h-24 place-items-center overflow-hidden rounded-lg bg-linear-to-br from-brand-700 to-brand-900">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 font-display text-base font-semibold text-white ring-2 ring-white/15">
          AJ
        </div>
        {/* self-view PiP */}
        <div className="absolute bottom-1.5 right-1.5 grid h-8 w-11 place-items-center rounded border border-white/15 bg-brand-900/80 text-[0.58rem] text-brand-100">
          You
        </div>
      </div>

      {/* controls */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {[Mic, Cam, Share].map((C, i) => (
          <span
            key={i}
            className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-brand-100"
          >
            <C className="h-3.5 w-3.5" />
          </span>
        ))}
        <span className="grid h-7 w-7 place-items-center rounded-full bg-coral text-white">
          <PhoneEnd className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/* Small control glyphs, local to the mock. */
const g = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function Mic(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...g} {...p}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v3" />
    </svg>
  );
}
function Cam(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...g} {...p}>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="m15 11 6-3v8l-6-3" />
    </svg>
  );
}
function Share(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...g} {...p}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </svg>
  );
}
function PhoneEnd(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...g} {...p}>
      <path d="M3 10c5-4 13-4 18 0v3l-4 .5-.6-2.5a12 12 0 0 0-8.8 0L7 13.5 3 13v-3Z" />
    </svg>
  );
}
