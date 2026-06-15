"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Link as LinkIcon, ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { profile } from "@/content/profile";
import { localize } from "@/content/locale";
import CosmicTexture from "@/components/ui/CosmicTexture";

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  const p = localize(profile);

  return (
    <section id="top" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-resume-bg">
      <CosmicTexture />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center">
        {/* 바이라인 — 얼굴 + 이름 (우아하게) */}
        <motion.div
          {...fade}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center justify-center gap-3"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-black/10">
            <Image src="/assets/jj.png" alt={p.name} fill className="object-cover" priority />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold leading-tight text-resume-text-main">{p.name}</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-resume-text-sub">
              {p.eyebrow}
            </p>
          </div>
        </motion.div>

        {/* 거대 에디토리얼 타이포 — 진/흐림 믹스 */}
        <motion.h1
          {...fade}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[2.5rem] font-bold leading-[1.12] tracking-[-0.02em] md:text-[4.5rem]"
        >
          <span className="block font-light text-resume-text-sub">프론트엔드부터 AI 시스템까지,</span>
          <span className="block text-resume-text-main">제품을 끝까지 만듭니다.</span>
        </motion.h1>

        {/* 위트있는 한 줄 */}
        <motion.p
          {...fade}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-resume-text-sub break-keep md:text-lg"
        >
          {p.summary}
        </motion.p>

        {/* CTA — 모노 다크 pill */}
        <motion.div
          {...fade}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#cosmic-hustle"
            className="group inline-flex items-center gap-2 rounded-full bg-resume-text-main px-6 py-3 text-sm font-bold text-resume-bg transition-transform hover:-translate-y-0.5"
          >
            대표작 Cosmic Hustle
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href={`mailto:${p.links.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-bold text-resume-text-main transition-colors hover:bg-black/5"
          >
            연락하기
          </Link>
        </motion.div>

        {/* 연락처 */}
        <motion.div
          {...fade}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-resume-text-sub"
        >
          <Link href={p.links.github} target="_blank" className="flex items-center gap-1.5 transition-colors hover:text-resume-text-main">
            <Github size={16} /> GitHub
          </Link>
          {p.links.blog && (
            <Link href={p.links.blog} target="_blank" className="flex items-center gap-1.5 transition-colors hover:text-resume-text-main">
              <LinkIcon size={16} /> Blog
            </Link>
          )}
        </motion.div>
      </div>

      {/* 스크롤 힌트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { duration: 1.8, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-resume-text-sub/50"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}
