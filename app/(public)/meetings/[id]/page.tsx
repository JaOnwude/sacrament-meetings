import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import PrintButton from "@/components/PrintButton";
import { getMeetingById } from "@/lib/meetings-db";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  // Not a positive whole number: there can't be such a meeting.
  if (!Number.isInteger(numericId) || numericId < 1) notFound();

  const meeting = await getMeetingById(numericId);
  if (!meeting) notFound();

  return (
    <main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/meetings" className="text-brand hover:underline">
          &larr; Back to all meetings
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="rounded border border-brand px-4 py-2 font-semibold text-brand hover:bg-blue-50"
          >
            Edit meeting
          </Link>
          <PrintButton />
        </div>
      </div>
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
