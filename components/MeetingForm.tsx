"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FieldName, FormValues, State } from "@/lib/actions";
import { meetingTypeLabels } from "@/lib/meeting-utils";
import type { MeetingType } from "@/lib/types";

interface MeetingFormProps {
  // A Server Action (createMeeting, or updateMeeting.bind(null, id)).
  action: (prevState: State, formData: FormData) => Promise<State>;
  initialValues: FormValues;
  submitLabel: string;
}

const inputClass =
  "block w-full rounded border border-gray-500 bg-white px-3 py-2 text-gray-900 aria-[invalid=true]:border-red-700";

// Error messages live in a container that always exists, so screen readers (aria-live)
// announce a message the moment it appears. aria-describedby on the input points at it.
function FieldErrors({ id, errors }: { id: string; errors: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors.map((error) => (
        <p key={error} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

interface FieldProps {
  name: FieldName;
  label: string;
  value: string;
  errors: string[];
  hint?: string;
}

function TextField({ name, label, value, errors, hint, type = "text" }: FieldProps & { type?: string }) {
  const describedBy = [hint ? `${name}-hint` : null, `${name}-error`].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mb-1 text-sm text-gray-700">
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={value}
        aria-describedby={describedBy}
        aria-invalid={errors.length > 0}
        className={inputClass}
      />
      <FieldErrors id={`${name}-error`} errors={errors} />
    </div>
  );
}

function TextAreaField({ name, label, value, errors, hint }: FieldProps) {
  const describedBy = [hint ? `${name}-hint` : null, `${name}-error`].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mb-1 text-sm text-gray-700">
          {hint}
        </p>
      )}
      <textarea
        id={name}
        name={name}
        rows={4}
        defaultValue={value}
        aria-describedby={describedBy}
        aria-invalid={errors.length > 0}
        className={inputClass}
      />
      <FieldErrors id={`${name}-error`} errors={errors} />
    </div>
  );
}

const initialState: State = { message: null, errors: {} };

export default function MeetingForm({ action, initialValues, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  // After a failed submit the action returns what was typed, so the form keeps it.
  const valueOf = (name: FieldName): string => state.values?.[name] ?? initialValues[name] ?? "";
  const errorsOf = (name: FieldName): string[] => state.errors?.[name] ?? [];
  const field = (name: FieldName, label: string, hint?: string): FieldProps => ({
    name,
    label,
    value: valueOf(name),
    errors: errorsOf(name),
    hint,
  });

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* noValidate: the server does the checking and explains each problem, instead of the
          browser's own pop-ups. */}
      <div id="form-message" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded border border-red-700 bg-red-50 px-3 py-2 font-medium text-red-800">
            {state.message}
          </p>
        )}
      </div>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Meeting</legend>
        <TextField {...field("date", "Date")} type="date" />
        <div>
          <label htmlFor="meetingType" className="mb-1 block text-sm font-semibold text-gray-900">
            Meeting type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={valueOf("meetingType")}
            aria-describedby="meetingType-error"
            aria-invalid={errorsOf("meetingType").length > 0}
            className={inputClass}
          >
            <option value="">Choose a type...</option>
            {(Object.keys(meetingTypeLabels) as MeetingType[]).map((type) => (
              <option key={type} value={type}>
                {meetingTypeLabels[type]}
              </option>
            ))}
          </select>
          <FieldErrors id="meetingType-error" errors={errorsOf("meetingType")} />
        </div>
        <TextField {...field("presiding", "Presiding")} />
        <TextField {...field("conducting", "Conducting")} />
        <TextAreaField {...field("announcements", "Announcements", "One announcement per line. Optional.")} />
      </fieldset>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Opening</legend>
        <TextField {...field("openingHymnNumber", "Opening hymn number")} type="number" />
        <TextField {...field("openingHymnTitle", "Opening hymn title")} />
        <TextField {...field("openingPrayer", "Opening prayer")} />
      </fieldset>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Business</legend>
        <TextAreaField {...field("wardBusiness", "Ward business", "One item per line. Optional.")} />
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={valueOf("stakeBusiness") === "on"}
            className="h-5 w-5"
          />
          <label htmlFor="stakeBusiness" className="font-semibold text-gray-900">
            There is stake business
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Sacrament</legend>
        <p className="text-sm text-gray-700">
          Required for regular and fast and testimony meetings. Leave blank for stake, general and
          special meetings.
        </p>
        <TextField {...field("sacramentHymnNumber", "Sacrament hymn number")} type="number" />
        <TextField {...field("sacramentHymnTitle", "Sacrament hymn title")} />
      </fieldset>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Speakers and musical numbers</legend>
        <TextAreaField
          {...field(
            "speakers",
            "Speakers and musical numbers",
            "One per line as: Name | Topic | speaker (or music). Example: Sister Brown | Faith in Jesus Christ | speaker. Optional.",
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 rounded border border-gray-300 p-4">
        <legend className="px-1 font-semibold text-gray-900">Closing</legend>
        <TextField {...field("closingHymnNumber", "Closing hymn number")} type="number" />
        <TextField {...field("closingHymnTitle", "Closing hymn title")} />
        <TextField {...field("closingPrayer", "Closing prayer")} />
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-brand px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
        <Link href="/meetings" className="text-brand underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
