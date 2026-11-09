import type { SacramentMeeting } from "./types";

// Temporary in-memory data for this week. A real database replaces this module later;
// the API routes only call the functions below, so they won't need to change.
// All names are fictional sample data. Hymn numbers and titles are sample values:
// check them against the hymnbook before using the app for real.
const noSacrament = { number: 0, title: "Not applicable (no sacrament)" };

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-05-03",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Ward temple night: May 10"],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Williams",
    wardBusiness: [{ description: "Sustaining of new Primary president" }],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: "In Remembrance of Thy Suffering" },
    speakers: [
      { name: "Sister Brown", topic: "Faith in Jesus Christ", type: "speaker" },
      { name: "Youth Choir", topic: "", type: "musical-number" },
    ],
    closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
    closingPrayer: "Brother Davis",
  },
  {
    id: 2,
    date: "2026-10-04",
    meetingType: "general",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["General Conference broadcast begins at 10:00 AM in the chapel"],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Brother Adams",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: noSacrament,
    speakers: [{ name: "General Conference session", topic: "Watched together as a ward", type: "speaker" }],
    closingHymn: { number: 27, title: "Praise to the Man" },
    closingPrayer: "Sister Clark",
  },
  {
    id: 3,
    date: "2026-10-11",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Ward choir practice Wednesday at 7:00 PM", "Food drive collection in the foyer"],
    openingHymn: { number: 30, title: "Come, Come, Ye Saints" },
    openingPrayer: "Sister Taylor",
    wardBusiness: [{ description: "Release and sustaining of Sunday School teachers" }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: "Brother Lewis", topic: "Gratitude in Daily Life", type: "speaker" },
      { name: "Sister Moore", topic: "Serving Those Around Us", type: "speaker" },
      { name: "Primary Children", topic: "Musical number", type: "musical-number" },
    ],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Hall",
  },
  {
    id: 4,
    date: "2026-10-18",
    meetingType: "stake",
    presiding: "President Allen (Stake President)",
    conducting: "President Allen",
    announcements: ["Stake conference: no ward meetings after this session"],
    openingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
    openingPrayer: "Sister Young",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: noSacrament,
    speakers: [
      { name: "Stake Presidency", topic: "Strengthening Families", type: "speaker" },
      { name: "Stake Choir", topic: "Musical number", type: "musical-number" },
    ],
    closingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    closingPrayer: "Brother King",
  },
  {
    id: 5,
    date: "2026-10-25",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Youth service project Saturday at 9:00 AM"],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Brother Scott",
    wardBusiness: [{ description: "Sustaining of new ward clerk" }],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "Sister Green", topic: "Hope in Christ", type: "speaker" },
      { name: "Brother Wright", topic: "Keeping Covenants", type: "speaker" },
    ],
    closingHymn: { number: 30, title: "Come, Come, Ye Saints" },
    closingPrayer: "Sister Baker",
  },
  {
    id: 6,
    date: "2026-11-01",
    meetingType: "testimony",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Fast offerings help those in need. Please give generously."],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Sister Nelson",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: "In Remembrance of Thy Suffering" },
    speakers: [
      { name: "Members of the ward", topic: "Bearing of testimonies", type: "speaker" },
    ],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Carter",
  },
  {
    id: 7,
    date: "2026-11-08",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Thanksgiving ward dinner sign-up is open"],
    openingHymn: { number: 27, title: "Praise to the Man" },
    openingPrayer: "Brother Phillips",
    wardBusiness: [{ description: "Sustaining of new Young Women president" }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: "Sister Turner", topic: "The Atonement of Jesus Christ", type: "speaker" },
      { name: "Ward Choir", topic: "Musical number", type: "musical-number" },
      { name: "Brother Evans", topic: "Service and Love", type: "speaker" },
    ],
    closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
    closingPrayer: "Sister Roberts",
  },
  {
    id: 8,
    date: "2026-11-15",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    openingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
    openingPrayer: "Sister Hughes",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "Brother Collins", topic: "Family History and Temple Work", type: "speaker" },
      { name: "Sister Reed", topic: "Finding Peace", type: "speaker" },
    ],
    closingHymn: { number: 2, title: "The Spirit of God" },
    closingPrayer: "Brother Foster",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter((m) => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}
