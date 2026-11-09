import { Suspense } from "react";
import Link from "next/link";
import NavLinks from "./NavLinks";
import type { NavLinkItem } from "./NavLinks";

interface SiteNavProps {
  links: NavLinkItem[];
  label: string;
  variant?: "header" | "section";
}

// NavLinks reads the current URL (usePathname), which is only known at request time on
// dynamic routes like /meetings/[id]. Next.js requires such components to sit inside
// <Suspense>. The fallback is the same set of links without the active highlight, so
// the navigation is never missing or shifting while the active state loads.
export default function SiteNav({ links, label, variant = "header" }: SiteNavProps) {
  const linkClass = variant === "header" ? "text-white hover:underline" : "text-brand hover:underline";

  return (
    <Suspense
      fallback={
        <nav aria-label={label}>
          <ul className="flex flex-wrap gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      <NavLinks links={links} label={label} variant={variant} />
    </Suspense>
  );
}
