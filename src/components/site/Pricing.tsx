import Reveal from "@/components/Reveal";
import { Check } from "./icons";
import { ButtonLink, Eyebrow } from "./ui";

const tiers = [
  {
    name: "Solo therapist",
    price: "$39",
    cadence: "/ month",
    blurb: "For independent practitioners running their own caseload.",
    features: [
      "Up to 60 sessions / month",
      "Secure video + messaging",
      "SOAP session notes",
      "Automated reminders",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Group practice",
    price: "$99",
    cadence: "/ month",
    blurb: "For small teams that share clients and coverage.",
    features: [
      "Unlimited sessions",
      "Up to 5 clinicians",
      "Shared caseload & care team",
      "Billing overview & exports",
      "Priority support",
    ],
    cta: "Start free",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "For larger practices with bespoke compliance needs.",
    features: [
      "Everything in Group",
      "Signed BAA & DPA",
      "SSO & advanced audit logs",
      "Dedicated onboarding",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow>Simple, honest pricing</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Priced for practices, not enterprises.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Start free. Upgrade when your caseload does. No per-session fees, no
            surprises.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 90}
              className={`flex flex-col rounded-2xl border p-7 ${
                t.highlighted
                  ? "border-brand bg-card shadow-lift lg:-mt-4 lg:mb-4"
                  : "border-hairline bg-card shadow-card"
              }`}
            >
              {t.highlighted && (
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-ink">
                {t.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {t.blurb}
              </p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-ink">
                  {t.price}
                </span>
                <span className="text-sm text-ink-faint">{t.cadence}</span>
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.95rem]">
                    <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" />
                    <span className="text-ink-soft">{f}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/login"
                variant={t.highlighted ? "primary" : "secondary"}
                className="mt-8 w-full"
              >
                {t.cta}
              </ButtonLink>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-sm text-ink-faint">
            All plans include HIPAA-ready infrastructure, encryption and
            row-level data isolation — the security isn&rsquo;t an upsell.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
