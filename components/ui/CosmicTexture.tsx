import React from "react";

// 우주/성운 텍스처 — 딥 네이비 위로 인디고·바이올렛 성운광 + 그레인 + 별 (CSS only).
// 히어로/Cosmic 섹션이 공유. 다크 베이스 위에 빛을 더하는(screen) 방식이라 글래스 카드가 비쳐 럭셔리해진다.
export default function CosmicTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(ellipse_50%_45%_at_88%_18%,rgba(167,139,250,0.16),transparent_62%),radial-gradient(ellipse_60%_50%_at_50%_108%,rgba(56,72,200,0.16),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {[[14, 22], [30, 12], [72, 18], [86, 30], [22, 70], [64, 80], [90, 64]].map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-white/40"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}
