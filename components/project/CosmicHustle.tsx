"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cosmicHustle } from "@/content/cosmic-hustle";
import { localize } from "@/content/locale";
import type { CapabilityCard } from "@/content/types";
import PipelineDiagram from "./PipelineDiagram";
import CountUp from "@/components/ui/CountUp";
import LiveFeed from "@/components/cosmic/LiveFeed";
import AgentConstellation from "@/components/hero/AgentConstellation";
import AgentCast from "@/components/cosmic/AgentCast";
import CosmicTexture from "@/components/ui/CosmicTexture";
import ProjectGallery from "@/components/ui/ProjectGallery";
import { blogGallery, engineGallery } from "@/content/galleries";

const GLASS =
  "border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.4)]";

// 번호 매긴 에디토리얼 역량 항목 [1] [2] [3]
function CapabilityItem({ cap, index }: { cap: CapabilityCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index - 1) * 0.06 }}
      className="border-t border-white/10 pt-5"
    >
      <span className="text-sm font-bold tabular-nums text-resume-text-sub">[{index}]</span>
      <h4 className="mt-3 text-lg font-bold tracking-tight text-resume-text-main">{cap.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-resume-text-sub break-keep">{cap.desc}</p>
      <ul className="mt-3 space-y-1.5">
        {cap.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-resume-text-main break-keep">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-resume-text-main/40" />
            {pt}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function CosmicHustle() {
  const c = localize(cosmicHustle);
  const blogCaps = c.capabilities.filter((cap) => cap.group === "blog");
  const engineCaps = c.capabilities.filter((cap) => cap.group === "engine");

  return (
    <section id="cosmic-hustle" className="relative z-20 scroll-mt-16 overflow-hidden bg-resume-bg py-24 text-resume-text-main">
      <CosmicTexture />

      <div className="mx-auto max-w-4xl px-6">
        {/* ===== 헤더 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-resume-text-sub">Flagship Project</span>
          <h2 className="text-gradient mt-3 pb-1 text-4xl font-bold tracking-tight md:text-6xl">{c.title}</h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-snug text-resume-text-main md:text-xl">{c.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-resume-text-sub break-keep md:text-base">{c.concept}</p>
        </motion.div>

        {/* ===================================================== */}
        {/* AI 블로그 — 운영 중 (배포 제품)                        */}
        {/* ===================================================== */}
        <div className="mt-14">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-resume-text-main md:text-3xl">AI 블로그</h3>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">배포 · 운영 중</span>
          </div>

          {/* 인터랙티브 갤러리 — 메인 + 썸네일 5장 클릭 전환 */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
            <ProjectGallery gallery={blogGallery} />
          </motion.div>

          {/* 글래스 지표 */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {c.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl p-5 ${GLASS}`}
              >
                <p className="text-3xl font-bold tracking-tight text-resume-text-main">
                  <CountUp value={m.value} />
                </p>
                <p className="mt-1.5 text-sm font-bold text-resume-text-main">{m.label}</p>
                {m.hint && <p className="mt-0.5 text-xs text-resume-text-sub">{m.hint}</p>}
              </motion.div>
            ))}
          </div>

          {/* 라이브 피드 */}
          <LiveFeed />

          {/* 라이브 링크 */}
          <div className="mt-6 flex flex-wrap gap-3">
            {c.links.live ? (
              <Link href={c.links.live} target="_blank" className="group inline-flex items-center gap-2 rounded-full bg-resume-text-main px-5 py-2.5 text-sm font-bold text-resume-bg transition-transform hover:-translate-y-0.5">
                라이브 블로그 열기
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ) : null}
            {c.links.github ? (
              <Link href={c.links.github} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-resume-text-main transition-colors hover:bg-white/10">
                <Github size={15} /> GitHub
              </Link>
            ) : null}
          </div>

          {/* [1][2][3] 역량 */}
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
            {blogCaps.map((cap, i) => (
              <CapabilityItem key={cap.id} cap={cap} index={i + 1} />
            ))}
          </div>

          {/* 제품 오너십 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className={`mt-10 rounded-2xl p-6 md:p-8 ${GLASS}`}
          >
            <h4 className="text-lg font-bold tracking-tight text-resume-text-main">{c.ownership.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-resume-text-sub break-keep">{c.ownership.desc}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {c.ownership.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-resume-text-main break-keep">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-resume-text-main/40" />
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ===================================================== */}
        {/* 멀티에이전트 리서치 엔진 (기술 코어, 미배포)            */}
        {/* ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-9"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight text-resume-text-main md:text-2xl">멀티에이전트 리서치 엔진</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 코어 기술 · 미배포
            </span>
          </div>
          <p className="mb-2 max-w-2xl text-sm leading-relaxed text-resume-text-sub break-keep">
            블로그를 떠받치는 기술 코어. CEO가 주제를 던지면 11명이 역할을 나눠 협업하는 인터랙티브 리서치 엔진으로, 기능 구현은 끝났고 배포 전입니다.
          </p>

          {/* 에이전트 11명 시각화 */}
          <div className="my-8 flex justify-center">
            <div className="w-full max-w-[360px]">
              <AgentConstellation />
            </div>
          </div>

          {/* 캐스트 — 11명 (캐릭터 사진 + 직책) */}
          <div className="mt-2 mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <p className="mb-5 text-sm font-bold text-resume-text-main">캐스트 — 3개 부서 11명</p>
            <AgentCast />
          </div>

          {/* [1][2] 역량 */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {engineCaps.map((cap, i) => (
              <CapabilityItem key={cap.id} cap={cap} index={i + 1} />
            ))}
          </div>

          <h4 className="mb-5 mt-10 text-base font-bold text-resume-text-main">엔진 파이프라인</h4>
          <PipelineDiagram steps={c.pipeline} />

          {/* 엔진 갤러리 — 아키텍처 + CEO 콘솔 + 스트리밍 + 리포트 */}
          <div className="mt-8">
            <ProjectGallery gallery={engineGallery} />
          </div>
        </motion.div>

        {/* 기술 스택 */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-resume-text-sub">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {c.techStack.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-resume-card px-3 py-1 text-xs font-semibold text-resume-text-main">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
