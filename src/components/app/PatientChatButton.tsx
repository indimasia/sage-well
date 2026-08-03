"use client";

import { useActionState } from "react";
import { MessageSquare } from "@/components/site/icons";
import { openThread, type ThreadResult } from "@/lib/actions";

export default function PatientChatButton({
  therapistId,
}: {
  therapistId: string;
}) {
  const [state, action, pending] = useActionState<ThreadResult, FormData>(
    openThread.bind(null, therapistId),
    {},
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={action}>
        <button
          type="submit"
          disabled={pending}
          aria-label={pending ? "Opening chat" : "Message your therapist"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-brand disabled:opacity-70"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {pending ? "Opening…" : "Chat"}
          </span>
        </button>
      </form>
      {state.error && (
        <p role="alert" className="max-w-44 text-right text-xs text-coral">
          {state.error}
        </p>
      )}
    </div>
  );
}
