import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import type { MeetingTiming } from "@/lib/dates";
import { formatLongDate } from "@/lib/dates";
import { meetingTypeLabels } from "@/lib/meeting-utils";

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

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-heading text-lg font-bold text-gray-900">
          <Link href={`/meetings/${meeting.id}`} className="text-brand hover:underline">
            {formatLongDate(meeting.date)}
          </Link>
        </h3>
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
    </article>
  );
}
