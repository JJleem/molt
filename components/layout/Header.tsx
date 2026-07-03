"use client";

// 개선: 최상단 투명 → 스크롤 시 border·shadow 페이드인, nav 언더라인 hover,
//       CTA press scale, focus-visible. 구조/문구/높이는 기존 그대로.
import { useEffect, useState } from "react";
import Link from "next/link";
import LiveVisitorBadge from "@/components/analytics/LiveVisitorBadge";
import { EASE_OUT_CSS } from "@/components/ui/motion-tokens";

const NAV = [
  { href: "#cosmic-hustle", label: "Work" },
  { href: "#work", label: "실무" },
  { href: "#side", label: "More" },
  { href: "#career", label: "경력" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-[#e6ebf1] bg-white/95 shadow-[0_1px_10px_rgba(10,37,64,0.04)]"
          : "border-transparent bg-white/60"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-6">
        <Link
          href="#top"
          className="rounded-sm text-[15px] font-bold tracking-tight text-[#0a2540] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d9488]"
        >
          molt<span className="text-[#0d9488]">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative rounded-sm text-[14px] font-medium text-[#425466] transition-colors duration-200 hover:text-[#0a2540] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d9488]"
            >
              {n.label}
              {/* hover 언더라인 — 좌→우로 채워지고 벗어나면 자연스럽게 사라짐 */}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-[1.5px] w-full origin-left scale-x-0 rounded-full bg-[#0d9488]/70 transition-transform duration-300 group-hover:scale-x-100"
                style={{ transitionTimingFunction: EASE_OUT_CSS }}
              />
            </Link>
          ))}
          <Link
            href="#contact"
            className="rounded-full bg-[#0d9488] px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#0f9e91] hover:shadow-[0_4px_12px_-4px_rgba(13,148,136,0.5)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488]"
          >
            연락하기
          </Link>
        </nav>

        <LiveVisitorBadge />
      </div>
    </header>
  );
}
