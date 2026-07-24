import Link from "next/link";
import { Logo, ShieldCheck } from "./icons";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#pricing" },
      { label: "Client portal", href: "/portal" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "HIPAA readiness", href: "#security" },
      { label: "Security overview", href: "#security" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
                <Logo className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold">
                SageWell
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              HIPAA-compliant telehealth for independent therapists and small
              behavioral-health practices.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-sage" />
              HIPAA-ready · BAA available
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 text-sm text-ink-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SageWell. All rights reserved.</p>
          <p className="max-w-md text-xs leading-relaxed">
            SageWell is a demonstration product. Not for real clinical use — no
            real patient data is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
