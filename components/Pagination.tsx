"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedPage = Math.floor(Number(searchParams.get("page")));
  const currentPage = parsedPage >= 1 ? parsedPage : 1;

  // Keeps the active search (?query=...) and swaps only the page number.
  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  const base = "rounded border px-4 py-2 font-semibold";
  const active = `${base} border-brand text-brand hover:bg-blue-50`;
  const disabled = `${base} border-gray-300 text-gray-600`;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={active}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabled}>
          Previous
        </span>
      )}
      <span aria-live="polite" className="text-gray-900">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={active}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabled}>
          Next
        </span>
      )}
    </nav>
  );
}
