import { fmtTime } from "@/lib/format";
import { sendMessage } from "@/lib/actions";
import type { Conversation } from "@/lib/queries";

type Props = {
  conversations: Conversation[];
  currentUserId: string;
  /** "therapist" viewer talks to patients; "patient" viewer talks to therapists. */
  viewerRole: "therapist" | "patient";
};

export default function Conversations({
  conversations,
  currentUserId,
  viewerRole,
}: Props) {
  if (conversations.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-hairline bg-card p-8 text-center text-ink-soft">
        No message threads yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {conversations.map((c) => {
        const other =
          viewerRole === "therapist" ? c.patient : c.therapist;
        return (
          <div
            key={c.id}
            className="overflow-hidden rounded-2xl border border-hairline bg-card"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-5 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand">
                {(other?.name ?? "?").slice(0, 1)}
              </span>
              <p className="font-medium text-ink">
                {other?.name ?? "Conversation"}
              </p>
            </div>

            <div className="flex max-h-80 flex-col gap-2.5 overflow-y-auto px-5 py-4">
              {c.messages.length === 0 && (
                <p className="text-sm text-ink-faint">No messages yet.</p>
              )}
              {c.messages.map((m) => {
                const mine = m.sender_id === currentUserId;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-brand text-white"
                          : "rounded-bl-sm bg-paper-sunk text-ink"
                      }`}
                    >
                      {m.body}
                    </div>
                    <span className="mt-1 text-[0.68rem] text-ink-faint">
                      {fmtTime(m.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>

            <form
              action={sendMessage.bind(null, c.id)}
              className="flex items-center gap-2 border-t border-hairline p-3"
            >
              <input
                name="body"
                required
                autoComplete="off"
                placeholder="Write a message…"
                className="min-w-0 flex-1 rounded-full border border-hairline bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand-200"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Send
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
