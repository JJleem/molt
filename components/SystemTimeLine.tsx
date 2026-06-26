"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import SlantBg from "@/components/sections/SlantBg";
import GlobeWireframe from "@/components/GlobeWireframe";

const INK = "#0a2540";
const SLATE = "#425466";
const TEAL = "#0d9488";
const AMBER = "#f59e0b";

type Entry = {
  period: string;
  org: string;
  role: string;
  type: "WORK" | "EDU";
  current?: boolean;
};

const CAREER: Entry[] = [
  { period: "2026.03 — 재학", org: "한양사이버대학교", role: "컴퓨터공학과 · 3학년 편입", type: "EDU", current: true },
  { period: "2025.01 — 현재", org: "(주)캐리마", role: "프론트엔드 · C-HUB V2.0 (산업용 3D프린터 관제)", type: "WORK", current: true },
  { period: "2024.09 — 2025.01", org: "(주)미디어그룹 사람과숲", role: "프론트엔드 · 골프 지오펜싱 앱 (React Native)", type: "WORK" },
  { period: "2023.12 — 2024.08", org: "이젠아카데미 DX · 서울형 뉴딜", role: "웹 풀스택 부트캠프 · UI/UX · 프론트엔드", type: "EDU" },
  { period: "2022.10 — 2024.01", org: "(주)미디어그룹 사람과숲", role: "IT 영업지원 · 프로젝트 관리", type: "WORK" },
  { period: "2020.10 — 2022.02", org: "영전엔지니어링", role: "삼성반도체 현장 전기공사 · 팀 리더", type: "WORK" },
  { period: "2017.03 — 2021.02", org: "인천폴리텍대학교", role: "정보통신학과 (졸업)", type: "EDU" },
];

// once: true — 화면에 진입하면 고정, 스크롤 역방향에도 사라지지 않음
const TimelineItem = ({
  entry,
  index,
  isLast,
}: {
  entry: Entry;
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const isWork = entry.type === "WORK";

  return (
    <motion.div
      ref={ref}
      className={`relative flex gap-6 md:gap-8 ${isLast ? "" : "pb-10 md:pb-14"}`}
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
    >
      {/* 도트 */}
      <div className="relative z-10 mt-1 shrink-0">
        <motion.div
          className="h-3 w-3 rounded-full border-2 md:h-4 md:w-4"
          style={{
            borderColor: entry.current ? TEAL : "#cbd5e1",
            background: entry.current ? TEAL : "white",
            boxShadow: entry.current ? "0 0 0 4px #0d948820" : "none",
          }}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1, type: "spring", stiffness: 300 }}
        />
      </div>

      {/* 내용 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[12px] font-semibold tabular-nums md:text-sm"
            style={{ color: entry.current ? TEAL : "#64748b" }}
          >
            {entry.period}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider md:text-[11px]"
            style={{
              color: isWork ? "#0f766e" : "#b45309",
              background: isWork ? "#0d948814" : "#f59e0b14",
            }}
          >
            {entry.type}
          </span>
        </div>
        <div className="mt-1 text-base font-bold tracking-tight md:text-[18px]" style={{ color: INK }}>
          {entry.org}
        </div>
        <p className="mt-1 text-[13px] leading-snug break-keep md:text-[15px]" style={{ color: SLATE }}>
          {entry.role}
        </p>
      </div>
    </motion.div>
  );
};

const SystemTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 세로 선만 스크롤 드리븐 유지 — 올려도 사라지지 않도록 [0,1] 고정
  const lineScale = useTransform(scrollYProgress, [0, 0.02, 0.82, 1], [0, 0, 1, 1]);

  return (
    <section
      id="career"
      ref={sectionRef}
      className="relative scroll-mt-16 w-full overflow-hidden px-6 py-28 md:px-12"
      style={{ color: INK }}
    >
      <SlantBg color="#f6f9fc" top={false} bottom />

      <div className="relative z-10 mx-auto w-full max-w-[1140px]">
        {/* 헤더 */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        {/* 2컬럼 — 타임라인 | 지구 */}
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">
          {/* ── 타임라인 ── */}
          <div className="relative min-w-0 flex-1">
            {/* 스크롤 드리븐 세로 선 */}
            <motion.div
              className="absolute left-[5px] top-2 bottom-2 w-px origin-top md:left-[7px]"
              style={{
                background: "linear-gradient(to bottom, #0d9488 60%, #0d948818 100%)",
                scaleY: lineScale,
              }}
            />

            {CAREER.map((e, i) => (
              <TimelineItem
                key={`${e.period}-${i}`}
                entry={e}
                index={i}
                isLast={i === CAREER.length - 1}
              />
            ))}
          </div>

          {/* ── 대륙 점 지구본 (데스크탑) — 크게, 오른쪽으로 짤려 보이게 ── */}
          <div className="hidden shrink-0 lg:block lg:w-[460px]">
            <div className="sticky top-24">
              <div className="relative h-[680px] overflow-hidden">
                {/* 뒤 글로우 */}
                <div
                  className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(circle, #0d948840 0%, transparent 70%)" }}
                />
                {/* 지구 — 오른쪽 바깥으로 밀어 짤리게 */}
                <div className="absolute right-[-220px] top-1/2 h-[680px] w-[680px] -translate-y-1/2">
                  <GlobeWireframe />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemTimeline;
