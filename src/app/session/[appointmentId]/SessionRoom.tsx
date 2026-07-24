"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
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
import type { SessionNote } from "@/lib/types";

type Props = {
  appointmentId: string;
  otherName: string;
  reason: string;
  canEdit: boolean;
  note: SessionNote | null;
  backHref: string;
};

const SOAP: { key: keyof SessionNote; label: string; hint: string }[] = [
  { key: "subjective", label: "Subjective", hint: "What the client reports" },
  { key: "objective", label: "Objective", hint: "Observed presentation" },
  { key: "assessment", label: "Assessment", hint: "Clinical impression" },
  { key: "plan", label: "Plan", hint: "Next steps" },
];

export default function SessionRoom({
  appointmentId,
  otherName,
  reason,
  canEdit,
  note,
  backHref,
}: Props) {
  const [tab, setTab] = useState<"notes" | "chat">("notes");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const [state, action, pending] = useActionState<NoteResult, FormData>(
    saveNote.bind(null, appointmentId),
    {},
  );

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
      {/* Video panel */}
      <section className="flex flex-col overflow-hidden rounded-2xl bg-brand-900 text-white">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-100">
            <Lock className="h-3.5 w-3.5" />
            End-to-end encrypted
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-sm text-brand-100">
            <span className="h-2 w-2 rounded-full bg-coral" />
            {mm}:{ss}
          </span>
        </div>

        <div className="relative grid flex-1 place-items-center bg-linear-to-br from-brand-700 to-brand-900">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white/10 font-display text-4xl font-semibold ring-2 ring-white/15">
            {otherName.slice(0, 1).toUpperCase()}
          </div>
          <p className="absolute left-5 top-5 text-sm text-brand-100">
            {otherName}
          </p>
          {/* self view */}
          <div className="absolute bottom-4 right-4 grid h-24 w-32 place-items-center rounded-lg border border-white/15 bg-brand-900/80 text-xs text-brand-100">
            {camOff ? "Camera off" : "You"}
          </div>
        </div>

        {/* controls — icon pills that reveal a label on hover */}
        <div className="flex items-center justify-center gap-2.5 px-5 py-5">
          <CallControl
            active={muted}
            onClick={() => setMuted((v) => !v)}
            Icon={muted ? MicOff : Mic}
            label={muted ? "Unmute" : "Mute"}
          />
          <CallControl
            active={camOff}
            onClick={() => setCamOff((v) => !v)}
            Icon={camOff ? VideoOff : Video}
            label={camOff ? "Start video" : "Stop video"}
          />
          <CallControl
            active={sharing}
            onClick={() => setSharing((v) => !v)}
            Icon={ScreenShare}
            label={sharing ? "Stop share" : "Share screen"}
          />
          <Link
            href={backHref}
            title="End call"
            className="group flex h-12 items-center gap-0 rounded-full bg-coral px-3.5 text-white transition-all hover:brightness-95"
          >
            <PhoneEnd className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-[135deg]" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[6rem] group-hover:opacity-100">
              End call
            </span>
          </Link>
        </div>
      </section>

      {/* Side panel */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card">
        <div className="border-b border-hairline p-4">
          <p className="font-display text-lg font-semibold text-ink">
            {otherName}
          </p>
          <p className="text-sm text-ink-soft">{reason || "Session"}</p>
        </div>

        {/* tabs */}
        <div className="grid grid-cols-2 gap-1 border-b border-hairline p-2">
          {(["notes", "chat"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-brand-50 text-brand"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t === "notes" ? "Session notes" : "Chat"}
            </button>
          ))}
        </div>

        {tab === "notes" ? (
          <form action={action} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {SOAP.map((f) => (
              <div key={f.key}>
                <label
                  htmlFor={f.key}
                  className="flex items-baseline justify-between"
                >
                  <span className="text-sm font-semibold text-ink">
                    {f.label}
                  </span>
                  <span className="text-xs text-ink-faint">{f.hint}</span>
                </label>
                <textarea
                  id={f.key}
                  name={f.key}
                  rows={3}
                  defaultValue={(note?.[f.key] as string) ?? ""}
                  readOnly={!canEdit}
                  placeholder={canEdit ? `${f.label}…` : "—"}
                  className="mt-1.5 w-full resize-y rounded-lg border border-hairline bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand-200 read-only:opacity-70"
                />
              </div>
            ))}

            {canEdit ? (
              <div className="flex items-center gap-3">
                <button
                  type="submit"
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
                  <span className="text-sm text-coral">{state.error}</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-ink-faint">
                Notes are private to your therapist.
              </p>
            )}
          </form>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Video className="h-8 w-8 text-brand" />
            <p className="text-sm text-ink-soft">
              In-call chat is simulated for this demo. Secure messaging lives in{" "}
              <Link href="/dashboard/messages" className="text-brand underline">
                Messages
              </Link>
              .
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-hairline bg-paper-sunk/60 px-4 py-3 text-xs text-ink-soft">
          <ShieldCheck className="h-4 w-4 text-sage" />
          Recording off · consent on file · row-level isolated
        </div>
      </section>
    </div>
  );
}

/** Round icon control that expands to reveal its label on hover. */
function CallControl({
  Icon,
  label,
  active,
  onClick,
}: {
  Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
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
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[7rem] group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
