"use client";

// Error boundaries must be Client Components. It shows if an API call fails.
export default function MeetingsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="py-8">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-800">The meetings could not be loaded. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Try again
      </button>
    </div>
  );
}
