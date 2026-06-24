"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { agents } from "@/content/agents";
import type { Agent } from "@/content/types";

// 에이전트 11명을 우주 별자리로 시각화 — 궤도 링 · 별자리 웹 · 흐르는 데이터 펄스로
// "11명이 부서를 나눠 협업하는 살아있는 엔진" 느낌을 준다. 노드는 캐릭터 사진(없으면 컬러+이니셜).
// 가드레일: Three.js 풀 씬 대신 가벼운 SVG/CSS, reduced-motion 폴백.

const DEPT_ORDER = ["Research", "Creative", "Operations"] as const;
const DEPT_META: Record<string, { label: string; color: string }> = {
  Research: { label: "Research", color: "#6366f1" },
  Creative: { label: "Creative", color: "#a855f7" },
  Operations: { label: "Operations", color: "#0d9488" },
};

// 고정 별 위치 (Math.random 미사용 — SSR 하이드레이션 일관성 유지)
const STARS = [
  [12, 18], [27, 9], [44, 22], [61, 13], [78, 27], [89, 16],
  [8, 47], [33, 58], [72, 61], [91, 52],
  [18, 78], [38, 88], [76, 86], [88, 72],
] as const;

function NodeFace({ agent, size, active }: { agent: Agent; size: number; active: boolean }) {
  const [failed, setFailed] = useState(false);
  const showImg = agent.avatar && !failed;
  return (
    <span
      className="relative block overflow-hidden rounded-full transition-all duration-300"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${agent.color}`,
        backgroundColor: showImg ? "#0b1220" : `${agent.color}33`,
        boxShadow: `0 0 ${active ? 20 : 10}px ${agent.color}${active ? "cc" : "70"}`,
      }}
    >
      {showImg ? (
        <Image src={agent.avatar as string} alt="" fill sizes="48px" className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: agent.color, fontSize: size * 0.42 }}>
          {agent.name.charAt(0)}
        </span>
      )}
    </span>
  );
}

export default function AgentConstellation() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  // 부서별로 정렬해 같은 부서가 궤도에서 이웃하도록 배치 (각도 = index 기반, 결정적)
  const { nodes, polygon, depts } = useMemo(() => {
    const sorted = [...agents].sort(
      (a, b) => DEPT_ORDER.indexOf(a.dept ?? "Research") - DEPT_ORDER.indexOf(b.dept ?? "Research"),
    );
    const cx = 50, cy = 50, rx = 40, ry = 38;
    const ns = sorted.map((agent, i) => {
      const angle = (i / sorted.length) * Math.PI * 2 - Math.PI / 2;
      return { ...agent, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, delay: (i % 5) * 0.35 };
    });
    const poly = ns.map((n) => `${n.x},${n.y}`).join(" ");
    const counts = DEPT_ORDER.map((d) => ({ ...DEPT_META[d], count: agents.filter((a) => a.dept === d).length }));
    return { nodes: ns, polygon: poly, depts: counts };
  }, []);

  return (
    <div className="w-full max-w-[400px] mx-auto select-none">
      <div className="relative aspect-square w-full">
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

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          {/* 궤도 링 (동심) */}
          <ellipse cx="50" cy="50" rx="40" ry="38" fill="none" stroke="rgba(148,163,184,0.22)" strokeWidth="0.25" strokeDasharray="1.4 1.6" />
          <ellipse cx="50" cy="50" rx="24" ry="23" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.2" strokeDasharray="1 1.8" />

          {/* 별자리 웹 (이웃 노드 연결) */}
          <polygon points={polygon} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="0.25" />

          {/* 중심 ↔ 노드 스포크 */}
          {nodes.map((n) => (
            <line
              key={`line-${n.id}`}
              x1="50" y1="50" x2={n.x} y2={n.y}
              stroke={active === n.id ? n.color : "rgba(148,163,184,0.14)"}
              strokeWidth={active === n.id ? 0.7 : 0.25}
              className="transition-all duration-300"
            />
          ))}

          {/* 흐르는 데이터 펄스 (중심 → 노드) */}
          {!reduce &&
            nodes.map((n, i) => (
              <motion.circle
                key={`pulse-${n.id}`}
                r="0.8"
                fill={n.color}
                initial={{ cx: 50, cy: 50, opacity: 0 }}
                animate={{ cx: [50, n.x], cy: [50, n.y], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.22, ease: "easeOut" }}
              />
            ))}
        </svg>

        {/* 중심 코어 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {!reduce && (
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-resume-primary/30"
              style={{ width: 68, height: 68 }}
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <motion.div
            className="relative flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border border-resume-primary/30 backdrop-blur-sm"
            style={{ background: "radial-gradient(circle at 50% 32%, rgba(99,102,241,0.28), rgba(13,148,136,0.12) 72%)" }}
            animate={reduce ? undefined : { boxShadow: ["0 0 18px rgba(99,102,241,0.15)", "0 0 34px rgba(99,102,241,0.38)", "0 0 18px rgba(99,102,241,0.15)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[15px] font-bold leading-none text-resume-primary">11</span>
            <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.18em] text-resume-primary/80">Agents</span>
          </motion.div>
        </div>

        {/* 에이전트 노드 */}
        {nodes.map((n) => (
          <motion.button
            key={n.id}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${n.x}%`, top: `${n.y}%`,
              opacity: active && active !== n.id ? 0.4 : 1,
              zIndex: active === n.id ? 20 : 10,
            }}
            onHoverStart={() => setActive(n.id)}
            onHoverEnd={() => setActive(null)}
            onFocus={() => setActive(n.id)}
            onBlur={() => setActive(null)}
            aria-label={`${n.name} — ${n.role}`}
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 4 + n.delay, repeat: Infinity, delay: n.delay }}
          >
            <NodeFace agent={n} size={active === n.id ? 46 : 36} active={active === n.id} />
            {active === n.id && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-900/90 px-2 py-1 text-center backdrop-blur"
              >
                <span className="block text-[11px] font-bold text-white">{n.name}</span>
                <span className="block text-[9px] text-slate-400">{n.role}</span>
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* 부서 범례 — 3개 부서 11명 */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {depts.map((d) => (
          <span key={d.label} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-resume-text-sub">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label}
            <span className="text-resume-text-sub/60">{d.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
