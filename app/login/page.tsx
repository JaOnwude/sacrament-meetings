import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { toSafePath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to plan and edit sacrament meeting programs.",
  robots: { index: false, follow: false }, // a login page doesn't belong in search results
};

export default function LoginPage(props: { searchParams?: Promise<{ callbackUrl?: string }> }) {
  return (
    <main className="mx-auto max-w-sm px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900">Sign in</h1>
      <p className="mb-6 mt-2 text-gray-800">
        For bishopric members who manage the sacrament meeting schedule. Everyone else can view
        and print programs without signing in.
      </p>
      {/* the callbackUrl is only known per request, so this part streams in */}
      <Suspense fallback={<p role="status" className="text-gray-700">Loading...</p>}>
        <LoginFormWithRedirect searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginFormWithRedirect({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  // Auth.js adds ?callbackUrl=<full address of the page the visitor wanted>. Keep only its path.
  return <LoginForm redirectTo={toSafePath(params?.callbackUrl)} />;
}
