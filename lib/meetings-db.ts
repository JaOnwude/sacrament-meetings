import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type {
  Hymn,
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
} from "./types";

export const ITEMS_PER_PAGE = 5;

// The Neon client is created on first use, so a missing DATABASE_URL gives a clear
// message when a query runs instead of crashing when the module is imported.
// <false, false> = the default mode: rows come back as an array of objects.
let cachedSql: NeonQueryFunction<false, false> | undefined;

function getSql(): NeonQueryFunction<false, false> {
  if (!cachedSql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` and restart.");
    }
    cachedSql = neon(databaseUrl);
  }
  return cachedSql;
}

// One row exactly as the SELECT below returns it. The AS "camelCase" aliases in the SQL
// make the column names match the SacramentMeeting fields. JSONB columns arrive already
// parsed, and TEXT[] arrives as a string[]. Nullable columns can still be null.
interface MeetingRow {
  id: number;
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[] | null;
  stakeBusiness: boolean | null;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[] | null;
  closingHymn: Hymn;
  closingPrayer: string;
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: Number(row.id),
    date: row.date,
    meetingType: row.meetingType,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.openingHymn,
    openingPrayer: row.openingPrayer,
    wardBusiness: row.wardBusiness ?? [],
    stakeBusiness: row.stakeBusiness ?? false,
    sacramentHymn: row.sacramentHymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closingHymn,
    closingPrayer: row.closingPrayer,
  };
}

// Turns the user's search text into a LIKE pattern. The text is trimmed, capped at 100
// characters, and the LIKE wildcards (% and _) and the escape character are escaped, so a
// search for "50%" matches that text. The value is still sent as a query parameter (${...}
// in the SQL below), never joined into the SQL text.
function toLikePattern(query: string): string {
  const cleaned = query.trim().slice(0, 100).replace(/[\\%_]/g, "\\$&");
  return `%${cleaned}%`;
}

// Matches the search against presiding, conducting, meeting type, and each speaker's name
// or topic. (Searching the whole speakers JSON as text would also match the field names
// "name", "topic" and "type", so searching "type" would return every meeting.)
export async function getMeetings(
  query: string = "",
  currentPage: number = 1,
): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const searchTerm = toLikePattern(query);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      presiding ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
        WHERE speaker->>'name' ILIKE ${searchTerm}
           OR speaker->>'topic' ILIKE ${searchTerm}
      )
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return (rows as unknown as MeetingRow[]).map(toMeeting);
}

// How many pages the same search produces (needed for the pagination controls).
export async function getMeetingsTotalPages(query: string = ""): Promise<number> {
  const sql = getSql();
  const searchTerm = toLikePattern(query);

  const rows = await sql`
    SELECT COUNT(*) AS count FROM meetings
    WHERE
      presiding ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
        WHERE speaker->>'name' ILIKE ${searchTerm}
           OR speaker->>'topic' ILIKE ${searchTerm}
      )
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

// Every meeting, newest first (used by the API when no filter is given).
export async function getAllMeetings(): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    ORDER BY date DESC
  `;
  return (rows as unknown as MeetingRow[]).map(toMeeting);
}

// Meetings on one exact date ('YYYY-MM-DD'), used by ?date= and by /meetings/current.
export async function getMeetingsByDate(date: string): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE date = ${date}
    ORDER BY id
  `;
  return (rows as unknown as MeetingRow[]).map(toMeeting);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
  return rows[0] ? toMeeting(rows[0] as unknown as MeetingRow) : null;
}

// Mutation stubs. They will be wired to the database in Week 04 when the forms are built.
export async function addMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  throw new Error("addMeeting: database implementation coming in Week 04");
}

export async function updateMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  throw new Error("updateMeeting: database implementation coming in Week 04");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteMeeting(_id: number): Promise<boolean> {
  throw new Error("deleteMeeting: database implementation coming in Week 04");
}
