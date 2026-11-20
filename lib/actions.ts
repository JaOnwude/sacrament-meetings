"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  addMeeting,
  updateMeeting as updateMeetingRecord,
  deleteMeeting as deleteMeetingRecord,
} from "./meetings-db";
import type { SacramentMeeting, SpeakerItem } from "./types";

// A "use server" file can only export async functions (and types), so the schema and the
// helpers below are private to this file.

// The form field names. FormData values are untyped strings, so everything is read as text.
export type FieldName =
  | "date"
  | "meetingType"
  | "presiding"
  | "conducting"
  | "announcements"
  | "openingHymnNumber"
  | "openingHymnTitle"
  | "openingPrayer"
  | "wardBusiness"
  | "stakeBusiness"
  | "sacramentHymnNumber"
  | "sacramentHymnTitle"
  | "speakers"
  | "closingHymnNumber"
  | "closingHymnTitle"
  | "closingPrayer";

export type FormValues = Partial<Record<FieldName, string>>;

// What the form gets back from an action. `values` returns what the user typed, because
// React clears an uncontrolled form after an action runs, and nobody wants to retype it.
export type State = {
  errors?: Partial<Record<FieldName, string[]>>;
  message?: string | null;
  values?: FormValues;
};

const FIELD_NAMES: FieldName[] = [
  "date", "meetingType", "presiding", "conducting", "announcements",
  "openingHymnNumber", "openingHymnTitle", "openingPrayer", "wardBusiness", "stakeBusiness",
  "sacramentHymnNumber", "sacramentHymnTitle", "speakers",
  "closingHymnNumber", "closingHymnTitle", "closingPrayer",
];

function readValues(formData: FormData): FormValues {
  const values: FormValues = {};
  for (const name of FIELD_NAMES) {
    const entry = formData.get(name);
    values[name] = typeof entry === "string" ? entry : "";
  }
  return values;
}

function isRealDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// One speaker or musical number per line: "Name | Topic | speaker" or "Name | Topic | music".
// Topic and type are optional (the type defaults to speaker).
function parseSpeakerLine(line: string): SpeakerItem {
  const [name = "", topic = "", kind = ""] = line.split("|").map((part) => part.trim());
  const isMusic = /^(music|musical|musical-number|musical number)$/i.test(kind);
  return { name, topic, type: isMusic ? "musical-number" : "speaker" };
}

const MeetingFormSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.")
      .refine(isRealDate, "Enter a real date."),
    meetingType: z.enum(["regular", "testimony", "stake", "general", "special"], {
      error: "Choose a meeting type.",
    }),
    presiding: z.string().trim().min(2, "Enter who is presiding.").max(255, "Use 255 characters or fewer."),
    conducting: z.string().trim().min(2, "Enter who is conducting.").max(255, "Use 255 characters or fewer."),
    announcements: z.string(),
    openingHymnNumber: z.coerce
      .number("Enter the opening hymn number.")
      .int("Hymn numbers are whole numbers.")
      .min(1, "Enter the opening hymn number.")
      .max(1000, "Hymn numbers are 1000 or less."),
    openingHymnTitle: z.string().trim().min(2, "Enter the opening hymn title."),
    openingPrayer: z.string().trim().min(2, "Enter who gives the opening prayer.").max(255),
    wardBusiness: z.string(),
    stakeBusiness: z.string(),
    // Required only for meetings that include the sacrament (checked below).
    sacramentHymnNumber: z.string(),
    sacramentHymnTitle: z.string().trim(),
    speakers: z.string(),
    closingHymnNumber: z.coerce
      .number("Enter the closing hymn number.")
      .int("Hymn numbers are whole numbers.")
      .min(1, "Enter the closing hymn number.")
      .max(1000, "Hymn numbers are 1000 or less."),
    closingHymnTitle: z.string().trim().min(2, "Enter the closing hymn title."),
    closingPrayer: z.string().trim().min(2, "Enter who gives the closing prayer.").max(255),
  })
  .superRefine((data, ctx) => {
    const hasSacrament = data.meetingType === "regular" || data.meetingType === "testimony";
    if (hasSacrament) {
      const number = Number(data.sacramentHymnNumber);
      if (!Number.isInteger(number) || number < 1 || number > 1000) {
        ctx.addIssue({ code: "custom", path: ["sacramentHymnNumber"], message: "Enter the sacrament hymn number." });
      }
      if (data.sacramentHymnTitle.length < 2) {
        ctx.addIssue({ code: "custom", path: ["sacramentHymnTitle"], message: "Enter the sacrament hymn title." });
      }
    }
    for (const line of splitLines(data.speakers)) {
      if (parseSpeakerLine(line).name.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["speakers"],
          message: `Each line needs a name first. Check: "${line.slice(0, 40)}".`,
        });
        break;
      }
    }
  });

type ParsedForm = z.infer<typeof MeetingFormSchema>;

// Turns the validated, still-textual form data into the SacramentMeeting shape.
function toMeetingData(data: ParsedForm): Omit<SacramentMeeting, "id"> {
  const hasSacrament = data.meetingType === "regular" || data.meetingType === "testimony";
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: splitLines(data.announcements),
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: splitLines(data.wardBusiness).map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness === "on",
    sacramentHymn: hasSacrament
      ? { number: Number(data.sacramentHymnNumber), title: data.sacramentHymnTitle }
      : { number: 0, title: "Not applicable (no sacrament)" },
    speakers: splitLines(data.speakers).map(parseSpeakerLine),
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

// PostgreSQL error 23505 = unique violation (the date column is UNIQUE).
function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "23505";
}

const DUPLICATE_DATE: State["errors"] = { date: ["A meeting is already planned for this date."] };

// Every write needs a signed-in leader. The proxy already keeps visitors off the form pages,
// but a Server Action is just a public endpoint, so it checks the session itself and never
// trusts the client. (redirect() works by throwing, so nothing after it runs.)
async function requireSession(): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function createMeeting(
  prevState: State,
  formData: FormData,
): Promise<State> {
  await requireSession();
  const values = readValues(formData);
  const validated = MeetingFormSchema.safeParse(values);
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Some fields are missing or invalid. The meeting was not created.",
      values,
    };
  }

  try {
    await addMeeting(toMeetingData(validated.data));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { errors: DUPLICATE_DATE, message: "The meeting was not created.", values };
    }
    console.error("createMeeting failed:", error);
    throw new Error("Failed to create the meeting. Please try again later.");
  }

  // redirect() works by throwing, so it stays outside the try/catch.
  revalidatePath("/meetings");
  redirect("/meetings");
}

// Used as updateMeeting.bind(null, id), so the id arrives first and the form's
// useActionState supplies prevState and formData.
export async function updateMeeting(
  id: number,
  prevState: State,
  formData: FormData,
): Promise<State> {
  await requireSession();
  const values = readValues(formData);
  const validated = MeetingFormSchema.safeParse(values);
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Some fields are missing or invalid. The meeting was not saved.",
      values,
    };
  }

  let updated: SacramentMeeting | null;
  try {
    updated = await updateMeetingRecord(id, toMeetingData(validated.data));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { errors: DUPLICATE_DATE, message: "The meeting was not saved.", values };
    }
    console.error("updateMeeting failed:", error);
    throw new Error("Failed to save the meeting. Please try again later.");
  }
  if (!updated) {
    throw new Error("That meeting no longer exists. It may have been deleted.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(id: number): Promise<void> {
  await requireSession();
  try {
    await deleteMeetingRecord(id);
  } catch (error) {
    console.error("deleteMeeting failed:", error);
    throw new Error("Failed to delete the meeting. Please try again later.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
