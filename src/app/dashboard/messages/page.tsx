import Conversations from "@/components/app/Conversations";
import { getConversations, getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await getCurrentUser();
  const conversations = await getConversations();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Messages
      </h1>
      <p className="mt-2 text-ink-soft">
        Encrypted threads with your clients. Visible only to participants.
      </p>
      <div className="mt-8">
        <Conversations
          conversations={conversations}
          currentUserId={user?.id ?? ""}
          viewerRole="therapist"
        />
      </div>
    </div>
  );
}
