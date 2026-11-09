import { headers } from "next/headers";
import type { SacramentMeeting } from "./types";

// A Server Component can't fetch a relative URL like "/api/meetings", so this builds
// the full origin from the incoming request headers. It works on localhost, on a
// Vercel preview URL and in production without any environment variable.
async function getBaseUrl(): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

// GET /api/meetings, or /api/meetings?date=YYYY-MM-DD
export async function fetchMeetings(date?: string): Promise<SacramentMeeting[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const response = await fetch(`${await getBaseUrl()}/api/meetings${query}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new ApiRequestError(response.status, "Could not load meetings");
  }
  return (await response.json()) as SacramentMeeting[];
}

// GET /api/meetings/[id]. Returns null when the API answers 404.
export async function fetchMeeting(id: number): Promise<SacramentMeeting | null> {
  const response = await fetch(`${await getBaseUrl()}/api/meetings/${id}`, {
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ApiRequestError(response.status, "Could not load the meeting");
  }
  return (await response.json()) as SacramentMeeting;
}
