import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Meeting" };

export default function NewMeetingPage() {
  return (
    <main>
      <h1 className="font-heading text-3xl font-bold text-gray-900">
        Create Meeting &mdash; Coming in Week 04
      </h1>
      <p className="mt-3 text-gray-800">The form to plan a new meeting will be built next week.</p>
    </main>
  );
}
