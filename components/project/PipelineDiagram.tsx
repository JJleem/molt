"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PipelineStep } from "@/content/types";

// 멀티에이전트 파이프라인 — 세로 흐름 + 왼쪽 레일이 아래로 "그려지는" 다이어그램.
// 가독성 우선: 각 단계가 전체 폭을 써서 라벨/설명이 끼이지 않고 술술 읽힘.
export default function PipelineDiagram({ steps }: { steps: PipelineStep[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* 레일 트랙 (희미) */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-black/10" />
      {/* 레일 채움 — 스크롤 진입 시 위→아래로 그려짐 */}
      <motion.div
        className="absolute left-[15px] top-2 bottom-2 w-0.5 origin-top bg-resume-text-main"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            className="relative pl-14"
            initial={reduce ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.2 + i * 0.18 }}
          >
            {/* 노드 (번호) */}
            <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-resume-text-main text-sm font-bold text-resume-bg ring-4 ring-resume-bg">
              {i + 1}
            </span>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-resume-card px-4 py-3 shadow-sm">
              <p className="text-base font-bold text-resume-text-main md:text-lg">{step.label}</p>
              <p className="mt-1 text-sm text-resume-text-sub">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
