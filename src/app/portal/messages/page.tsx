import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import Messenger from "@/components/app/Messenger";
import { getConversations, getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Messages" };

export default async function PortalMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { thread } = await searchParams;
  const conversations = await getConversations();

  return (
    <AppShell name={user.name} email={user.email} role={user.role}>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Messages
      </h1>
      <p className="mt-1 text-ink-soft">
        Secure threads with your care team.
      </p>
      <div className="mt-6">
        <Messenger
          initialConversations={conversations}
          currentUserId={user.id}
          viewerRole="patient"
          initialSelectedId={thread}
        />
      </div>
    </AppShell>
  );
}
