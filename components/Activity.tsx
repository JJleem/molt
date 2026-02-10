"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  School,
  Building2,
  Cpu, // 회로도 느낌을 살릴 CPU 아이콘
} from "lucide-react";

const ACTIVITIES = [
  // ... (데이터는 기존과 동일합니다) ...
  {
    id: 0,
    title: "한양사이버대학교",
    course: "컴퓨터공학과 (3학년 편입)",
    period: "2026.03 - Current",
    description:
      "프론트엔드 실무를 넘어 컴퓨터 공학(CS) 기초를 탄탄히 다지기 위해 편입했습니다. 자료구조, 운영체제, 알고리즘 등 소프트웨어 엔지니어링의 본질적인 역량을 강화하고 있습니다.",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 1,
    title: "서울형 뉴딜 일자리사업: 모던 웹 풀스택 개발자",
    course: "실무 프로젝트 과정",
    institution: "한국경영혁신중소기업협회",
    period: "2024.07 - 2024.08",
    description:
      "기업 현장에 즉시 투입 가능한 실무형 인재 양성 과정입니다. React와 Node.js를 활용한 풀스택 프로젝트를 수행하며, 협업 툴(Jira, Git) 활용 및 애자일 프로세스를 경험했습니다.",
    icon: BookOpen,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 2,
    title: "스마트 웹콘텐츠 UI/UX 퍼블리셔 & 프론트엔드",
    course: "정규 양성 과정",
    institution: "이젠아카데미DX교육센터",
    period: "2023.12 - 2024.06",
    description:
      "웹 표준과 접근성을 준수하는 UI/UX 퍼블리싱부터 JavaScript/React 프론트엔드 코어 기술까지, 개발자로서 필요한 전반적인 베이스를 6개월간 집중적으로 학습했습니다.",
    icon: BookOpen,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: 3,
    title: "인천폴리텍대학교 (인천캠퍼스)",
    course: "정보통신학과 (졸업)",
    period: "2017.03 - 2021.02",
    description:
      "정보통신 산업기사 취득 및 네트워크, 통신 프로토콜에 대한 기초 이해를 쌓았습니다. 하드웨어와 소프트웨어의 연결 구조를 이해하는 데 도움이 되었습니다.",
    icon: GraduationCap,
    color: "bg-slate-50 text-slate-600",
  },
  {
    id: 4,
    title: "신도림고등학교",
    course: "인문계 (졸업)",
    period: "2014.03 - 2017.02",
    description: "성실하게 교과 과정을 이수하며 졸업했습니다.",
    icon: School,
    color: "bg-slate-50 text-slate-500",
  },
];

// ⭐ 수정된 배경용 회로도 패턴 컴포넌트 (더 리얼하고 복잡한 디자인)
const CircuitPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none" // 투명도 약간 조절 (0.03 -> 0.05)
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern
      id="circuit-pattern-v2"
      x="0"
      y="0"
      width="200" // 패턴 크기를 키워 반복을 줄임
      height="200"
      patternUnits="userSpaceOnUse"
    >
      {/* 연결선 (Traces) */}
      <path
        d="M0 20h40l20 20h40l20-20h80 M200 180h-40l-20-20h-40l-20 20h-80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M100 0v40l20 20v80l-20 20v40 M0 100h200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M60 60h20v20h-20z M140 140h20v20h-20z M140 60h20v20h-20z M60 140h20v20h-20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* 연결점 (Pads/Vias) */}
      <circle cx="40" cy="20" r="3" fill="currentColor" />
      <circle cx="160" cy="20" r="3" fill="currentColor" />
      <circle cx="40" cy="180" r="3" fill="currentColor" />
      <circle cx="160" cy="180" r="3" fill="currentColor" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
      <circle cx="20" cy="100" r="2" fill="currentColor" />
      <circle cx="180" cy="100" r="2" fill="currentColor" />
      <circle cx="100" cy="20" r="2" fill="currentColor" />
      <circle cx="100" cy="180" r="2" fill="currentColor" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#circuit-pattern-v2)" />
  </svg>
);

const Activity = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <section className="py-10 bg-white relative z-20 overflow-hidden">
      {/* ⭐ 배경 영역: 새 회로도 패턴 + 그라데이션 마스크 */}
      <div className="absolute inset-0 pointer-events-none text-slate-900">
        <CircuitPattern />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,white_100%)]" />
        {/* ⭐ 추가됨: 상단 페이드 (흰색 -> 투명) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent" />

        {/* ⭐ 추가됨: 하단 페이드 (투명 -> 흰색) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-8 flex items-center gap-3"
        >
          <h1 className="w-full text-4xl md:text-5xl font-bold text-resume-text-main mb-2 tracking-tight border-b border-b-resume-primary pb-2  ">
            <span className="text-resume-primary"> Education & Training</span>
          </h1>
        </motion.div>

        {/* List Style */}
        <div className="space-y-4">
          {ACTIVITIES.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { delay: index * 0.1, duration: 0.5 },
                },
              }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Icon Column (Mobile Hidden) */}
                <div className="hidden md:block">
                  <div
                    className={`p-3 rounded-xl ${item.color} ring-1 ring-inset ring-black/5`}
                  >
                    <item.icon size={24} />
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-resume-text-main leading-tight">
                        {item.title}
                      </h3>
                      {/* 모바일용 서브 텍스트 */}
                      <div className="flex items-center gap-2 mt-1 text-sm text-indigo-600 font-medium md:hidden">
                        <Building2 size={14} />
                        <span>{item.course}</span>
                        {item.institution && <span> · {item.institution}</span>}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-semibold border border-slate-100 shrink-0 self-start">
                      <Calendar size={12} />
                      {item.period}
                    </span>
                  </div>

                  {/* Desktop Sub Text */}
                  <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                    <Building2 size={12} />
                    <span className="text-indigo-600 font-bold">
                      {item.course}
                    </span>
                    {item.institution && (
                      <>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{item.institution}</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-resume-text-main leading-relaxed mt-2 md:mt-0">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activity;
