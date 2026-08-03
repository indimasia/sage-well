"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import JoinButton from "@/components/app/JoinButton";
import LocalTime from "@/components/app/LocalTime";
import {
  Lock,
  Mic,
  MicOff,
  PhoneEnd,
  ScreenShare,
  ShieldCheck,
  Video,
  VideoOff,
} from "@/components/site/icons";
import { saveNote, type NoteResult } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { SessionNote, VisitType } from "@/lib/types";

type Props = {
  appointmentId: string;
  otherName: string;
  reason: string;
  viewerRole: "therapist" | "patient";
  startIso: string;
  startedAt: string | null;
  endedAt: string | null;
  visitType: VisitType;
  note: SessionNote | null;
  backHref: string;
};

type SoapKey = "subjective" | "objective" | "assessment" | "plan";

const SOAP: { key: SoapKey; label: string; hint: string }[] = [
  { key: "subjective", label: "Subjective", hint: "What the client reports" },
  { key: "objective", label: "Objective", hint: "Observed presentation" },
  { key: "assessment", label: "Assessment", hint: "Clinical impression" },
  { key: "plan", label: "Plan", hint: "Next steps" },
];

export default function SessionRoom({
  appointmentId,
  otherName,
  reason,
  viewerRole,
  startIso,
  startedAt,
  endedAt,
  visitType,
  note,
  backHref,
}: Props) {
  const isTherapist = viewerRole === "therapist";
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<"notes" | "chat">("notes");
  const [seconds, setSeconds] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [state, action, pending] = useActionState<NoteResult, FormData>(
    saveNote.bind(null, appointmentId),
    {},
  );

  useEffect(() => {
    if (!startedAt || endedAt) return;

    function tick() {
      setSeconds(Math.max(0, Math.floor((Date.now() - +new Date(startedAt!)) / 1000)));
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [startedAt, endedAt]);

  useEffect(() => {
    if (isTherapist || !startedAt || endedAt) return;

    async function checkForEnd() {
      const { data } = await supabase
        .from("appointments")
        .select("ended_at")
        .eq("id", appointmentId)
        .maybeSingle();
      if (data?.ended_at) router.refresh();
    }

    const timer = setInterval(checkForEnd, 5_000);
    return () => clearInterval(timer);
  }, [appointmentId, endedAt, isTherapist, router, startedAt, supabase]);

  if (endedAt) {
    return (
      <SessionRecord
        otherName={otherName}
        reason={reason}
        startedAt={startedAt}
        endedAt={endedAt}
        note={note}
        backHref={backHref}
        viewerRole={viewerRole}
      />
    );
  }

  if (!startedAt) {
    return (
      <div className="grid min-h-screen place-items-center p-5">
        <section className="w-full max-w-lg rounded-2xl border border-hairline bg-card p-8 text-center shadow-card">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand">
            <Video className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
            {visitType === "in_person"
              ? "In-person appointment"
              : isTherapist
                ? "Ready to start?"
                : "Waiting for your therapist"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {otherName} · {reason || "Therapy session"}
          </p>
          <p className="mt-2 text-sm text-ink-faint">
            Scheduled <LocalTime iso={startIso} mode="day-time" />
          </p>

          {visitType === "video" && (
            <div className="mt-6 flex justify-center">
              <JoinButton
                appointmentId={appointmentId}
                href={`/session/${appointmentId}`}
                startIso={startIso}
                viewerRole={viewerRole}
                startedAt={startedAt}
                endedAt={endedAt}
              />
            </div>
          )}

          {!isTherapist && visitType === "video" && (
            <p className="mt-4 text-sm text-ink-faint">
              Join unlocks after therapist starts call.
            </p>
          )}
          <Link
            href={backHref}
            className="mt-6 inline-block text-sm font-medium text-brand underline"
          >
            Back to {isTherapist ? "dashboard" : "portal"}
          </Link>
        </section>
      </div>
    );
  }

  const elapsed = seconds ?? 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
      <section className="flex min-h-[55vh] flex-col overflow-hidden rounded-2xl bg-brand-900 text-white lg:min-h-0">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-100">
            <Lock className="h-3.5 w-3.5" />
            End-to-end encrypted
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-sm text-brand-100">
            <span className="h-2 w-2 rounded-full bg-coral" />
            {seconds === null ? "--:--" : `${mm}:${ss}`}
          </span>
        </div>

        <div className="relative grid flex-1 place-items-center bg-linear-to-br from-brand-700 to-brand-900">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white/10 font-display text-4xl font-semibold ring-2 ring-white/15">
            {otherName.slice(0, 1).toUpperCase()}
          </div>
          <p className="absolute left-5 top-5 text-sm text-brand-100">
            {otherName}
          </p>
          <div className="absolute bottom-4 right-4 grid h-24 w-32 place-items-center rounded-lg border border-white/15 bg-brand-900/80 text-xs text-brand-100">
            {camOff ? "Camera off" : "You"}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 px-5 py-5">
          <CallControl
            active={muted}
            onClick={() => setMuted((value) => !value)}
            Icon={muted ? MicOff : Mic}
            label={muted ? "Unmute" : "Mute"}
          />
          <CallControl
            active={camOff}
            onClick={() => setCamOff((value) => !value)}
            Icon={camOff ? VideoOff : Video}
            label={camOff ? "Start video" : "Stop video"}
          />
          <CallControl
            active={sharing}
            onClick={() => setSharing((value) => !value)}
            Icon={ScreenShare}
            label={sharing ? "Stop share" : "Share screen"}
          />
          {isTherapist ? (
            <button
              type="submit"
              form="session-notes"
              name="intent"
              value="end"
              disabled={pending}
              title="Save notes and end call"
              className="group flex h-12 items-center gap-0 rounded-full bg-coral px-3.5 text-white transition-all hover:brightness-95 disabled:opacity-60"
            >
              {pending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <PhoneEnd className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-[135deg]" />
              )}
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-36 group-hover:opacity-100">
                Save &amp; end
              </span>
            </button>
          ) : (
            <Link
              href={backHref}
              title="Leave call"
              className="group flex h-12 items-center gap-0 rounded-full bg-coral px-3.5 text-white transition-all hover:brightness-95"
            >
              <PhoneEnd className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-[135deg]" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-28 group-hover:opacity-100">
                Leave call
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card">
        <div className="border-b border-hairline p-4">
          <p className="font-display text-lg font-semibold text-ink">{otherName}</p>
          <p className="text-sm text-ink-soft">{reason || "Session"}</p>
        </div>

        <div className="grid grid-cols-2 gap-1 border-b border-hairline p-2">
          {(["notes", "chat"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              aria-pressed={tab === item}
              className={`rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                tab === item
                  ? "bg-brand-50 text-brand"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {item === "notes" ? "Session notes" : "Chat"}
            </button>
          ))}
        </div>

        {isTherapist ? (
          <form
            id="session-notes"
            action={action}
            className={`${tab === "notes" ? "flex" : "hidden"} flex-1 flex-col gap-4 overflow-y-auto p-4`}
          >
            {SOAP.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-sm font-semibold text-ink">{field.label}</span>
                  <span className="text-right text-xs text-ink-faint">{field.hint}</span>
                </label>
                <textarea
                  id={field.key}
                  name={field.key}
                  rows={3}
                  defaultValue={note?.[field.key] ?? ""}
                  placeholder={`${field.label}…`}
                  className="mt-1.5 w-full resize-y rounded-lg border border-hairline bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand-200"
                />
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                name="intent"
                value="save"
                disabled={pending}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save notes"}
              </button>
              {state.ok && (
                <span className="inline-flex items-center gap-1.5 text-sm text-sage">
                  <ShieldCheck className="h-4 w-4" /> Saved
                </span>
              )}
              {state.error && (
                <span role="alert" className="text-sm text-coral">
                  {state.error}
                </span>
              )}
            </div>
          </form>
        ) : (
          <div
            className={`${tab === "notes" ? "flex" : "hidden"} flex-1 flex-col items-center justify-center p-6 text-center`}
          >
            <ShieldCheck className="h-8 w-8 text-sage" />
            <p className="mt-3 text-sm text-ink-soft">
              Therapist is documenting this visit. Notes appear in your portal after call ends.
            </p>
          </div>
        )}

        <div
          className={`${tab === "chat" ? "flex" : "hidden"} flex-1 flex-col items-center justify-center gap-3 p-6 text-center`}
        >
          <Video className="h-8 w-8 text-brand" />
          <p className="text-sm text-ink-soft">
            In-call chat is simulated. Secure messaging lives in{" "}
            <Link
              href={isTherapist ? "/dashboard/messages" : "/portal/messages"}
              className="text-brand underline"
            >
              Messages
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-hairline bg-paper-sunk/60 px-4 py-3 text-xs text-ink-soft">
          <ShieldCheck className="h-4 w-4 text-sage" />
          Recording off · consent on file · row-level isolated
        </div>
      </section>
    </div>
  );
}

function SessionRecord({
  otherName,
  reason,
  startedAt,
  endedAt,
  note,
  backHref,
  viewerRole,
}: {
  otherName: string;
  reason: string;
  startedAt: string | null;
  endedAt: string;
  note: SessionNote | null;
  backHref: string;
  viewerRole: "therapist" | "patient";
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl p-5 sm:p-8">
      <Link href={backHref} className="text-sm font-medium text-brand underline">
        Back to {viewerRole === "therapist" ? "dashboard" : "portal"}
      </Link>
      <header className="mt-5 rounded-2xl border border-hairline bg-card p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage">
          <ShieldCheck className="h-3.5 w-3.5" /> Completed
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Session with {otherName}
        </h1>
        <p className="mt-1 text-ink-soft">{reason || "Therapy session"}</p>
        <dl className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-paper-sunk/60 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-faint">Call started</dt>
            <dd className="mt-1 text-sm text-ink">
              {startedAt ? <LocalTime iso={startedAt} mode="day-time" /> : "Not recorded"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-faint">Call ended</dt>
            <dd className="mt-1 text-sm text-ink">
              <LocalTime iso={endedAt} mode="day-time" />
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-5 rounded-2xl border border-hairline bg-card p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Session notes</h2>
        {note ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SOAP.map((field) => (
              <div key={field.key}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {field.label}
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                  {note[field.key] || "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-faint">No notes saved for this session.</p>
        )}
      </section>
    </div>
  );
}

function CallControl({
  Icon,
  label,
  active,
  onClick,
}: {
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`group flex h-12 items-center rounded-full px-3.5 transition-all ${
        active
          ? "bg-white text-brand"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-28 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
