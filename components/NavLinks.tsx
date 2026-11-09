"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkItem {
  href: string;
  label: string;
  // true: active only on this exact path (used for "/"). false: also active on sub-paths.
  exact?: boolean;
}

interface NavLinksProps {
  links: NavLinkItem[];
  label: string; // accessible name for the <nav>
  variant?: "header" | "section";
}

function isActive(pathname: string, { href, exact }: NavLinkItem): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks({ links, label, variant = "header" }: NavLinksProps) {
  const pathname = usePathname();
  const inactive =
    variant === "header" ? "text-white hover:underline" : "text-brand hover:underline";
  const active =
    variant === "header"
      ? "font-bold text-white underline underline-offset-4"
      : "font-bold text-brand underline underline-offset-4";

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-5">
        {links.map((link) => {
          const current = isActive(pathname, link);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={current ? active : inactive}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
