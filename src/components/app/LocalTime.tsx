"use client";

import { useEffect, useState } from "react";
import { dayLabel, fmtDate, fmtTime } from "@/lib/format";

/**
 * Renders a timestamp in the VIEWER's timezone (formatting runs in the
 * browser). Server-side format helpers use UTC, which made a 16:00 booking
 * show as 09:00 — this keeps wall-clock time correct per viewer.
 */
export default function LocalTime({
  iso,
  mode = "time",
}: {
  iso: string;
  mode?: "time" | "date" | "day" | "day-time";
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let localText: string;
    if (mode === "time") localText = fmtTime(iso);
    else if (mode === "date") localText = fmtDate(iso);
    else if (mode === "day") localText = dayLabel(iso);
    else localText = `${dayLabel(iso)} · ${fmtTime(iso)}`;

    // Browser timezone is unavailable during SSR. Keep placeholder until mount
    // instead of flashing server timezone and changing it during hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(localText);
  }, [iso, mode]);

  return (
    <time dateTime={iso} aria-busy={text === null}>
      {text ?? (
        <>
          <span
            aria-hidden
            className="inline-block h-3 w-16 animate-pulse rounded bg-hairline/70 align-middle"
          />
          <span className="sr-only">Loading local time</span>
        </>
      )}
    </time>
  );
}
