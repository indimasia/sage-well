"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Logo,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
} from "@/components/site/icons";
import { signOut } from "@/app/login/actions";

const nav = [
  { href: "/dashboard", label: "Appointments", Icon: CalendarDays, exact: true },
  { href: "/dashboard/clients", label: "Clients", Icon: Users },
  { href: "/dashboard/messages", label: "Messages", Icon: MessageSquare },
  { href: "/dashboard/security", label: "Security", Icon: ShieldCheck },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

type Props = { name: string; email: string; role: string };

export default function Sidebar({ name, email, role }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavList = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {nav.map(({ href, label, Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand text-white shadow-card"
                : "text-ink-soft hover:bg-brand-50 hover:text-brand"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const Identity = (
    <div className="mt-4 border-t border-hairline pt-4">
      <div className="flex items-center gap-3 px-1">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand">
          {(name || email).slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink">
            {name}
          </span>
          <span className="block truncate text-xs capitalize text-ink-faint">
            {role}
          </span>
        </span>
      </div>
      <form action={signOut} className="mt-3">
        <button
          type="submit"
          className="w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-brand"
        >
          Log out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-hairline bg-paper/80 px-5 backdrop-blur-md lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Logo className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">SageWell</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-hairline text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-hairline bg-paper p-4">
            {NavList}
            {Identity}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-hairline bg-paper/60 p-4 lg:flex">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center gap-2.5 px-1 text-ink"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Logo className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">SageWell</span>
        </Link>
        {NavList}
        {Identity}
      </aside>
    </>
  );
}
