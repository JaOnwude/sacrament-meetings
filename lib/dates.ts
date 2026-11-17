export type MeetingTiming = "current" | "upcoming" | "past";

// Builds 'YYYY-MM-DD' from the Date's local parts. (toISOString() would convert
// to UTC first and can land on the wrong day.)
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// The ward's time zone. "Today" is worked out here rather than in the server's
// time zone (Vercel servers run in UTC), so the current Sunday flips at local
// midnight. Override with WARD_TIME_ZONE (an IANA name such as "America/Denver").
export const WARD_TIME_ZONE = process.env.WARD_TIME_ZONE ?? "Africa/Lagos";

// Today's calendar date in the given time zone, as 'YYYY-MM-DD'.
export function todayInTimeZone(now: Date, timeZone: string = WARD_TIME_ZONE): string {
  // The en-CA locale formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// The most recent Sunday (today, if today is Sunday) in the ward's time zone.
// The day arithmetic is done in UTC so the server's own time zone can't shift it.
export function getMostRecentSunday(now: Date, timeZone: string = WARD_TIME_ZONE): string {
  const today = new Date(`${todayInTimeZone(now, timeZone)}T00:00:00Z`);
  // getUTCDay() is 0 for Sunday ... 6 for Saturday, so subtracting it rolls back to Sunday.
  today.setUTCDate(today.getUTCDate() - today.getUTCDay());
  return today.toISOString().slice(0, 10);
}

// ISO date strings compare correctly as plain strings.
export function getTiming(meetingDate: string, currentSunday: string): MeetingTiming {
  if (meetingDate === currentSunday) return "current";
  return meetingDate > currentSunday ? "upcoming" : "past";
}

// Formats 'YYYY-MM-DD' as e.g. "Sunday, November 1, 2026". Parsing as UTC and
// formatting in UTC keeps the day from shifting with the viewer's time zone.
export function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
