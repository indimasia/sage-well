import { redirect } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";
import { getCurrentUser } from "@/lib/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Dashboard is the therapist workspace; clients live in the portal.
  if (user.role === "patient") redirect("/portal");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar name={user.name} email={user.email} role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
