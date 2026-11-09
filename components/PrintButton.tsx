"use client";

// A small Client Component: window.print() only exists in the browser, so this
// needs 'use client'. Everything else on the page stays a Server Component.
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-800 focus:outline-2 focus:outline-offset-2 focus:outline-brand print:hidden"
    >
      Print program
    </button>
  );
}
