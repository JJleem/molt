"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, Link as LinkIcon, ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";
import AgentConstellation from "./AgentConstellation";
import { profile } from "@/content/profile";
import { localize } from "@/content/locale";

const CHIPS = ["AI 에이전트 11명", "매일 자동 발행", "운영 중 · 실사용자 유입"];

export default function Hero() {
  const p = localize(profile);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#080812] text-slate-200">
      {/* 딥스페이스 그라데이션 + 오로라 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.14),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:px-12 lg:grid-cols-2">
        {/* 좌: 텍스트 (LCP 즉시 노출) */}
        <div className="flex flex-col gap-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-200"
          >
            <Sparkles size={13} /> {p.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="whitespace-pre-line text-3xl font-bold leading-[1.2] tracking-tight text-white md:text-5xl"
          >
            {p.positioning}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-xl text-sm leading-relaxed text-slate-300 break-keep md:text-base"
          >
            <span className="font-bold text-slate-200">{p.name}</span> · {p.summary}
          </motion.p>

          {/* 핵심 칩 (시간 지나도 안 늙는 사실만) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="flex flex-wrap gap-2"
          >
            {CHIPS.map((c) => (
              <span key={c} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                {c}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <Link
              href="#cosmic-hustle"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400"
            >
              <ArrowDown size={16} /> 대표작 Cosmic Hustle 보기
            </Link>
            <Link
              href={`mailto:${p.links.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <Mail size={16} /> 연락하기
            </Link>
          </motion.div>

          {/* 연락처 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 flex items-center gap-5 text-sm text-slate-400"
          >
            <Link href={p.links.github} target="_blank" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Github size={16} /> GitHub
            </Link>
            {p.links.blog && (
              <Link href={p.links.blog} target="_blank" className="flex items-center gap-1.5 transition-colors hover:text-indigo-300">
                <LinkIcon size={16} /> Blog
              </Link>
            )}
          </motion.div>
        </div>

        {/* 우: 에이전트 별자리 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-first lg:order-last"
        >
          <AgentConstellation />
        </motion.div>
      </div>

      {/* 스크롤 힌트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { duration: 1.8, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}
