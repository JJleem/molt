import React from "react";

// 우주/성운 텍스처 — 딥 네이비 위로 인디고·바이올렛 성운광 + 그레인 + 별 (CSS only).
// 히어로/Cosmic 섹션이 공유. 다크 베이스 위에 빛을 더하는(screen) 방식이라 글래스 카드가 비쳐 럭셔리해진다.
export default function CosmicTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 드리프트하는 오로라 성운 — 드라마틱 광원 */}
      <div
        className="aurora absolute -inset-[25%] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(38% 38% at 28% 30%, rgba(129,140,248,0.28), transparent 70%), radial-gradient(34% 34% at 76% 38%, rgba(167,139,250,0.24), transparent 70%), radial-gradient(42% 42% at 55% 82%, rgba(56,72,200,0.22), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_10%,rgba(99,102,241,0.14),transparent_60%),radial-gradient(ellipse_50%_45%_at_88%_18%,rgba(167,139,250,0.12),transparent_62%),radial-gradient(ellipse_60%_50%_at_50%_108%,rgba(56,72,200,0.12),transparent_60%)]" />
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
