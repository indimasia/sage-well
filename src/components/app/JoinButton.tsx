"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Video } from "@/components/site/icons";
import { startCall, type CallResult } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";

/**
 * Therapist starts call; patient can only join after that persisted event.
 * Scheduled-time gating uses browser clock to avoid SSR clock mismatch.
 */
export default function JoinButton({
  appointmentId,
  href,
  startIso,
  viewerRole,
  startedAt,
  endedAt,
  compact = false,
}: {
  appointmentId: string;
  href: string;
  startIso: string;
  viewerRole: "therapist" | "patient";
  startedAt: string | null;
  endedAt: string | null;
  compact?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [now, setNow] = useState<number | null>(null);
  const [callState, setCallState] = useState({ startedAt, endedAt });
  const [state, action, pending] = useActionState<CallResult, FormData>(
    startCall.bind(null, appointmentId),
    {},
  );

  useEffect(() => {
    // Read the clock only after mount so SSR/timezone never mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const start = +new Date(startIso);
  const canStart = now !== null && now >= start - 10 * 60_000;

  useEffect(() => {
    if (
      viewerRole !== "patient" ||
      callState.endedAt ||
      now === null ||
      now < start - 10 * 60_000
    ) {
      return;
    }

    async function refreshCallState() {
      const { data } = await supabase
        .from("appointments")
        .select("started_at, ended_at")
        .eq("id", appointmentId)
        .maybeSingle();

      if (data) {
        setCallState({
          startedAt: data.started_at as string | null,
          endedAt: data.ended_at as string | null,
        });
      }
    }

    refreshCallState();
    const timer = setInterval(refreshCallState, 5_000);
    return () => clearInterval(timer);
  }, [
    appointmentId,
    callState.endedAt,
    now,
    start,
    supabase,
    viewerRole,
  ]);

  const size = compact ? "px-4 py-2 text-sm" : "px-6 py-3.5 text-[0.95rem]";

  if (callState.endedAt) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-brand-100 bg-brand-50 font-medium text-brand transition-colors hover:bg-brand-100 ${size}`}
      >
        <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
        {viewerRole === "therapist" ? "Record" : "Notes"}
      </Link>
    );
  }

  if (callState.startedAt) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-sage font-medium text-white shadow-card transition-all hover:brightness-95 active:translate-y-px ${size}`}
      >
        <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
        {viewerRole === "therapist"
          ? compact
            ? "Resume"
            : "Resume call"
          : compact
            ? "Join"
            : "Join call"}
      </Link>
    );
  }

  if (viewerRole === "therapist" && canStart) {
    return (
      <div className="flex flex-col items-start gap-1">
        <form action={action}>
          <button
            type="submit"
            disabled={pending}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-sage font-medium text-white shadow-card transition-all hover:brightness-95 disabled:opacity-70 ${size}`}
          >
            {pending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
            )}
            {pending ? "Starting…" : compact ? "Start" : "Start call"}
          </button>
        </form>
        {state.error && (
          <span role="alert" className="max-w-56 text-xs text-coral">
            {state.error}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-hairline bg-paper-sunk font-medium text-ink-faint ${size}`}
    >
      <Video className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      {viewerRole === "patient"
        ? compact
          ? "Waiting"
          : "Waiting for therapist"
        : compact
          ? "Soon"
          : "Starts 10 min early"}
    </button>
  );
}
