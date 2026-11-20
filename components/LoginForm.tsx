"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";

interface LoginFormProps {
  // Where to go after signing in (the protected page the visitor tried to open).
  redirectTo: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby="login-error"
          className="block w-full rounded border border-gray-500 bg-white px-3 py-2 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby="login-error"
          className="block w-full rounded border border-gray-500 bg-white px-3 py-2 text-gray-900"
        />
      </div>
      <div id="login-error" aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <p role="alert" className="rounded border border-red-700 bg-red-50 px-3 py-2 font-medium text-red-800">
            {errorMessage}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
