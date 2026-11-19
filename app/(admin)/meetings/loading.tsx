// Shown while the edit page loads its meeting from the database.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-8 text-gray-800">
      <p className="text-lg">Loading...</p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-24 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
