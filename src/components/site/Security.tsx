import Reveal from "@/components/Reveal";
import { AuditList, Database, Lock, ShieldCheck } from "./icons";
import { Eyebrow } from "./ui";

const pillars = [
  {
    Icon: ShieldCheck,
    title: "HIPAA-ready infrastructure",
    body: "Built on infrastructure that offers a signed BAA — the same foundation used by production healthcare software.",
  },
  {
    Icon: Lock,
    title: "Encrypted end to end",
    body: "PHI is encrypted in transit and at rest. Messages, notes and documents never travel in the clear.",
  },
  {
    Icon: Database,
    title: "Row-level data isolation",
    body: "Postgres RLS policies enforce access at the database — one therapist can never read another's records, even by direct query.",
  },
  {
    Icon: AuditList,
    title: "Audit logging",
    body: "Every read and write to a record is attributable. Nothing happens to a chart without a trace.",
  },
];

export default function Security() {
  return (
    <section
      id="security"
      className="scroll-mt-20 border-y border-hairline bg-brand-900 text-white"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <Reveal>
            <Eyebrow>
              <span className="text-brand-200">Security &amp; compliance</span>
            </Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-[2.6rem] sm:leading-[1.1]">
              Privacy you can prove, not just promise.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-brand-100">
              Compliance here isn&rsquo;t a badge in the footer. It&rsquo;s
              enforced in the database, where it actually counts.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-brand-100">
                  <p.Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-brand-100">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Concrete proof — an RLS-blocked query */}
        <Reveal delay={160} className="min-w-0">
          <figure className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0e2740] shadow-lift">
            <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-brand-100">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                psql — logged in as therapist_a
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium">
                RLS: on
              </span>
            </figcaption>

            <pre className="overflow-x-auto p-5 font-mono text-[0.82rem] leading-relaxed">
              <code>
                <span className="text-brand-200">-- Therapist A tries to read Therapist B&apos;s notes</span>
                {"\n"}
                <span className="text-white">select</span> * <span className="text-white">from</span> session_notes
                {"\n  "}
                <span className="text-white">where</span> therapist_id = <span className="text-[#e6b673]">&apos;therapist_b&apos;</span>;
                {"\n\n"}
                <span className="text-brand-100"> id | subjective | objective | plan </span>
                {"\n"}
                <span className="text-brand-100">----+------------+-----------+------</span>
                {"\n"}
                <span className="text-sage"> (0 rows)</span>
                {"\n\n"}
                <span className="text-brand-200"># Blocked by policy. No error, no leak — just nothing to see.</span>
              </code>
            </pre>
          </figure>
          <p className="mt-4 flex items-center gap-2 text-sm text-brand-100">
            <ShieldCheck className="h-4 w-4 text-sage" />
            Isolation enforced at the row level — testable, not theatrical.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
