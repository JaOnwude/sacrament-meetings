import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* width and height are the file's real size (1600x640). They set the aspect
          ratio so the page doesn't jump while the image loads. */}
      <Image
        src="/hero.png"
        alt="Abstract blue banner with a gold circle and the outline of an open book"
        width={1600}
        height={640}
        priority
        className="h-auto w-full rounded-lg"
      />
      <section className="py-8">
        <h1 className="font-heading text-4xl font-bold text-gray-900">
          Sacrament Meeting Planner
        </h1>
        <p className="mt-3 max-w-prose text-lg text-gray-800">
          Plan and review the program for each Sunday: announcements, hymns, prayers, ward
          business, speakers and musical numbers. Members can view and print the program for the
          current week and past weeks.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/meetings"
            className="rounded bg-brand px-5 py-2 font-semibold text-white hover:bg-blue-800"
          >
            View all meetings
          </Link>
          <Link
            href="/meetings/current"
            className="rounded border-2 border-brand px-5 py-2 font-semibold text-brand hover:bg-blue-50"
          >
            This Sunday&apos;s program
          </Link>
        </div>
      </section>
    </main>
  );
}
