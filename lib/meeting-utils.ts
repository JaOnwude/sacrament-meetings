import type { MeetingType } from "./types";

export const meetingTypeLabels: Record<MeetingType, string> = {
  regular: "Regular Sacrament Meeting",
  testimony: "Fast and Testimony Meeting",
  stake: "Stake Conference (no sacrament)",
  general: "General Conference (no sacrament)",
  special: "Special Meeting",
};

// Stake and general conference sessions are non-sacrament meetings, so the
// sacrament hymn is not shown for them. A "special" meeting is treated the same way
// until the ward decides otherwise.
export function hasSacrament(type: MeetingType): boolean {
  return type === "regular" || type === "testimony";
}
