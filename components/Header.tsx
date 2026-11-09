import { Suspense } from "react";
import { connection } from "next/server";
import SiteNav from "./SiteNav";
import { formatLongDate, toIsoDate } from "@/lib/dates";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/meetings", label: "Meetings" },
  { href: "/meetings/current", label: "This Sunday", exact: true },
];

// Today's date changes on every request, so it must not be frozen into the static page.
// connection() marks this component as request-time; Suspense lets the rest of the
// header render immediately while it loads.
async function CurrentDate() {
  await connection();
  const today = toIsoDate(new Date());
  return <time dateTime={today}>{formatLongDate(today)}</time>;
}

export default function Header() {
  return (
    <header className="bg-brand text-white print:hidden">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-2xl font-bold">Maple Grove Ward</p>
          <p className="text-sm text-blue-100">
            <Suspense fallback={<span aria-hidden="true">&nbsp;</span>}>
              <CurrentDate />
            </Suspense>
          </p>
        </div>
        <SiteNav links={navLinks} label="Main navigation" />
      </div>
    </header>
  );
}
