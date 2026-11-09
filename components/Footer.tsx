// Cache Components is on in this project, so reading the clock needs an explicit choice.
// "use cache" captures the year once and reuses it.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="mt-12 bg-gray-800 py-4 text-center text-sm text-white print:hidden">
      <p>Maple Grove Ward Sacrament Meeting Planner &copy; {year}</p>
    </footer>
  );
}
