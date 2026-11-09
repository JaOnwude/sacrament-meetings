import SiteNav from "@/components/SiteNav";

const sectionLinks = [
  { href: "/meetings", label: "All meetings", exact: true },
  { href: "/meetings/current", label: "This Sunday", exact: true },
];

// Section layout: wraps every page under /meetings (the root layout still wraps this one).
export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 border-b border-gray-300 pb-3 print:hidden">
        <SiteNav links={sectionLinks} label="Meetings section" variant="section" />
      </div>
      {children}
    </section>
  );
}
