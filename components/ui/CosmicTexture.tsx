import React from "react";

// 채도 뺀 우주/성운 텍스처 — 그레이스케일 구름 + 그레인 + 은은한 별 (CSS only).
// 히어로/Cosmic 섹션이 공유. 글래스 카드가 위에 얹히면 이 텍스처가 비쳐 럭셔리해진다.
export default function CosmicTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_10%,rgba(41,37,36,0.10),transparent_60%),radial-gradient(ellipse_50%_45%_at_88%_18%,rgba(120,113,108,0.12),transparent_62%),radial-gradient(ellipse_60%_50%_at_50%_108%,rgba(41,37,36,0.08),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {[[14, 22], [30, 12], [72, 18], [86, 30], [22, 70], [64, 80], [90, 64]].map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-resume-text-sub/30"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}
