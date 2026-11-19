import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import type { MeetingTiming } from "@/lib/dates";
import { formatLongDate } from "@/lib/dates";
import { meetingTypeLabels } from "@/lib/meeting-utils";
import { deleteMeeting } from "@/lib/actions";
import DeleteMeetingButton from "./DeleteMeetingButton";

interface MeetingCardProps {
  meeting: SacramentMeeting;
  timing: MeetingTiming;
}

const timingBadge: Record<MeetingTiming, { text: string; classes: string } | null> = {
  current: { text: "This week", classes: "bg-amber-100 text-amber-900" },
  upcoming: { text: "Upcoming", classes: "bg-blue-100 text-blue-900" },
  past: null,
};

export default function MeetingCard({ meeting, timing }: MeetingCardProps) {
  const badge = timingBadge[timing];
  const longDate = formatLongDate(meeting.date);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="font-heading text-lg font-bold text-gray-900">
          <Link href={`/meetings/${meeting.id}`} className="text-brand hover:underline">
            {longDate}
          </Link>
        </h2>
        {badge && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.classes}`}>
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-800">{meetingTypeLabels[meeting.meetingType]}</p>
      <p className="mt-1 text-sm text-gray-700">Conducting: {meeting.conducting}</p>
      <p className="text-sm text-gray-700">
        {meeting.speakers.length} speaker or musical item{meeting.speakers.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Link
          href={`/meetings/${meeting.id}/edit`}
          aria-label={`Edit the meeting on ${longDate}`}
          className="rounded border border-brand px-3 py-1 text-sm font-semibold text-brand hover:bg-blue-50"
        >
          Edit
        </Link>
        <DeleteMeetingButton
          action={deleteMeeting.bind(null, meeting.id)}
          meetingLabel={`the meeting on ${longDate}`}
        />
      </div>
    </article>
  );
}
