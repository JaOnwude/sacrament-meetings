import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import MeetingDetail from "@/components/MeetingDetail";
import PrintButton from "@/components/PrintButton";
import { formatLongDate } from "@/lib/dates";
import { meetingTypeLabels } from "@/lib/meeting-utils";
import { getMeetingById } from "@/lib/meetings-db";

type PageProps = { params: Promise<{ id: string }> };

// Each meeting gets its own title and description (from the database), so a shared link or
// a search result says which Sunday it is.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  const meeting = Number.isInteger(numericId) && numericId >= 1 ? await getMeetingById(numericId) : null;

  if (!meeting) {
    return { title: "Meeting not found", description: "That meeting could not be found." };
  }

  const longDate = formatLongDate(meeting.date);
  const description = `Program for ${longDate}: ${meetingTypeLabels[meeting.meetingType]}, conducted by ${meeting.conducting}.`;
  return {
    title: longDate,
    description,
    openGraph: { title: longDate, description },
  };
}

export default async function MeetingPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);

  // Not a positive whole number: there can't be such a meeting.
  if (!Number.isInteger(numericId) || numericId < 1) notFound();

  const meeting = await getMeetingById(numericId);
  if (!meeting) notFound();

  const session = await auth();
  const canEdit = Boolean(session?.user);

  return (
    <main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/meetings" className="text-brand hover:underline">
          &larr; Back to all meetings
        </Link>
        <div className="flex items-center gap-3">
          {canEdit && (
            <Link
              href={`/meetings/${meeting.id}/edit`}
              className="rounded border border-brand px-4 py-2 font-semibold text-brand hover:bg-blue-50"
            >
              Edit meeting
            </Link>
          )}
          <PrintButton />
        </div>
      </div>
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
