// Shown while a meetings page waits for its data. With in-memory data this resolves
// almost instantly, so it may not be visible until a real database adds latency.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-8 text-gray-700">
      <p className="text-lg">Loading meetings...</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2" aria-hidden="true">
        <div className="h-28 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-28 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
