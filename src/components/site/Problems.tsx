import Reveal from "@/components/Reveal";
import { CalendarX, Scatter, ShieldAlert } from "./icons";
import { Eyebrow } from "./ui";

const problems = [
  {
    n: "01",
    Icon: CalendarX,
    title: "No-shows quietly drain the week",
    body: "Missed sessions mean lost income and gaps in care. Manual reminders slip through when you are the front desk, the clinician and the biller all at once.",
  },
  {
    n: "02",
    Icon: ShieldAlert,
    title: "Compliance risk sits in the background",
    body: "Notes in a shared drive, PHI in email threads, no audit trail. One misplaced file is a breach — and the liability is entirely yours.",
  },
  {
    n: "03",
    Icon: Scatter,
    title: "Your tools don't talk to each other",
    body: "A calendar here, a video link there, invoices in a spreadsheet. Every handoff is a copy-paste, and every copy-paste is a chance to leak.",
  },
];

export default function Problems() {
  return (
    <section className="border-t border-hairline bg-paper-sunk/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow>The reality of solo practice</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Running a practice shouldn&rsquo;t mean fighting your own toolkit.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal
              key={p.n}
              delay={i * 90}
              className="flex flex-col bg-card p-7 lg:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral-soft text-coral">
                  <p.Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-2xl font-semibold text-hairline">
                  {p.n}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
