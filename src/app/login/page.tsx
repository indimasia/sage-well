import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "./AuthForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(user.user_metadata?.role === "patient" ? "/portal" : "/dashboard");
  }

  return (
    <main className="grid flex-1 place-items-center px-5 py-16">
      <AuthForm />
    </main>
  );
}
