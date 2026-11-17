import { redirect } from "next/navigation";
import { connection } from "next/server";
import { fetchMeetings } from "@/lib/api";
import { getMostRecentSunday } from "@/lib/dates";

// Redirects to the program for the most recent Sunday (today, if today is Sunday).
// If no meeting is planned for that Sunday, fall back to the full list.
export default async function CurrentMeetingPage() {
  await connection(); // "today" is different on each request
  const sunday = getMostRecentSunday(new Date());
  const matches = await fetchMeetings(sunday);

  // redirect() works by throwing, so it must not sit inside a try/catch.
  redirect(matches.length > 0 ? `/meetings/${matches[0].id}` : "/meetings");
}
