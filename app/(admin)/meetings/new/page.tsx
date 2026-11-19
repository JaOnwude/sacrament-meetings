import type { Metadata } from "next";
import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export const metadata: Metadata = { title: "Create Meeting" };

export default function NewMeetingPage() {
  return (
    <main>
      <h1 className="font-heading text-3xl font-bold text-gray-900">Create Meeting</h1>
      <p className="mb-6 mt-2 text-gray-800">Fill in the program for a Sunday meeting.</p>
      <MeetingForm
        action={createMeeting}
        initialValues={{ meetingType: "regular" }}
        submitLabel="Create meeting"
      />
    </main>
  );
}
