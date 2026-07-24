import DashStub from "@/components/app/DashStub";
import { Settings } from "@/components/site/icons";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <DashStub
      title="Settings"
      Icon={Settings}
      blurb="Profile, availability and billing preferences will be configurable here."
    />
  );
}
