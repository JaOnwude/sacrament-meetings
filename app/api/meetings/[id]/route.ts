import { getMeetingById } from "@/lib/meetings-db";
import type { ApiErrorBody } from "@/lib/types";

// GET /api/meetings/1
//   200 -> the meeting
//   400 -> id is not a positive whole number
//   404 -> no meeting with that id
// In this version of Next.js, `params` is a Promise, so it is awaited.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId < 1) {
    const body: ApiErrorBody = { error: "id must be a positive whole number" };
    return Response.json(body, { status: 400 });
  }

  const meeting = getMeetingById(numericId);
  if (!meeting) {
    const body: ApiErrorBody = { error: "Meeting not found" };
    return Response.json(body, { status: 404 });
  }

  return Response.json(meeting);
}
