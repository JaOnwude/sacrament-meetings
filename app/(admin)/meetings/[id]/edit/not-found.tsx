import Link from "next/link";

// Shown when the edit page calls notFound() (a bad or missing meeting id).
export default function MeetingNotFound() {
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-lg border border-gray-300 bg-white p-6 text-center shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Meeting not found</h1>
      <p className="mt-3 text-gray-800">
        The meeting you are looking for does not exist. It may have been deleted.
      </p>
      <p className="mt-6">
        <Link
          href="/meetings"
          className="rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          Back to meetings
        </Link>
      </p>
    </div>
  );
}
