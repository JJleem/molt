"use client";

import Link from "next/link";
import LiveVisitorBadge from "@/components/analytics/LiveVisitorBadge";

const NAV = [
  { href: "#cosmic-hustle", label: "Work" },
  { href: "#work", label: "실무" },
  { href: "#side", label: "More" },
  { href: "#career", label: "경력" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6ebf1] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-6">
        <Link
          href="#top"
          className="text-[15px] font-bold tracking-tight text-[#0a2540]"
        >
          molt<span className="text-[#635bff]">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13.5px] font-medium text-[#425466] transition-colors hover:text-[#0a2540]"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="rounded-full bg-[#635bff] px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-transform hover:-translate-y-px"
          >
            연락하기
          </Link>
        </nav>

        <LiveVisitorBadge />
      </div>
    </header>
  );
}
