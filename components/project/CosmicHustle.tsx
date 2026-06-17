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
import ProjectGallery from "@/components/ui/ProjectGallery";
import { blogGallery, engineGallery } from "@/content/galleries";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#635bff";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

function CapabilityItem({ cap, index }: { cap: CapabilityCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index - 1) * 0.06 }}
      className="border-t border-[#e6ebf1] pt-5 pb-5"
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

export default function CosmicHustle() {
  const c = localize(cosmicHustle);
  const blogCaps = c.capabilities.filter((cap) => cap.group === "blog");
  const engineCaps = c.capabilities.filter((cap) => cap.group === "engine");

  return (
    <section id="cosmic-hustle" className="relative z-20 scroll-mt-16 overflow-hidden bg-white py-24" style={{ color: INK }}>
      <div className="mx-auto max-w-[1140px] px-6">

        {/* ── 섹션 헤더 ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: SLATE }}>Flagship Project</span>
          <h2 className="text-gradient mt-3 pb-1 text-4xl font-bold tracking-tight md:text-5xl">{c.title}</h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-snug" style={{ color: INK }}>{c.tagline}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed break-keep" style={{ color: SLATE }}>{c.concept}</p>
        </motion.div>

        {/* ── AI 블로그 — 2-col ── */}
        <div className="mt-16 border-t border-[#e6ebf1] pt-10">
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
                    className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_-4px_rgba(99,91,255,0.5)] transition-transform hover:-translate-y-0.5"
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
                    <Github size={15} /> GitHub
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
        </div>

        {/* ── 멀티에이전트 리서치 엔진 — alt bg ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl border border-[#e6ebf1] bg-[#f6f9fc] p-6 md:p-10"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight md:text-2xl" style={{ color: INK }}>멀티에이전트 리서치 엔진</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 코어 기술 · 미배포
            </span>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed break-keep" style={{ color: SLATE }}>
            블로그를 떠받치는 기술 코어. CEO가 주제를 던지면 11명이 역할을 나눠 협업하는 인터랙티브 리서치 엔진으로, 기능 구현은 끝났고 배포 전입니다.
          </p>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr]">
            {/* Left: 시각화 */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-center">
                <div className="w-full max-w-[340px]">
                  <AgentConstellation />
                </div>
              </div>
              <div className="rounded-2xl border border-[#e6ebf1] bg-white p-5">
                <p className="mb-4 text-sm font-bold" style={{ color: INK }}>캐스트 — 3개 부서 11명</p>
                <AgentCast />
              </div>
            </div>

            {/* Right: 내용 */}
            <div className="flex flex-col gap-4">
              <div>
                {engineCaps.map((cap, i) => (
                  <CapabilityItem key={cap.id} cap={cap} index={i + 1} />
                ))}
              </div>
              <h4 className="mt-2 text-sm font-bold" style={{ color: INK }}>엔진 파이프라인</h4>
              <PipelineDiagram steps={c.pipeline} />
              <div className="mt-4">
                <ProjectGallery gallery={engineGallery} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 기술 스택 */}
        <div className="mt-12 border-t border-[#e6ebf1] pt-8">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: SLATE }}>Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {c.techStack.map((t) => (
              <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-3 py-1 text-xs font-semibold" style={{ color: INK }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
