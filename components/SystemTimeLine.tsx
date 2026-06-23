"use client";

import React from "react";
import { motion } from "framer-motion";
import SlantBg from "@/components/sections/SlantBg";

const INK = "#0a2540";
const SLATE = "#425466";
const TEAL = "#0d9488";
const AMBER = "#f59e0b";

type Entry = {
  period: string; // 정확한 기간 (YYYY.MM — YYYY.MM)
  org: string;
  role: string;
  type: "WORK" | "EDU";
  current?: boolean; // 진행 중(현직·재학) — 하이라이트 행
};

// 역순(최신 → 과거). 고등학교는 신호가 약해 제외.
const CAREER: Entry[] = [
  { period: "2026.03 — 재학", org: "한양사이버대학교", role: "컴퓨터공학과 · 3학년 편입", type: "EDU", current: true },
  { period: "2025.01 — 현재", org: "(주)캐리마", role: "프론트엔드 · C-HUB V2.0 (산업용 3D프린터 관제)", type: "WORK", current: true },
  { period: "2024.09 — 2025.01", org: "(주)미디어그룹 사람과숲", role: "프론트엔드 · 골프 지오펜싱 앱 (React Native)", type: "WORK" },
  { period: "2024.07 — 2024.08", org: "서울형 뉴딜 일자리사업", role: "모던 웹 풀스택 실무 프로젝트", type: "EDU" },
  { period: "2023.12 — 2024.06", org: "이젠아카데미 DX교육센터", role: "스마트 웹콘텐츠 UI/UX · 프론트엔드", type: "EDU" },
  { period: "2022.10 — 2024.01", org: "(주)미디어그룹 사람과숲", role: "IT 영업지원 · 프로젝트 관리", type: "WORK" },
  { period: "2020.10 — 2022.02", org: "영전엔지니어링", role: "삼성반도체 현장 전기공사 · 팀 리더", type: "WORK" },
  { period: "2017.03 — 2021.02", org: "인천폴리텍대학교", role: "정보통신학과 (졸업)", type: "EDU" },
];

const SystemTimeline = () => {
  return (
    <section
      id="career"
      className="relative scroll-mt-16 w-full overflow-hidden px-6 py-28 md:px-12"
      style={{ color: INK }}
    >
      <SlantBg color="#f6f9fc" top={false} bottom />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-10">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: AMBER }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: AMBER }} />
            Journey
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl" style={{ color: INK }}>
            경력 &amp; 학력
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6ebf1] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {CAREER.map((e, i) => {
            const isWork = e.type === "WORK";
            return (
              <motion.div
                key={`${e.period}-${e.org}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-[#f6f9fc] md:gap-6 md:px-6 ${
                  i ? "border-t border-[#eef1f5]" : ""
                } ${e.current ? "bg-[#0d9488]/[0.04]" : ""}`}
              >
                {/* 기간 */}
                <span
                  className="w-[108px] shrink-0 whitespace-nowrap text-[11.5px] font-semibold tabular-nums md:w-[126px] md:text-[12.5px]"
                  style={{ color: e.current ? TEAL : "#64748b" }}
                >
                  {e.period}
                </span>

                {/* 본문 */}
                <div className="min-w-0 flex-1">
                  <span className="text-[15px] font-bold tracking-tight" style={{ color: INK }}>
                    {e.org}
                  </span>
                  <p className="mt-0.5 text-[13px] leading-snug break-keep" style={{ color: SLATE }}>
                    {e.role}
                  </p>
                </div>

                {/* WORK / EDU 태그 */}
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: isWork ? "#0f766e" : "#b45309",
                    background: isWork ? "#0d948814" : "#f59e0b14",
                  }}
                >
                  {e.type}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SystemTimeline;
