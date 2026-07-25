"use client";

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
  let text: string;
  if (mode === "time") text = fmtTime(iso);
  else if (mode === "date") text = fmtDate(iso);
  else if (mode === "day") text = dayLabel(iso);
  else text = `${dayLabel(iso)} · ${fmtTime(iso)}`;

  return <time suppressHydrationWarning dateTime={iso}>{text}</time>;
}
