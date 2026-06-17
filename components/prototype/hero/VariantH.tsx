"use client";

// VariantH = Stripe Elements식 히어로 — 콘텐츠만 담당(배경 시트는 부모 래퍼가 *한 장*으로 그림).
//  · 그라데이션 시트는 app/page.tsx 의 단일 sheet div가 히어로+피처를 관통하며 그림 → 경계 이음매 불가능.
//  · 여기선 좌측 화이트 스크림(카피 가독) + 2-column 콘텐츠만. reduced-motion 영향 없음(정적).
import { useEffect, useState } from "react";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#635bff";

/* ─────────────────────────────────────────────────────────────
   우측 데모 패널 — Stripe Elements식 카드 스택
   ───────────────────────────────────────────────────────────── */

const PROJECTS = [
  { id: "blog", label: "AI 블로그", sub: "자동 발행 파이프라인", accent: "#0ea5e9", stat: "11 Agents", tech: ["Next.js", "LLM", "SEO"] },
  { id: "chub", label: "C-HUB 2.0", sub: "산업 3D프린터 관제", accent: "#635bff", stat: "GS 1등급", tech: ["React", "WebSocket"] },
  { id: "research", label: "리서치 엔진", sub: "멀티 에이전트 파이프라인", accent: "#7c3aed", stat: "Multi-Agent", tech: ["Python", "LangGraph"] },
] as const;

const STACK = [
  { x: 0, y: 0, rotate: -2, scale: 1, z: 30 },
  { x: 30, y: 16, rotate: 3, scale: 0.95, z: 20 },
  { x: -26, y: 30, rotate: -4, scale: 0.91, z: 10 },
];

function tint(hex: string, a: number) {
  return `color-mix(in srgb, ${hex} ${Math.round(a * 100)}%, white)`;
}

function StripePanel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % PROJECTS.length), 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[360px] w-full max-w-[460px] select-none">
      {PROJECTS.map((proj, i) => {
        const offset = (i - active + PROJECTS.length) % PROJECTS.length;
        const pos = STACK[offset];
        return (
          <div
            key={proj.id}
            onClick={() => setActive(i)}
            className="absolute left-1/2 top-6 w-[320px] cursor-pointer rounded-2xl bg-white transition-all duration-[550ms]"
            style={{
              transform: `translateX(-50%) translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
              zIndex: pos.z,
              boxShadow: "0 1px 1px rgba(16,24,40,0.04), 0 24px 48px -16px rgba(16,24,40,0.18)",
              transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="h-1 w-full rounded-t-2xl" style={{ background: proj.accent }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-lg" style={{ background: tint(proj.accent, 0.16) }}>
                    <span className="block h-full w-full rounded-lg" style={{ boxShadow: `inset 0 0 0 2px ${proj.accent}` }} />
                  </span>
                  <div>
                    <p className="text-[10px] font-medium text-[#8898aa]">{proj.sub}</p>
                    <h3 className="text-[16px] font-bold tracking-tight" style={{ color: INK }}>{proj.label}</h3>
                  </div>
                </div>
                <span className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: proj.accent, background: tint(proj.accent, 0.12) }}>
                  {proj.stat}
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-[#eef1f5] bg-[#fbfcfe] p-3">
                <div className="mb-2 h-2 w-1/3 rounded-full" style={{ background: tint(proj.accent, 0.5) }} />
                <div className="mb-1.5 h-1.5 w-full rounded-full bg-[#e9edf3]" />
                <div className="mb-1.5 h-1.5 w-[88%] rounded-full bg-[#e9edf3]" />
                <div className="h-1.5 w-[64%] rounded-full bg-[#e9edf3]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {proj.tech.map((t) => (
                  <span key={t} className="rounded-full border border-[#e6ebf1] px-2 py-0.5 text-[10px] font-semibold text-[#697586]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {PROJECTS.map((proj, i) => (
          <button
            key={proj.id}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 20 : 6, height: 6, background: i === active ? proj.accent : "#d7dce3" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   메인
   ───────────────────────────────────────────────────────────── */

export default function VariantH() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-transparent" style={{ color: INK }}>
      {/* 좌측 화이트 스크림 — 카피 가독 (하단에서 페이드아웃 → 바닥의 시트가 피처로 자연스럽게 흐름) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[56%] bg-gradient-to-r from-white via-white/88 to-transparent"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 66%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 66%, transparent 92%)",
        }}
      />

      {/* 콘텐츠 (2-column) */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1140px] items-center gap-8 px-6 py-24 lg:gap-16">
        <div className="w-full flex-shrink-0 lg:w-[46%]">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: BLURPLE }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLURPLE }} />
            AI Native · Full-Stack Engineer
          </p>

          <h1 className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]" style={{ color: INK }}>
            제품을 <span style={{ color: BLURPLE }}>끝까지</span>
            <br />
            만드는 엔지니어
          </h1>

          <p className="mt-7 max-w-md text-[18px] leading-[1.62]" style={{ color: SLATE }}>
            화면(FE)부터 그 뒤의 LLM 시스템, 사용자를 들어오게 만드는 계측·SEO까지 —
            프론트엔드부터 AI까지 <span className="font-semibold" style={{ color: INK }}>끝에서 끝</span>을 직접 만듭니다.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(99,91,255,0.6)] transition-transform hover:-translate-y-0.5"
              style={{ background: BLURPLE }}
            >
              프로젝트 보기
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a href="https://github.com/JJleem" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold" style={{ color: INK }}>
              GitHub
              <span className="transition-transform group-hover:translate-x-0.5" style={{ color: BLURPLE }}>↗</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#eaecef] pt-6 text-[13px] font-medium" style={{ color: SLATE }}>
            {[["11", "AI 에이전트 운영"], ["24/7", "자동 발행 파이프라인"], ["E2E", "FE → LLM → 계측"]].map(([k, v]) => (
              <div key={v} className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold tabular-nums" style={{ color: INK }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
          <StripePanel />
        </div>
      </div>
    </section>
  );
}
