import type { Hymn, SacramentMeeting } from "@/lib/types";
import { formatLongDate } from "@/lib/dates";
import { hasSacrament, meetingTypeLabels } from "@/lib/meeting-utils";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function HymnText({ hymn }: { hymn: Hymn }) {
  return (
    <>
      #{hymn.number} {hymn.title}
    </>
  );
}

// One labelled row of the program (a term and its description).
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-gray-200 py-3 sm:grid-cols-3 print:border-gray-400">
      <dt className="font-semibold text-gray-900">{label}</dt>
      <dd className="text-gray-800 sm:col-span-2">{children}</dd>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const sacrament = hasSacrament(meeting.meetingType);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
      <header className="mb-4">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          {formatLongDate(meeting.date)}
        </h1>
        <p className="mt-1 text-lg text-gray-800">{meetingTypeLabels[meeting.meetingType]}</p>
      </header>

      <dl>
        <Row label="Presiding">{meeting.presiding}</Row>
        <Row label="Conducting">{meeting.conducting}</Row>

        {meeting.announcements && meeting.announcements.length > 0 && (
          <Row label="Announcements">
            <ul className="list-disc pl-5">
              {meeting.announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          </Row>
        )}

        <Row label="Opening Hymn">
          <HymnText hymn={meeting.openingHymn} />
        </Row>
        <Row label="Opening Prayer">{meeting.openingPrayer}</Row>

        <Row label="Ward Business">
          {meeting.wardBusiness.length > 0 ? (
            <ul className="list-disc pl-5">
              {meeting.wardBusiness.map((item) => (
                <li key={item.description}>{item.description}</li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </Row>
        <Row label="Stake Business">{meeting.stakeBusiness ? "Yes" : "No"}</Row>

        {sacrament ? (
          <Row label="Sacrament Hymn">
            <HymnText hymn={meeting.sacramentHymn} />
          </Row>
        ) : (
          <Row label="Sacrament">Not part of this meeting</Row>
        )}

        <Row label="Speakers and Musical Numbers">
          {meeting.speakers.length > 0 ? (
            <ul className="space-y-1">
              {meeting.speakers.map((item) => (
                <li key={`${item.type}-${item.name}`}>
                  <span className="font-medium">{item.name}</span>
                  {item.type === "musical-number" && " (musical number)"}
                  {item.topic && ` — ${item.topic}`}
                </li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </Row>

        <Row label="Closing Hymn">
          <HymnText hymn={meeting.closingHymn} />
        </Row>
        <Row label="Closing Prayer">{meeting.closingPrayer}</Row>
      </dl>
    </article>
  );
}
