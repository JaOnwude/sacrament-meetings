"use client";

interface DeleteMeetingButtonProps {
  // A Server Action already bound to the meeting id: deleteMeeting.bind(null, id).
  action: () => Promise<void>;
  // e.g. "the meeting on Sunday, November 1, 2026", used in the confirm text and the accessible name.
  meetingLabel: string;
}

// A small form so the delete runs as a Server Action. It is a Client Component only because
// it asks for confirmation first (window.confirm); cancelling stops the form from submitting.
export default function DeleteMeetingButton({ action, meetingLabel }: DeleteMeetingButtonProps) {
  return (
    <form action={action}>
      <button
        type="submit"
        aria-label={`Delete ${meetingLabel}`}
        onClick={(event) => {
          if (!window.confirm(`Delete ${meetingLabel}? This cannot be undone.`)) {
            event.preventDefault();
          }
        }}
        className="rounded border border-red-700 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
