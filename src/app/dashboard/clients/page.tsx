import DashStub from "@/components/app/DashStub";
import { Users } from "@/components/site/icons";

export const metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <DashStub
      title="Clients"
      Icon={Users}
      blurb="Your caseload and care-team view is coming next — built on the same RLS-isolated data as your appointments."
    />
  );
}
