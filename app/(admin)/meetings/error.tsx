"use client";

import Link from "next/link";
import { useEffect } from "react";

// Catches errors that nothing else caught in the create and edit pages (for example a
// database failure that the Server Action re-threw). It must be a Client Component.
export default function AdminMeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("An uncaught error occurred:", error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto mt-8 max-w-xl rounded-lg border border-gray-300 bg-white p-6 text-center shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-gray-800">{error.message || "An unexpected error occurred. Please try again."}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          Try Again
        </button>
        <Link href="/meetings" className="rounded border border-gray-500 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">
          Back to meetings
        </Link>
      </div>
    </div>
  );
}
