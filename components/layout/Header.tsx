"use client";

import Link from "next/link";
import LiveVisitorBadge from "@/components/analytics/LiveVisitorBadge";

const NAV = [
  { href: "#cosmic-hustle", label: "Cosmic" },
  { href: "#work", label: "실무" },
  { href: "#side", label: "사이드" },
  { href: "#contact", label: "연락" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-resume-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="#top"
          className="text-lg font-bold tracking-tight text-resume-text-main transition-opacity hover:opacity-70"
        >
          임재준
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-resume-text-sub transition-colors hover:text-resume-text-main"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <LiveVisitorBadge />
      </div>
    </header>
  );
}
