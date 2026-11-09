import { getMeetings } from "@/lib/meetings-db";
import type { ApiErrorBody, SacramentMeeting } from "@/lib/types";

// GET /api/meetings               -> every meeting
// GET /api/meetings?date=2026-05-03 -> meetings on that date
export async function GET(request: Request): Promise<Response> {
  const date = new URL(request.url).searchParams.get("date"); // string, or null when omitted

  if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const body: ApiErrorBody = { error: "date must be in YYYY-MM-DD format" };
    return Response.json(body, { status: 400 });
  }

  const meetings: SacramentMeeting[] = getMeetings(date);
  return Response.json(meetings);
}
