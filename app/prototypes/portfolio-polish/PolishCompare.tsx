"use client";

// PROTOTYPE(polish) — 원본 ↔ 폴리시 비교 뷰.
// 원본 모드는 실제 홈 컴포넌트(Header/VariantH/CapabilitiesStrip)를 그대로 렌더,
// 폴리시 모드는 사본(Polished*)을 렌더. 하단 토글로 즉시 전환.
import { useState } from "react";
import Header from "@/components/layout/Header";
import VariantH from "@/components/prototype/hero/VariantH";
import CapabilitiesStrip from "@/components/sections/CapabilitiesStrip";
import PolishedHeader from "@/components/prototype/polish/PolishedHeader";
import PolishedHero from "@/components/prototype/polish/PolishedHero";
import PolishedCapabilities from "@/components/prototype/polish/PolishedCapabilities";

export default function PolishCompare() {
  const [polish, setPolish] = useState(true);

  return (
    <>
      {/* key로 모드 전환 시 리마운트 → 진입 모션을 매번 비교 가능 */}
      <div key={polish ? "polish" : "original"} className="overflow-x-clip">
        {polish ? <PolishedHeader /> : <Header />}
        {polish ? <PolishedHero /> : <VariantH />}
        {polish ? <PolishedCapabilities /> : <CapabilitiesStrip />}
        {/* Phase 1 범위 끝 — 이후 섹션은 원본 홈에서 확인 */}
        <div className="flex h-[30vh] items-center justify-center text-[12px] text-[#8b929d]">
          ── Phase 1 프로토타입 범위 끝 (Header · Hero · Capabilities) ──
        </div>
      </div>

      {/* 비교 토글 */}
      <div className="fixed bottom-5 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#e6ebf1] bg-white/95 px-1.5 py-1.5 shadow-[0_8px_30px_rgba(10,37,64,0.15)] backdrop-blur-md">
        {([["원본", false], ["폴리시", true]] as const).map(([label, val]) => (
          <button
            key={label}
            onClick={() => setPolish(val)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488] ${
              polish === val ? "bg-[#0a2540] text-white" : "text-[#425466] hover:bg-[#f1f4f8]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
