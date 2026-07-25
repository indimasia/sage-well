"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Video } from "@/components/site/icons";
import { fmtTime } from "@/lib/format";

/**
 * "Join call" that only activates inside the appointment window
 * [start − 10min, start + duration]. Computed in the browser so the
 * viewer's timezone and the live clock are both correct.
 */
export default function JoinButton({
  href,
  startIso,
  durationMin = 50,
  label = "Join call",
  compact = false,
}: {
  href: string;
  startIso: string;
  durationMin?: number;
  label?: string;
  compact?: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Read the clock only after mount so SSR/timezone never mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const start = +new Date(startIso);
  // Before hydration (now === null) stay disabled to avoid a wrong flash.
  const open =
    now !== null && now >= start - 10 * 60_000 && now <= start + durationMin * 60_000;

  const size = compact ? "px-4 py-2 text-sm" : "px-6 py-3.5 text-[0.95rem]";

  if (open) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-sage font-medium text-white shadow-card transition-all hover:brightness-95 active:translate-y-px ${size}`}
      >
        <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
        {compact ? "Join" : label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      title={`Available at ${fmtTime(startIso)}`}
      suppressHydrationWarning
      className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-hairline bg-paper-sunk font-medium text-ink-faint ${size}`}
    >
      <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      {compact ? "Soon" : "Join opens at start"}
    </button>
  );
}
