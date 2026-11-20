import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Create Meeting",
  description: "Plan the program for a new sacrament meeting.",
  robots: { index: false, follow: false }, // leader tools don't belong in search results
};

export default async function NewMeetingPage() {
  // The proxy has already sent visitors to /login; this is a second check in case it is bypassed.
  await connection(); // the session is per request
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=%2Fmeetings%2Fnew");

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
