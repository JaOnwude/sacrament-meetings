import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import SiteNav from "./SiteNav";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";
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

// Reads the session (a cookie), so it is also request-time and sits inside Suspense.
// connection() first: Auth.js generates random values, which Next.js won't allow while
// pre-building the page.
async function AuthControls() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/login" className="rounded border border-white px-3 py-1 text-sm font-semibold hover:bg-blue-800">
        Sign in
      </Link>
    );
  }

  return (
    <form action={signOutAction} className="flex items-center gap-3">
      <span className="text-sm text-blue-100">Signed in as {session.user.name}</span>
      <button
        type="submit"
        className="rounded border border-white px-3 py-1 text-sm font-semibold hover:bg-blue-800"
      >
        Sign out
      </button>
    </form>
  );
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
        <div className="flex flex-col gap-2 sm:items-end">
          <SiteNav links={navLinks} label="Main navigation" />
          <Suspense fallback={<span aria-hidden="true">&nbsp;</span>}>
            <AuthControls />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
