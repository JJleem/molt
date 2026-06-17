"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEMOS = [
  {
    id: "blog",
    label: "AI 블로그",
    sublabel: "자동 발행 파이프라인",
    accent: "#0ea5e9",
    from: "#0ea5e9",
    to: "#0369a1",
    url: "blog.molt.dev",
    tech: ["Next.js", "LLM", "SEO"],
    stat: "11 Agents",
  },
  {
    id: "chub",
    label: "C-HUB 2.0",
    sublabel: "산업 3D프린터 관제",
    accent: "#635bff",
    from: "#635bff",
    to: "#4338ca",
    url: "carima.co.kr/c-hub",
    tech: ["React", "WebSocket", "Recoil"],
    stat: "GS 1등급",
  },
  {
    id: "research",
    label: "리서치 엔진",
    sublabel: "멀티 에이전트 파이프라인",
    accent: "#7c3aed",
    from: "#7c3aed",
    to: "#4c1d95",
    url: "research.molt.dev",
    tech: ["Python", "LangGraph", "RAG"],
    stat: "Multi-Agent",
  },
] as const;

// offset 0 = active (front/center), 1 = back-right, 2 = back-left
const STACK = [
  { x: 0,   y: 0,  rotate: 0,  scale: 1,    zIndex: 30, opacity: 1    },
  { x: 46,  y: 14, rotate: 7,  scale: 0.88, zIndex: 20, opacity: 0.9  },
  { x: -38, y: 22, rotate: -6, scale: 0.82, zIndex: 10, opacity: 0.78 },
];

/* ─────────── Browser mockup: AI 블로그 ─────────── */
function BlogMockup() {
  return (
    <div className="h-full bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-extrabold text-[#0ea5e9]">AI Daily Brief</span>
        <span className="text-[9px] text-gray-400">24/7 자동 발행</span>
      </div>
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="bg-[#0ea5e9] text-white text-[8px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
          <span className="text-[9px] text-gray-400">방금 전 · LLM 트렌드</span>
        </div>
        <div className="h-2.5 bg-gray-700/80 rounded w-[85%] mb-2" />
        <div className="h-1.5 bg-gray-300 rounded w-full mb-1.5" />
        <div className="h-1.5 bg-gray-300 rounded w-[68%]" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
          <div className="w-10 h-7 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-1.5 bg-gray-400 rounded mb-1.5" style={{ width: `${82 - i * 10}%` }} />
            <div className="h-1 bg-gray-200 rounded" style={{ width: `${52 + i * 8}%` }} />
          </div>
        </div>
      ))}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[9px] text-gray-400">11개 에이전트 실행 중</span>
      </div>
    </div>
  );
}

/* ─────────── Browser mockup: C-HUB ─────────── */
function CHubMockup() {
  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="w-14 bg-[#1e1b4b] flex flex-col items-center py-4 gap-3 flex-shrink-0">
        <div className="w-6 h-6 rounded-lg bg-[#635bff]" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-6 h-1 rounded ${i === 1 ? "bg-white/70" : "bg-white/20"}`} />
        ))}
      </div>
      <div className="flex-1 p-4">
        <div className="text-[11px] font-bold text-[#0a2540] mb-3">실시간 장비 현황</div>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { l: "온도",  v: "215°C", ok: true },
            { l: "속도",  v: "45mm",  ok: true },
            { l: "알림",  v: "1건",   ok: false },
          ].map((m) => (
            <div key={m.l} className="bg-[#f6f9fc] border border-[#e6ebf1] rounded-xl p-2">
              <div className="text-[8px] text-gray-400 mb-0.5">{m.l}</div>
              <div className={`text-[12px] font-bold ${m.ok ? "text-[#0a2540]" : "text-amber-500"}`}>{m.v}</div>
            </div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#f0f0f0] last:border-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i < 4 ? "bg-green-400" : "bg-amber-400"}`} />
            <div className="flex-1 h-1.5 bg-gray-200 rounded" />
            <span className="text-[8px] text-gray-400 flex-shrink-0">{i < 4 ? "인쇄 중" : "대기"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Browser mockup: Research Engine ─────────── */
function ResearchMockup() {
  const nodes = [
    { label: "Query",  left: 8,   top: 8   },
    { label: "Search", left: 90,  top: 8   },
    { label: "Parse",  left: 172, top: 8   },
    { label: "Rank",   left: 90,  top: 58  },
    { label: "Output", left: 172, top: 88  },
  ];
  return (
    <div className="h-full bg-white p-4">
      <div className="text-[11px] font-bold text-[#7c3aed] mb-2">멀티 에이전트 파이프라인</div>
      <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 text-[9px] text-violet-700 mb-3 font-mono">
        &gt; &quot;최신 AI 아키텍처 동향 분석해줘&quot;
      </div>
      <div className="relative h-[120px] mb-3 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="52"  y1="16" x2="92"  y2="16" stroke="#ddd8fe" strokeWidth="1.5" />
          <line x1="132" y1="16" x2="172" y2="16" stroke="#ddd8fe" strokeWidth="1.5" />
          <line x1="120" y1="20" x2="120" y2="60" stroke="#ddd8fe" strokeWidth="1.5" />
          <line x1="130" y1="68" x2="172" y2="92" stroke="#ddd8fe" strokeWidth="1.5" />
        </svg>
        {nodes.map((n) => (
          <div
            key={n.label}
            className="absolute bg-violet-600 text-white text-[8px] font-semibold px-2 py-0.5 rounded-md shadow-sm"
            style={{ left: n.left, top: n.top }}
          >
            {n.label}
          </div>
        ))}
      </div>
      <div className="bg-[#f6f9fc] border border-[#e6ebf1] rounded-lg p-2.5">
        <div className="h-1.5 bg-violet-200 rounded mb-1.5" style={{ width: "80%" }} />
        <div className="h-1.5 bg-gray-200 rounded mb-1.5 w-full" />
        <div className="h-1.5 bg-gray-200 rounded" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

const MOCKUPS = [BlogMockup, CHubMockup, ResearchMockup];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ─────────── Main Panel ─────────── */
export default function MoltDemoPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % DEMOS.length), 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-[480px] select-none">

      {/* ── Browser Frame (커진 버전) ── */}
      <div className="relative z-0 rounded-2xl overflow-hidden border border-[#e6ebf1] shadow-[0_28px_72px_rgba(0,0,0,0.12)]">
        {/* chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#f6f9fc] border-b border-[#e6ebf1]">
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 mx-3 bg-white border border-[#e6ebf1] rounded-md px-3 py-1 text-[10px] text-[#8898aa] text-center truncate"
            >
              {DEMOS[active].url}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-1 flex-shrink-0">
            <span className="w-4 h-1.5 rounded-sm bg-[#e6ebf1]" />
            <span className="w-4 h-1.5 rounded-sm bg-[#e6ebf1]" />
          </div>
        </div>

        {/* content area — 키운 높이 */}
        <div className="h-[320px] overflow-hidden">
          <AnimatePresence mode="wait">
            {DEMOS.map((d, i) => {
              const Mockup = MOCKUPS[i];
              return active === i ? (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full"
                >
                  <Mockup />
                </motion.div>
              ) : null;
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Card Stack — 브라우저 프레임 위에 얹힘 ── */}
      {/* -mt-[100px]: 카드 스택을 위로 당겨 브라우저 하단과 겹침 */}
      <div className="relative z-10 -mt-[100px]">
        <div className="relative h-[210px]">
          {DEMOS.map((demo, i) => {
            const offset = (i - active + DEMOS.length) % DEMOS.length;
            const pos = STACK[offset];
            return (
              <motion.div
                key={demo.id}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                  scale: pos.scale,
                  opacity: pos.opacity,
                }}
                style={{
                  zIndex: pos.zIndex,
                  background: `linear-gradient(135deg, ${demo.from}, ${demo.to})`,
                  /* 카드 300px / 패널 480px → 왼쪽 여백 90px 으로 시각적 센터 */
                  left: 60,
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActive(i)}
                className="absolute top-0 w-[300px] h-[178px] rounded-2xl cursor-pointer overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.22)]"
              >
                {/* shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-black/12" />
                {/* noise */}
                <div
                  className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: NOISE }}
                />
                <div className="relative p-5 h-full flex flex-col justify-between text-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold opacity-70 mb-0.5">{demo.sublabel}</p>
                      <h3 className="text-[18px] font-bold tracking-tight leading-tight">{demo.label}</h3>
                    </div>
                    <span className="bg-white/25 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      {demo.stat}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.tech.map((t) => (
                      <span
                        key={t}
                        className="bg-white/20 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/25"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex items-center gap-2 mt-3 pl-[60px]">
        {DEMOS.map((demo, i) => (
          <button
            key={demo.id}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 22 : 6,
              height: 6,
              background: i === active ? demo.accent : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}
