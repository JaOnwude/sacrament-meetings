"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// The search text lives in the URL (?query=...), not in React state, so a search can be
// shared, bookmarked, refreshed and reached with the back button.
export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Wait 300 ms after the last keystroke before updating the URL, so the database is
  // not queried on every key press.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // a new search always starts on page 1
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // replace (not push), so each search doesn't add a browser-history entry.
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="max-w-md">
      <label htmlFor="meeting-search" className="mb-1 block text-sm font-semibold text-gray-900">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings"
        placeholder="Search by speaker, leader, or meeting type..."
        // defaultValue (not value): the URL is the source of truth, so a shared link opens
        // with its search already filled in.
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded border border-gray-500 bg-white px-3 py-2"
      />
    </div>
  );
}
