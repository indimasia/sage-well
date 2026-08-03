"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { MapPin, Video } from "@/components/site/icons";
import { bookAppointment, type BookResult } from "@/lib/actions";

const TIMES = {
  Morning: ["09:00", "10:00", "11:00"],
  Afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00"],
};

function nextDays(n: number) {
  const out: { iso: string; wd: string; d: number; mo: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push({
      iso: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`,
      wd: dt.toLocaleDateString("en-US", { weekday: "short" }),
      d: dt.getDate(),
      mo: dt.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

export default function BookingForm({
  therapistId,
}: {
  therapistId: string;
}) {
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [visit, setVisit] = useState<"video" | "in_person">("video");
  const [timeZone, setTimeZone] = useState("");
  const [now, setNow] = useState(0);

  const [state, action, pending] = useActionState<BookResult, FormData>(
    bookAppointment.bind(null, therapistId),
    {},
  );

  // Build browser-local dates after mount. Server timezone must never choose
  // a date or timestamp for the patient.
  useEffect(() => {
    const localDays = nextDays(7);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(localDays);
    setDate(localDays[1].iso);
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(Date.now());
  }, []);

  // Browser-local date+time → one timezone-safe instant for storage.
  const startIso = useMemo(() => {
    if (!date) return "";
    const dt = new Date(`${date}T${time}:00`);
    return isNaN(+dt) ? "" : dt.toISOString();
  }, [date, time]);

  // A slot is unbookable once its start moment has passed (mostly "today").
  const slotPast = (t: string) =>
    !!date && now > 0 && new Date(`${date}T${t}:00`).getTime() <= now;
  const selectedPast = !!startIso && now > 0 && new Date(startIso).getTime() <= now;

  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="start_time" value={startIso} />
      <input type="hidden" name="visit_type" value={visit} />

      {/* Visit type */}
      <p className="text-sm font-semibold text-ink">Visit type</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:max-w-sm">
        {(
          [
            { v: "video", label: "Video visit", Icon: Video },
            { v: "in_person", label: "In-person", Icon: MapPin },
          ] as const
        ).map(({ v, label, Icon }) => (
          <button
            key={v}
            type="button"
            onClick={() => setVisit(v)}
            aria-pressed={visit === v}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              visit === v
                ? "border-brand bg-brand-50 text-brand"
                : "border-hairline bg-card text-ink-soft hover:border-brand-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Date */}
      <p className="mt-6 text-sm font-semibold text-ink">Pick a day</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {days.length === 0 && (
          <span className="h-16 w-80 animate-pulse rounded-xl bg-paper-sunk" />
        )}
        {days.map((day) => (
          <button
            key={day.iso}
            type="button"
            onClick={() => setDate(day.iso)}
            aria-pressed={date === day.iso}
            className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2.5 text-sm transition-colors ${
              date === day.iso
                ? "border-brand bg-brand text-white"
                : "border-hairline bg-card text-ink-soft hover:border-brand-200"
            }`}
          >
            <span className="text-xs opacity-80">{day.wd}</span>
            <span className="font-display text-lg font-semibold">{day.d}</span>
            <span className="text-[0.65rem] opacity-80">{day.mo}</span>
          </button>
        ))}
      </div>

      {/* Time */}
      <p className="mt-6 text-sm font-semibold text-ink">Pick a time</p>
      {timeZone && (
        <p className="mt-1 text-xs text-ink-faint">
          Times shown in {timeZone.replaceAll("_", " ")}.
        </p>
      )}
      <div className="mt-2 space-y-3">
        {Object.entries(TIMES).map(([label, slots]) => (
          <div key={label}>
            <p className="mb-1.5 text-xs uppercase tracking-wide text-ink-faint">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => {
                const past = slotPast(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={past}
                    onClick={() => setTime(s)}
                    aria-pressed={time === s}
                    title={past ? "This time has already passed" : undefined}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      past
                        ? "cursor-not-allowed border-hairline bg-paper-sunk text-ink-faint line-through"
                        : time === s
                          ? "border-brand bg-brand-50 text-brand"
                          : "border-hairline bg-card text-ink-soft hover:border-brand-200"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Reason */}
      <div className="mt-6 sm:max-w-md">
        <label htmlFor="reason" className="text-sm font-semibold text-ink">
          Reason for visit{" "}
          <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id="reason"
          name="reason"
          placeholder="e.g. Anxiety follow-up"
          className="mt-1.5 w-full rounded-lg border border-hairline bg-card px-4 py-3 text-ink placeholder:text-ink-faint focus:border-brand-200"
        />
      </div>

      {/* Consent */}
      <label className="mt-6 flex items-start gap-3 rounded-xl border border-hairline bg-card p-4 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
        />
        <span>
          I consent to SageWell processing my health information for this
          booking, and understand it is protected under HIPAA-ready, encrypted,
          row-level-isolated storage.
        </span>
      </label>

      {selectedPast && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-coral/40 bg-coral-soft px-3 py-2 text-sm text-coral"
        >
          That time has already passed. Pick a later slot or a future day.
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-coral/40 bg-coral-soft px-3 py-2 text-sm text-coral"
        >
          {state.error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending || !startIso || selectedPast}
          className="inline-flex w-full items-center justify-center rounded-full bg-sage px-6 py-3.5 font-medium text-white shadow-card transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending
            ? "Redirecting…"
            : selectedPast
              ? "Pick a future time"
              : "Confirm booking · $120"}
        </button>
        <span className="text-sm text-ink-faint">
          Secure checkout via Stripe.
        </span>
      </div>
    </form>
  );
}
