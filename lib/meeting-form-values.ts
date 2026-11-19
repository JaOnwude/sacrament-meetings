import type { SacramentMeeting } from "./types";
import type { FormValues } from "./actions";
import { hasSacrament } from "./meeting-utils";

// Turns a saved meeting into the text values the edit form starts with.
// (The inverse of toMeetingData in lib/actions.ts.)
export function meetingToFormValues(meeting: SacramentMeeting): FormValues {
  const sacrament = hasSacrament(meeting.meetingType);
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join("\n"),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join("\n"),
    stakeBusiness: meeting.stakeBusiness ? "on" : "",
    sacramentHymnNumber: sacrament ? String(meeting.sacramentHymn.number) : "",
    sacramentHymnTitle: sacrament ? meeting.sacramentHymn.title : "",
    speakers: meeting.speakers
      .map((item) => `${item.name} | ${item.topic} | ${item.type === "musical-number" ? "music" : "speaker"}`)
      .join("\n"),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}
