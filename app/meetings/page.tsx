import type { Metadata } from "next";
import MeetingCard from "@/components/MeetingCard";
import { fetchMeetings } from "@/lib/api";
import { getMostRecentSunday, getTiming } from "@/lib/dates";

export const metadata: Metadata = { title: "Meetings" };

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();
  // Read the clock after the request-time fetch, so it is evaluated for each request.
  const currentSunday = getMostRecentSunday(new Date());

  const upcoming = meetings
    .filter((meeting) => meeting.date >= currentSunday)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = meetings
    .filter((meeting) => meeting.date < currentSunday)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <h1 className="font-heading text-3xl font-bold text-gray-900">Meetings</h1>

      <section aria-labelledby="current-heading" className="mt-6">
        <h2 id="current-heading" className="mb-3 text-xl font-semibold text-gray-900">
          Current and upcoming
        </h2>
        {upcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                timing={getTiming(meeting.date, currentSunday)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No current or upcoming meetings are planned yet.</p>
        )}
      </section>

      <section aria-labelledby="past-heading" className="mt-8">
        <h2 id="past-heading" className="mb-3 text-xl font-semibold text-gray-900">
          Past programs
        </h2>
        {past.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} timing="past" />
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No past programs.</p>
        )}
      </section>
    </main>
  );
}
