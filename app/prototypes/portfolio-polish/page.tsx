import type { Metadata } from "next";
import PolishCompare from "./PolishCompare";

// PROTOTYPE(polish) — 로컬 검토 전용 라우트. 어디에도 링크되지 않고 noindex.
export const metadata: Metadata = {
  title: "Portfolio Polish Prototype",
  robots: { index: false, follow: false },
};

export default function PortfolioPolishPage() {
  return <PolishCompare />;
}
