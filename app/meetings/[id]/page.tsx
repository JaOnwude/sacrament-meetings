import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import PrintButton from "@/components/PrintButton";
import { fetchMeeting } from "@/lib/api";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  // Not a positive whole number: there can't be such a meeting.
  if (!Number.isInteger(numericId) || numericId < 1) notFound();

  const meeting = await fetchMeeting(numericId);
  if (!meeting) notFound();

  return (
    <main>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/meetings" className="text-brand hover:underline">
          &larr; Back to all meetings
        </Link>
        <PrintButton />
      </div>
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
