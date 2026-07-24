"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

type Role = "therapist" | "patient";

function homeFor(role: string | undefined): string {
  return role === "patient" ? "/portal" : "/dashboard";
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(homeFor(data.user?.user_metadata?.role));
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  // Fall back to the email local-part when no display name is given.
  const display_name =
    String(formData.get("display_name") ?? "").trim() || email.split("@")[0];

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };
  if (role !== "therapist" && role !== "patient")
    return { error: "Pick an account type." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, display_name } },
  });

  if (error) return { error: error.message };

  // Email confirmation OFF → session returned → straight in.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(homeFor(role));
  }

  // Email confirmation ON → no session yet.
  return {
    message:
      "Account created. If sign-in fails, turn off ‘Confirm email’ in Supabase → Authentication → Providers (demo), then sign in.",
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
