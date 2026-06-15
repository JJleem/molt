"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { agents } from "@/content/agents";

// 에이전트 11명을 우주 별자리로 시각화 — 예쁨 + "11명이 협업하는 시스템" 메시지를 한 화면에.
// 가드레일: Three.js 풀 씬 대신 가벼운 SVG/CSS, reduced-motion 폴백, LCP 텍스트는 히어로 쪽에서 즉시.

// 고정 별 위치 (Math.random 미사용 — SSR 하이드레이션 일관성 유지)
const STARS = [
  [12, 18], [27, 9], [44, 22], [61, 13], [78, 27], [89, 16],
  [8, 47], [33, 58], [55, 44], [72, 61], [91, 52],
  [18, 78], [38, 88], [58, 74], [76, 86], [88, 72],
] as const;

export default function AgentConstellation() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  // 중심을 기준으로 타원 궤도에 11명 배치 (각도 = index 기반, 결정적)
  const nodes = useMemo(() => {
    const cx = 50;
    const cy = 50;
    const rx = 40;
    const ry = 38;
    return agents.map((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...agent,
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        delay: (i % 5) * 0.4,
      };
    });
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-[520px] mx-auto select-none">
      {/* 별 배경 */}
      <div className="absolute inset-0">
        {STARS.map(([x, y], i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-resume-primary/25"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* 연결선 (중심 ↔ 각 에이전트) */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        {nodes.map((n) => (
          <line
            key={`line-${n.id}`}
            x1="50"
            y1="50"
            x2={n.x}
            y2={n.y}
            stroke={active === n.id ? n.color : "rgba(148,163,184,0.18)"}
            strokeWidth={active === n.id ? 0.6 : 0.3}
            className="transition-all duration-300"
          />
        ))}
      </svg>

      {/* 중심 코어 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-resume-primary/30 bg-resume-badge-bg backdrop-blur-sm"
          animate={reduce ? undefined : { boxShadow: ["0 0 18px rgba(99,102,241,0.15)", "0 0 30px rgba(99,102,241,0.3)", "0 0 18px rgba(99,102,241,0.15)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-resume-primary">Cosmic</span>
        </motion.div>
      </div>

      {/* 에이전트 노드 */}
      {nodes.map((n) => (
        <motion.button
          key={n.id}
          type="button"
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-300"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            opacity: active && active !== n.id ? 0.35 : 1,
          }}
          onHoverStart={() => setActive(n.id)}
          onHoverEnd={() => setActive(null)}
          onFocus={() => setActive(n.id)}
          onBlur={() => setActive(null)}
          aria-label={`${n.name} — ${n.role}`}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4 + n.delay, repeat: Infinity, delay: n.delay }}
        >
          <span
            className="block rounded-full ring-2 ring-black/5 transition-transform duration-300"
            style={{
              width: active === n.id ? 18 : 13,
              height: active === n.id ? 18 : 13,
              backgroundColor: n.color,
              boxShadow: `0 0 12px ${n.color}`,
            }}
          />
          {/* 호버 시 정체 노출 */}
          {active === n.id && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-900/90 px-2 py-1 text-center backdrop-blur"
            >
              <span className="block text-[11px] font-bold text-white">{n.name}</span>
              <span className="block text-[9px] text-slate-400">{n.role}</span>
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
