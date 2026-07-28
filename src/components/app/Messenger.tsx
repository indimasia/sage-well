"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare } from "@/components/site/icons";
import { fmtTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Conversation } from "@/lib/queries";
import type { Message } from "@/lib/types";

type Props = {
  initialConversations: Conversation[];
  currentUserId: string;
  viewerRole: "therapist" | "patient";
  initialSelectedId?: string;
};

function lastOf(c: Conversation): Message | undefined {
  return c.messages[c.messages.length - 1];
}

function unreadCount(c: Conversation, me: string): number {
  return c.messages.filter(
    (m) => m.sender_id !== me && (!c.lastReadAt || m.created_at > c.lastReadAt),
  ).length;
}

export default function Messenger({
  initialConversations,
  currentUserId,
  viewerRole,
  initialSelectedId,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [convos, setConvos] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? initialConversations[0]?.id ?? null,
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const other = (c: Conversation) =>
    viewerRole === "therapist" ? c.patient : c.therapist;

  const list = useMemo(
    () =>
      [...convos].sort((a, b) => {
        const ta = lastOf(a)?.created_at ?? "";
        const tb = lastOf(b)?.created_at ?? "";
        return tb.localeCompare(ta);
      }),
    [convos],
  );

  const selected = convos.find((c) => c.id === selectedId) ?? null;

  // Mark a thread read: bump the cursor locally + persist.
  const markRead = useCallback(
    async (threadId: string) => {
      const nowIso = new Date().toISOString();
      setConvos((prev) =>
        prev.map((c) =>
          c.id === threadId ? { ...c, lastReadAt: nowIso } : c,
        ),
      );
      await supabase.from("thread_reads").upsert({
        thread_id: threadId,
        user_id: currentUserId,
        last_read_at: nowIso,
      });
    },
    [supabase, currentUserId],
  );

  function openThread(id: string) {
    setSelectedId(id);
    markRead(id);
  }

  // Mark the initially-open thread read once on mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedId) markRead(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime: append new messages; auto-read if their thread is open.
  useEffect(() => {
    const ids = new Set(convos.map((c) => c.id));
    const channel = supabase
      .channel("messages-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          if (!ids.has(m.thread_id)) return;
          setConvos((prev) =>
            prev.map((c) =>
              c.id === m.thread_id && !c.messages.some((x) => x.id === m.id)
                ? { ...c, messages: [...c.messages, m] }
                : c,
            ),
          );
          if (m.thread_id === selectedId && m.sender_id !== currentUserId) {
            markRead(m.thread_id);
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, convos.map((c) => c.id).join(","), selectedId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [selected?.messages.length, selectedId]);

  async function send() {
    const body = draft.trim();
    if (!body || !selected || sending) return;
    setSending(true);
    setDraft("");
    const { data } = await supabase
      .from("messages")
      .insert({ thread_id: selected.id, sender_id: currentUserId, body })
      .select()
      .single();
    if (data) {
      const m = data as Message;
      setConvos((prev) =>
        prev.map((c) =>
          c.id === m.thread_id && !c.messages.some((x) => x.id === m.id)
            ? { ...c, messages: [...c.messages, m] }
            : c,
        ),
      );
    }
    setSending(false);
  }

  if (convos.length === 0) {
    return (
      <div className="grid min-h-[50vh] place-items-center rounded-2xl border border-dashed border-hairline bg-card text-center">
        <div className="p-8">
          <MessageSquare className="mx-auto h-8 w-8 text-brand" />
          <p className="mt-3 text-ink-soft">No conversations yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] min-h-[26rem] overflow-hidden rounded-2xl border border-hairline bg-card">
      {/* Chat list */}
      <aside
        className={`w-full shrink-0 flex-col border-r border-hairline lg:flex lg:w-80 ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="border-b border-hairline px-4 py-3">
          <p className="font-display text-lg font-semibold text-ink">Chats</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.map((c) => {
            const o = other(c);
            const last = lastOf(c);
            const active = c.id === selectedId;
            const unread = unreadCount(c, currentUserId);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => openThread(c.id)}
                className={`flex w-full items-center gap-3 border-b border-hairline/60 px-4 py-3 text-left transition-colors ${
                  active ? "bg-brand-50" : "hover:bg-paper-sunk/60"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold uppercase text-brand">
                  {(o?.name ?? "?").slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-ink">
                      {o?.name ?? "Conversation"}
                    </span>
                    {last && (
                      <span className="shrink-0 text-[0.68rem] text-ink-faint">
                        {fmtTime(last.created_at)}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`min-w-0 flex-1 truncate text-sm ${
                        unread > 0 ? "font-medium text-ink" : "text-ink-soft"
                      }`}
                    >
                      {last
                        ? `${last.sender_id === currentUserId ? "You: " : ""}${last.body}`
                        : "No messages yet"}
                    </span>
                    {unread > 0 && (
                      <span className="grid h-5 min-w-[1.25rem] shrink-0 place-items-center rounded-full bg-coral px-1.5 text-[0.7rem] font-semibold text-white">
                        {unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Detail */}
      <section
        className={`min-w-0 flex-1 flex-col ${selected ? "flex" : "hidden lg:flex"}`}
      >
        {selected ? (
          <>
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-paper-sunk lg:hidden"
                aria-label="Back to chats"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand">
                {(other(selected)?.name ?? "?").slice(0, 1)}
              </span>
              <div>
                <p className="font-medium text-ink">
                  {other(selected)?.name ?? "Conversation"}
                </p>
                <p className="text-xs text-sage">● Encrypted</p>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-2.5 overflow-y-auto bg-paper-sunk/30 px-4 py-4"
            >
              {selected.messages.map((m) => {
                const mine = m.sender_id === currentUserId;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-brand text-white"
                          : "rounded-bl-sm border border-hairline bg-card text-ink"
                      }`}
                    >
                      {m.body}
                    </div>
                    <span className="mt-1 text-[0.66rem] text-ink-faint">
                      {fmtTime(m.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-hairline p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-hairline bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand-200"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="hidden flex-1 place-items-center text-ink-faint lg:grid">
            Select a conversation
          </div>
        )}
      </section>
    </div>
  );
}
