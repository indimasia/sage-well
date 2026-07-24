"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./icons";
import { ButtonLink } from "./ui";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink"
          aria-label="SageWell home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Logo className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">SageWell</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.95rem] text-ink-soft transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-[0.95rem] font-medium text-ink-soft transition-colors hover:text-brand"
          >
            Log in
          </Link>
          <ButtonLink href="/login" className="px-5 py-2.5 text-[0.9rem]">
            Start free
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-hairline text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-hairline bg-paper px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-ink-soft hover:bg-brand-50 hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 border-t border-hairline pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-medium text-ink-soft hover:bg-brand-50 hover:text-brand"
              >
                Log in
              </Link>
              <ButtonLink href="/login" onClick={() => setOpen(false)}>
                Start free
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
