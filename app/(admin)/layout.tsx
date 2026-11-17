// Leader-facing routes (create and edit meetings). Authentication is added in Week 05, so
// for now this layout only gives the admin pages their own wrapper.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <p className="mb-4 rounded bg-amber-100 px-3 py-2 text-sm text-amber-900">
        Leader area. Sign-in protection is coming in Week 05.
      </p>
      {children}
    </section>
  );
}
