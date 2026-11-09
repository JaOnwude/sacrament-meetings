export type MeetingTiming = "current" | "upcoming" | "past";

// Builds 'YYYY-MM-DD' from the Date's local parts. (toISOString() would convert
// to UTC first and can land on the wrong day.)
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Date.getDay() is 0 for Sunday ... 6 for Saturday, so subtracting it rolls back to Sunday.
export function getMostRecentSunday(now: Date): string {
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  return toIsoDate(sunday);
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
