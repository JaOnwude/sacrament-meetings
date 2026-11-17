import {
  getAllMeetings,
  getMeetings,
  getMeetingsByDate,
} from "@/lib/meetings-db";
import type { ApiErrorBody, SacramentMeeting } from "@/lib/types";

// GET /api/meetings                         -> every meeting, newest first
// GET /api/meetings?date=2026-05-03         -> meetings on that date (empty array if none)
// GET /api/meetings?query=smith&page=2      -> one page (5) of search results
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // string, or null when omitted
  const query = searchParams.get("query");
  const page = searchParams.get("page");

  if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const body: ApiErrorBody = { error: "date must be in YYYY-MM-DD format" };
    return Response.json(body, { status: 400 });
  }

  // The data functions are async now (database calls), so every call is awaited.
  let meetings: SacramentMeeting[];
  if (date !== null) {
    meetings = await getMeetingsByDate(date);
  } else if (query !== null || page !== null) {
    const parsedPage = Math.floor(Number(page));
    meetings = await getMeetings(query ?? "", parsedPage >= 1 ? parsedPage : 1);
  } else {
    meetings = await getAllMeetings();
  }
  return Response.json(meetings);
}
