"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Logo } from "@/components/site/icons";
import { signIn, signUp, type AuthState } from "./actions";

type Mode = "signin" | "signup";
type Role = "therapist" | "patient";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<Role>("therapist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [signInState, signInAction, signInPending] = useActionState<
    AuthState,
    FormData
  >(signIn, {});
  const [signUpState, signUpAction, signUpPending] = useActionState<
    AuthState,
    FormData
  >(signUp, {});

  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  const fieldCls =
    "w-full rounded-lg border border-hairline bg-card px-4 py-3 text-ink placeholder:text-ink-faint focus:border-brand-200";

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 text-ink"
        aria-label="SageWell home"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
          <Logo className="h-5 w-5" />
        </span>
        <span className="font-display text-2xl font-semibold">SageWell</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold text-ink">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-ink-soft">
        {mode === "signin"
          ? "Sign in to your practice or client portal."
          : "Set up a demo therapist or client account."}
      </p>

      {/* Mode tabs */}
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-hairline bg-paper-sunk p-1">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-xl py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-card text-ink ring-1 ring-hairline"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form
        action={mode === "signin" ? signInAction : signUpAction}
        className="mt-6 flex flex-col gap-4"
      >
        {mode === "signup" && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              Account type
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["therapist", "patient"] as Role[]).map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium capitalize transition-colors ${
                    role === r
                      ? "border-brand bg-brand-50 text-brand"
                      : "border-hairline bg-card text-ink-soft hover:border-brand-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="sr-only"
                  />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {mode === "signup" && (
          <div>
            <label
              htmlFor="display_name"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Dr. Ada Adeyemi"
              className={fieldCls}
            />
            <p className="mt-1 text-xs text-ink-faint">
              Optional — defaults to the part before @ in your email.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@sagewell.app"
            className={fieldCls}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={fieldCls}
          />
        </div>

        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-coral/40 bg-coral-soft px-3 py-2 text-sm text-coral"
          >
            {state.error}
          </p>
        )}
        {state.message && (
          <p
            role="status"
            className="rounded-lg border border-sage/40 bg-sage-soft px-3 py-2 text-sm text-sage"
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 font-medium text-white shadow-card transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          {pending
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
