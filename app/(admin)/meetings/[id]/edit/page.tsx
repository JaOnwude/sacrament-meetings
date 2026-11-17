import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Meeting" };

export default function EditMeetingPage() {
  return (
    <main>
      <h1 className="font-heading text-3xl font-bold text-gray-900">
        Edit Meeting &mdash; Coming in Week 04
      </h1>
      <p className="mt-3 text-gray-800">The form to edit a meeting will be built next week.</p>
    </main>
  );
}
