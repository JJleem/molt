"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { cosmicHustle } from "@/content/cosmic-hustle";
import { localize } from "@/content/locale";
import type { CapabilityCard } from "@/content/types";
import PipelineDiagram from "./PipelineDiagram";
import CountUp from "@/components/ui/CountUp";
import GridGuides from "@/components/ui/GridGuides";
import LiveFeed from "@/components/cosmic/LiveFeed";
import AgentConstellation from "@/components/hero/AgentConstellation";
import ProjectGallery from "@/components/ui/ProjectGallery";
import { blogGallery, engineGallery } from "@/content/galleries";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#0d9488";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

function CapabilityItem({ cap, index }: { cap: CapabilityCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index - 1) * 0.06 }}
      className="pt-5 pb-5"
    >
      <span className="text-sm font-bold tabular-nums" style={{ color: BLURPLE }}>[{index}]</span>
      <h4 className="mt-2 text-[15px] font-bold tracking-tight" style={{ color: INK }}>{cap.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed break-keep" style={{ color: SLATE }}>{cap.desc}</p>
      <ul className="mt-2.5 space-y-1.5">
        {cap.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed break-keep" style={{ color: INK }}>
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: SLATE }} />
            {pt}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// 레이어별 기술 스택 — 블로그/엔진 각각 자기 블록 안에서 렌더링.
function TechStack({
  title,
  groups,
}: {
  title: string;
  groups: { label: string; items: string[] }[];
}) {
  return (
    <div className="mt-10 pt-7">
      <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: SLATE }}>{title}</h4>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2.5 flex items-center gap-2 text-[13px] font-bold" style={{ color: INK }}>
              <span className="h-3 w-[3px] rounded-full" style={{ background: BLURPLE }} />
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((t) => (
                <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-3 py-1 text-xs font-semibold" style={{ color: INK }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// stripe-3/4 체크리스트 아이템 — 체크 아이콘 + 텍스트.
function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] leading-relaxed break-keep" style={{ color: INK }}>
      <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" color={BLURPLE} />
      {text}
    </li>
  );
}

export default function CosmicHustle() {
  const c = localize(cosmicHustle);
  const blogCaps = c.capabilities.filter((cap) => cap.group === "blog");
  const engineCaps = c.capabilities.filter((cap) => cap.group === "engine");
  const orchestration = engineCaps.find((cap) => cap.id === "orchestration") ?? engineCaps[0];
  const infra = engineCaps.find((cap) => cap.id === "infra") ?? engineCaps[1];

  return (
    <section id="cosmic-hustle" className="relative z-20 scroll-mt-16 overflow-hidden bg-white py-24" style={{ color: INK }}>
      <GridGuides columns={4} />
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">

        {/* ── 섹션 헤더 ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#0e9bb5" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#0e9bb5" }} />
            Flagship Project
          </span>
          <h2 className="text-gradient mt-3 pb-1 text-4xl font-bold tracking-tight md:text-5xl">{c.title}</h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-snug" style={{ color: INK }}>{c.tagline}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed break-keep" style={{ color: SLATE }}>{c.concept}</p>
        </motion.div>

        {/* ── AI 블로그 — 2-col ── */}
        <div className="mt-16 pt-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: INK }}>AI 블로그</h3>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">배포 · 운영 중</span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr]">
            {/* Left: 설명 + capabilities + CTAs */}
            <div className="flex flex-col">
              <p className="text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>{c.ownership.desc}</p>

              <div className="mt-2">
                {blogCaps.map((cap, i) => (
                  <CapabilityItem key={cap.id} cap={cap} index={i + 1} />
                ))}
              </div>

              {/* Ownership 포인트 (condensed) */}
              <div className={`mt-4 rounded-2xl p-5 ${CARD}`}>
                <h4 className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: SLATE }}>{c.ownership.title}</h4>
                <ul className="mt-3 space-y-1.5">
                  {c.ownership.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed break-keep" style={{ color: INK }}>
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: BLURPLE }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                {c.links.live && (
                  <Link
                    href={c.links.live}
                    target="_blank"
                    className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_-4px_rgba(13,148,136,0.5)] transition-transform hover:-translate-y-0.5"
                    style={{ background: BLURPLE }}
                  >
                    라이브 블로그
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
                {c.links.github && (
                  <Link
                    href={c.links.github}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e6ebf1] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#f6f9fc]"
                    style={{ color: INK }}
                  >
                    <Github size={15} /> 백엔드 GitHub
                  </Link>
                )}
              </div>
            </div>

            {/* Right: gallery + metrics + livefeed */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
              >
                <ProjectGallery gallery={blogGallery} />
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {c.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`rounded-2xl p-5 ${CARD}`}
                  >
                    <p className="text-3xl font-bold tracking-tight" style={{ color: INK }}>
                      <CountUp value={m.value} />
                    </p>
                    <p className="mt-1.5 text-sm font-bold" style={{ color: INK }}>{m.label}</p>
                    {m.hint && <p className="mt-0.5 text-xs" style={{ color: SLATE }}>{m.hint}</p>}
                  </motion.div>
                ))}
              </div>

              <LiveFeed />
            </div>
          </div>

          {/* 블로그 기술 스택 — 엔진과 별개 시스템 */}
          <TechStack title="Tech Stack · AI 블로그" groups={c.techStack.blog} />
        </div>

        {/* ── 멀티에이전트 리서치 엔진 — stripe-3/4 스타일: 인트로 + 교차 피처 행 + How it works ── */}
        <div className="mt-24 pt-16">
          {/* 인트로: eyebrow + 큰 헤드라인 + 본문 (stripe-3 상단) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: BLURPLE }}>
              Core Engine
            </span>
            <h3 className="mt-3 text-3xl font-bold leading-[1.15] tracking-tight md:text-[40px]" style={{ color: INK }}>
              11명이 역할을 나눠 협업하는<br className="hidden sm:block" /> 멀티에이전트 리서치 엔진
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>
              블로그를 떠받치는 기술 코어. CEO가 주제를 던지면 11명의 에이전트가 부서를 나눠 병렬로 리서치하는
              인터랙티브 엔진으로, <span className="font-semibold" style={{ color: INK }}>기능 구현은 끝났고 배포 전</span>입니다.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 코어 기술 · 미배포
            </span>
          </motion.div>

          {/* 피처 행 1: 텍스트 좌 / 별자리 우 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div>
              <h4 className="text-xl font-bold tracking-tight md:text-2xl" style={{ color: INK }}>{orchestration.title}</h4>
              <p className="mt-3 text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>{orchestration.desc}</p>
              <ul className="mt-5 space-y-3">
                {orchestration.points.map((pt, i) => <CheckItem key={i} text={pt} />)}
              </ul>
            </div>
            <div className="flex justify-center rounded-2xl border border-[#e6ebf1] bg-[#f6f9fc] p-6">
              <div className="w-full max-w-[360px]"><AgentConstellation /></div>
            </div>
          </motion.div>

          {/* 엔진 파이프라인 — 설명문 조금 + SideProjects식 카드 슬라이더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: BLURPLE }}>How it works</span>
            <h4 className="mt-3 text-xl font-bold tracking-tight md:text-2xl" style={{ color: INK }}>
              주제 → 지식까지, 6단계 자동 흐름
            </h4>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>
              CEO가 주제를 던지면 플랜이 태스크로 쪼개고, 병렬 리서치 → 분석 → 작성 → 팩트체크를 거쳐 지식으로 누적됩니다.
              각 단계를 역할이 다른 에이전트가 맡아 이어받습니다.
            </p>
            <div className="mt-6">
              <PipelineDiagram steps={c.pipeline} />
            </div>
          </motion.div>

          {/* 피처 행 2: 지식 인프라 (텍스트만) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-16 max-w-2xl"
          >
            <h4 className="text-xl font-bold tracking-tight md:text-2xl" style={{ color: INK }}>{infra.title}</h4>
            <p className="mt-3 text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>{infra.desc}</p>
            <ul className="mt-5 space-y-3">
              {infra.points.map((pt, i) => <CheckItem key={i} text={pt} />)}
            </ul>
          </motion.div>

          {/* 엔진 화면 쇼케이스 — stripe-3/4 제품 비주얼 (사진 추가 예정) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="mb-6 flex gap-3">
              <span className="mt-1 w-[3px] flex-shrink-0 rounded-full" style={{ background: BLURPLE }} />
              <div>
                <p className="text-sm font-bold" style={{ color: INK }}>엔진 화면</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed break-keep" style={{ color: SLATE }}>
                  CEO 콘솔 · 실시간 스트리밍 · 리서치 리포트 · 아키텍처 도식.
                </p>
              </div>
            </div>
            <ProjectGallery gallery={engineGallery} />
          </motion.div>

          {/* 엔진 기술 스택 — 블로그와 별개 시스템 */}
          <TechStack title="Tech Stack · 리서치 엔진" groups={c.techStack.engine} />
        </div>
      </div>
    </section>
  );
}
