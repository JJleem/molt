import React from "react";

// Stripe식 그리드 가이드 — 콘텐츠 컬럼 경계에 옅은 세로 점선(dashed) hairline.
// "보이지 않는 그리드 위에 콘텐츠가 정렬돼 있다"는 인상을 줘 정돈/세련된 느낌을 낸다.
// 사용법: 섹션에 relative(+overflow 무관)를 두고 이 컴포넌트를 첫 자식으로,
//        실제 콘텐츠 컨테이너에는 relative z-10을 줘서 가이드 위에 올린다.
export default function GridGuides({
  columns = 4,
  tone = "light",
  top = "top-0",
  z = "z-0",
  maskImage,
}: {
  columns?: number;
  /** light: 밝은 섹션(연회색 선) / dark: 어두운 섹션(반투명 흰 선) */
  tone?: "light" | "dark";
  /** 선이 시작하는 상단 위치(Tailwind class). 히어로 띠 등 위로 안 깔리게 할 때 사용 */
  top?: string;
  /** z 위치(Tailwind class). 기본은 콘텐츠 뒤(z-0). 오버레이 위로 올릴 땐 z-[8] 등 */
  z?: string;
  /** 선 전체에 적용할 mask(CSS). 예: 우측 그라데이션 위에선 점선을 fade-out */
  maskImage?: string;
}) {
  // 0% ~ 100% 사이 컬럼 경계 (columns+1개: 좌우 끝 + 사이)
  const lines = Array.from({ length: columns + 1 }, (_, i) => (i / columns) * 100);
  const color = tone === "dark" ? "rgba(255,255,255,0.07)" : "#e8eef4";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${top} ${z} overflow-hidden`}
      style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
    >
      {/* 선은 컨테이너(1140) 바깥 끝에 → 콘텐츠(px-6)가 24px 띄어져 붙지 않는다 */}
      <div className="relative mx-auto h-full max-w-[1140px]">
        {lines.map((x, i) => (
          <span
            key={i}
            className="absolute inset-y-0 w-px"
            style={{
              left: `${x}%`,
              // 연한 색 + 덜 촘촘한 대시 (대시 4px / 간격 9px)
              backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 4px, transparent 4px 13px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
