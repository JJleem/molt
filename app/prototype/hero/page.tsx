"use client";

// PROTOTYPE — wipe me. 히어로 "탈피" 시그니처 모먼트 변주 비교.
// 질문: 옛 정체성이 허물 가닥으로 탈피해 현재의 나가 드러나는 시그니처를 어떤 메커니즘으로?
// 3 변주를 ?variant=A|B|C 로 토글. /prototype/hero
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrototypeSwitcher from "@/components/prototype/PrototypeSwitcher";
import VariantA from "@/components/prototype/hero/VariantA";
import VariantB from "@/components/prototype/hero/VariantB";
import VariantC from "@/components/prototype/hero/VariantC";
import VariantD from "@/components/prototype/hero/VariantD";
import VariantE from "@/components/prototype/hero/VariantE";
import VariantF from "@/components/prototype/hero/VariantF";

const VARIANTS = [
  { key: "F", name: "셰이더 탈피 (Stripe식·확정안)" },
  { key: "E", name: "3D 이리데센트 molt (WebGL)" },
  { key: "D", name: "허물 벗기 + 조각 비산 (2D)" },
  { key: "B", name: "허물 한 꺼풀 벗기" },
  { key: "C", name: "입자 분해 → 흐름" },
  { key: "A", name: "가닥이 글자를 짜고 푼다" },
];

function PrototypeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const variant = params.get("variant") ?? "F";
  const setVariant = (key: string) => router.replace(`/prototype/hero?variant=${key}`);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1c1917]">
      {variant === "A" && <VariantA />}
      {variant === "B" && <VariantB />}
      {variant === "C" && <VariantC />}
      {variant === "D" && <VariantD />}
      {variant === "E" && <VariantE />}
      {variant === "F" && <VariantF />}
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={setVariant} />
    </main>
  );
}

export default function HeroPrototypePage() {
  return (
    <Suspense fallback={null}>
      <PrototypeInner />
    </Suspense>
  );
}
