import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";
import { getMostRecentSunday, getTiming } from "@/lib/dates";

export const metadata: Metadata = { title: "Meetings" };

interface SearchParams {
  query?: string;
  page?: string;
}

export default function MeetingsPage(props: { searchParams?: Promise<SearchParams> }) {
  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold text-gray-900">Meetings</h1>
        <Link
          href="/meetings/new"
          className="rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          Plan a new meeting
        </Link>
      </div>
      {/* useSearchParams() needs a Suspense boundary above it */}
      <div className="mt-4">
        <Suspense fallback={<div aria-hidden="true" className="h-16 max-w-md animate-pulse rounded bg-gray-200" />}>
          <MeetingSearch />
        </Suspense>
      </div>
      <div className="mt-6">
        {/* the query and page are only known per request, so the results stream in */}
        <Suspense fallback={<p role="status" className="text-gray-700">Loading meetings...</p>}>
          <Results searchParams={props.searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Results({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = (params?.query ?? "").trim().slice(0, 100);
  const parsedPage = Math.floor(Number(params?.page));
  const currentPage = parsedPage >= 1 ? parsedPage : 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);
  // Read the clock after the database calls, so it is evaluated on each request.
  const currentSunday = getMostRecentSunday(new Date());

  // A page number past the end (e.g. ?page=99) has no rows even though the search has results.
  if (meetings.length === 0 && totalPages > 0) {
    return (
      <p role="status" className="text-gray-800">
        That page doesn&apos;t exist. There {totalPages === 1 ? "is 1 page" : `are ${totalPages} pages`} of
        results.{" "}
        <Link
          href={query ? `/meetings?query=${encodeURIComponent(query)}` : "/meetings"}
          className="text-brand underline"
        >
          Back to the first page
        </Link>
      </p>
    );
  }

  if (meetings.length === 0) {
    return (
      <p role="status" className="text-gray-800">
        {query ? `No meetings match "${query}".` : "No meetings have been planned yet."}
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <MeetingCard meeting={meeting} timing={getTiming(meeting.date, currentSunday)} />
          </li>
        ))}
      </ul>
      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </>
  );
}
