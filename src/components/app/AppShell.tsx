import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/icons";
import { signOut } from "@/app/login/actions";

type Props = {
  name: string;
  email: string;
  role: string;
  children: ReactNode;
};

const patientNav = [
  { href: "/portal", label: "Home" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/book", label: "Book" },
];

/** Minimal authenticated shell — header with nav, identity + sign-out. */
export default function AppShell({ name, email, role, children }: Props) {
  return (
    <>
      <header className="border-b border-hairline bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
                <Logo className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold">
                SageWell
              </span>
            </Link>
            <nav className="hidden items-center gap-5 sm:flex" aria-label="Portal">
              {patientNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-brand"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium text-ink">{name}</span>
              <span className="block text-xs capitalize text-ink-faint">
                {role} · {email}
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand">
              {(name || email).slice(0, 1)}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-brand"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      {/* Mobile nav */}
      <nav
        className="flex gap-2 overflow-x-auto border-b border-hairline bg-paper px-5 py-2 sm:hidden"
        aria-label="Portal"
      >
        {patientNav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="shrink-0 rounded-full border border-hairline bg-card px-4 py-1.5 text-sm font-medium text-ink-soft"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8">
        {children}
      </main>
    </>
  );
}
