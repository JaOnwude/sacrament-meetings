import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";
import { meetingToFormValues } from "@/lib/meeting-form-values";

export const metadata: Metadata = { title: "Edit Meeting" };

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  // Not a positive whole number, or no such meeting: show not-found.tsx (next to this file).
  if (!Number.isInteger(numericId) || numericId < 1) notFound();
  const meeting = await getMeetingById(numericId);
  if (!meeting) notFound();

  return (
    <main>
      <h1 className="font-heading text-3xl font-bold text-gray-900">Edit Meeting</h1>
      <p className="mb-6 mt-2 text-gray-800">Change the program, then save.</p>
      {/* bind(null, id): the action receives the id first, then (prevState, formData). */}
      <MeetingForm
        action={updateMeeting.bind(null, numericId)}
        initialValues={meetingToFormValues(meeting)}
        submitLabel="Save changes"
      />
    </main>
  );
}
