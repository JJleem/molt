"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Network,
  Brain,
  MessagesSquare,
  Server,
  Newspaper,
  TrendingUp,
  ExternalLink,
  Github,
  CheckCircle2,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cosmicHustle } from "@/content/cosmic-hustle";
import { localize } from "@/content/locale";
import type { CapabilityCard } from "@/content/types";
import PipelineDiagram from "./PipelineDiagram";
import CountUp from "@/components/ui/CountUp";
import LiveFeed from "@/components/cosmic/LiveFeed";

const CAP_ICONS: Record<string, LucideIcon> = {
  "daily-publish": Newspaper,
  "self-learning": Brain,
  rag: MessagesSquare,
  orchestration: Network,
  infra: Server,
};

// 이미지 슬롯 — path가 있으면 이미지, 없으면 "무슨 스크린샷 넣어라" 안내 placeholder.
function ImageSlot({
  src,
  alt,
  hint,
  ratio = "aspect-video",
}: {
  src?: string;
  alt: string;
  hint: string;
  ratio?: string;
}) {
  if (src) {
    return (
      <figure className={`relative ${ratio} w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm`}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </figure>
    );
  }
  return (
    <div className={`flex ${ratio} w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 p-6 text-center`}>
      <ImageIcon className="h-7 w-7 text-slate-400" />
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">이미지 자리</p>
      <p className="max-w-xs text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">{hint}</p>
    </div>
  );
}

function CapabilityBlock({ cap, index }: { cap: CapabilityCard; index: number }) {
  const Icon = CAP_ICONS[cap.id] ?? Network;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-resume-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-xl bg-resume-badge-bg p-2.5 text-resume-primary">
          <Icon size={20} />
        </div>
        <h4 className="text-base font-bold text-resume-text-main md:text-lg">{cap.title}</h4>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-resume-text-sub break-keep">{cap.desc}</p>
      <ul className="space-y-1.5">
        {cap.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-resume-text-main break-keep">
            <CheckCircle2 size={14} className="mt-1 shrink-0 text-resume-primary" />
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
    <section
      id="cosmic-hustle"
      className="relative z-20 scroll-mt-16 bg-resume-bg py-20 text-resume-text-main transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(99,102,241,0.10)_1px,transparent_1px)] [background-size:22px_22px] opacity-50" />

      <div className="mx-auto max-w-4xl px-6">
        {/* ===== 헤더 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-resume-primary">★ Flagship Project</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-resume-text-main md:text-5xl">{c.title}</h2>
          <p className="mt-3 text-lg font-semibold text-resume-text-main">{c.tagline}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-resume-text-sub break-keep md:text-base">{c.concept}</p>
        </motion.div>

        {/* ===================================================== */}
        {/* ② AI 블로그 — 운영 중 (배포 제품, 프로미넌트)            */}
        {/* ===================================================== */}
        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <h3 className="text-2xl font-bold text-resume-text-main md:text-3xl">AI 블로그</h3>
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              배포 · 운영 중
            </span>
          </div>

          {/* 대표 이미지 */}
          <ImageSlot
            alt="Cosmic Hustle 라이브 블로그 메인 화면"
            hint="① 운영 중인 블로그 메인 화면 풀샷. AI 에이전트들이 쓴 글 목록이 보이게. '진짜 돌아간다'의 1번 증거."
          />

          {/* 지표 */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {c.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-resume-card p-4 shadow-sm"
              >
                <p className="text-2xl font-bold text-resume-primary">
                  <CountUp value={m.value} />
                </p>
                <p className="mt-1 text-sm font-bold text-resume-text-main">{m.label}</p>
                {m.hint && <p className="mt-0.5 text-xs text-resume-text-sub">{m.hint}</p>}
              </motion.div>
            ))}
          </div>

          {/* 라이브 피드 */}
          <LiveFeed />

          {/* 라이브 링크 */}
          <div className="mt-6 flex flex-wrap gap-3">
            {c.links.live ? (
              <Link href={c.links.live} target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-resume-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90">
                <ExternalLink size={14} /> 라이브 블로그 열기
              </Link>
            ) : null}
            {c.links.github ? (
              <Link href={c.links.github} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-resume-card px-4 py-2 text-sm font-bold text-resume-text-main transition-colors hover:border-resume-primary">
                <Github size={14} /> GitHub
              </Link>
            ) : null}
          </div>

          {/* 블로그 역량 카드 */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {blogCaps.map((cap, i) => (
              <CapabilityBlock key={cap.id} cap={cap} index={i} />
            ))}
          </div>

          {/* DM / 성과 이미지 */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ImageSlot
              alt="에이전트 DM 실시간 스트리밍 화면"
              hint="③ 에이전트 DM 화면 — 토큰 스트리밍 답변 + '출처 칩'. 환각 방지 시각화가 드러나는 컷."
            />
            <ImageSlot
              alt="3축 성과 점수 / 페어와이즈 판사 화면"
              hint="④ 성과 평가 화면 — 글별 3축 점수 또는 페어와이즈 판정. '스스로 측정/학습'의 증거."
            />
          </div>

          {/* 제품 오너십 — 그로스/계측 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-2xl border border-resume-primary/20 bg-resume-badge-bg/40 p-6 md:p-8"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-resume-primary/15 p-2.5 text-resume-primary">
                <TrendingUp size={20} />
              </div>
              <h4 className="text-lg font-bold text-resume-text-main">{c.ownership.title}</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-resume-text-sub break-keep">{c.ownership.desc}</p>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {c.ownership.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-resume-text-main break-keep">
                  <CheckCircle2 size={14} className="mt-1 shrink-0 text-resume-primary" />
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ===================================================== */}
        {/* ① 멀티에이전트 리서치 엔진 (기술 코어, 미배포, 컴팩트)    */}
        {/* ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-white/[0.02] p-6 md:p-8"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-resume-text-main md:text-2xl">멀티에이전트 리서치 엔진</h3>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> 코어 기술 · 미배포
            </span>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-resume-text-sub break-keep">
            블로그를 떠받치는 기술 코어. CEO가 주제를 던지면 11명이 역할을 나눠 협업하는 인터랙티브 리서치 엔진으로,
            기능 구현은 끝났고 배포 전입니다.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {engineCaps.map((cap, i) => (
              <CapabilityBlock key={cap.id} cap={cap} index={i} />
            ))}
          </div>

          <h4 className="mb-5 mt-8 text-base font-bold text-resume-text-main">엔진 파이프라인</h4>
          <PipelineDiagram steps={c.pipeline} />

          <div className="mt-6">
            <ImageSlot
              alt="Cosmic Hustle 멀티에이전트 아키텍처 다이어그램"
              hint="② 엔진 아키텍처 다이어그램 (에이전트 ↔ FastAPI ↔ pgvector ↔ 스케줄러). 직접 그린 도식이면 베스트."
              ratio="aspect-[16/9]"
            />
          </div>
        </motion.div>

        {/* 기술 스택 */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-resume-text-sub">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {c.techStack.map((t) => (
              <span key={t} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-resume-card px-3 py-1 text-xs font-bold text-resume-text-main shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
