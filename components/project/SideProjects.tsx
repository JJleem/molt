"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  CloudLightning,
  LayoutTemplate,
  Code2,
  ExternalLink,
  Github,
  TerminalSquare,
  Dna,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    id: 1,
    title: "Naver Ad Data Pipeline",
    category: "Freelance / Data Engineering",
    period: "2026.01 (1 Month)",
    description:
      "네이버 검색광고 API와 연동하여 노출수·클릭수·CTR·총비용 등 핵심 마케팅 지표를 수집하는 데이터 파이프라인입니다. 기존 GAS의 성능 한계를 GCP Serverless로 마이그레이션하여 대용량 광고 데이터의 정합성을 확보했습니다.",
    tech: ["GCP (Cloud Run)", "BigQuery", "Node.js", "Cloud Scheduler"],
    achievements: [
      "GAS 실행 시간(6분) 한계를 극복하고, 광고 성과 지표의 누락 없는 수집 환경 구축",
      "Node.js 스트리밍으로 4,000만 건의 레거시 광고 데이터를 BigQuery에 초기 적재 및 파티셔닝 적용",
      "Cloud Scheduler로 매일 전일자 광고 리포트를 자동 적재하여 ROAS 분석을 위한 데이터 마트 기반 마련",
    ],
    icon: CloudLightning,
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
    github: "https://github.com/JJleem/naver-ads-automation",
    link: null,
    logo: null,
  },
  {
    id: 2,
    title: "Mockitup",
    category: "Open Source / Productivity Tool",
    period: "Personal Project",
    description:
      "복잡한 Mock 데이터를 시각적으로 설계하고 JSON/TS/SQL로 즉시 변환해 주는 웹 도구입니다. 백엔드 API가 나오기 전 프론트엔드 개발 생산성을 높이기 위해 만들었습니다.",
    tech: ["React", "TypeScript", "Zustand", "Faker.js", "Vite"],
    achievements: [
      "깊이 제한 없는 트리 구조 처리를 위한 재귀적 컴포넌트 설계",
      "실무 니즈를 반영한 한국어 데이터셋 적용 및 실시간 프리뷰 기능",
      "사내 및 동료 개발자 16명(MAU)이 사용하는 실무 도구로 발전",
    ],
    icon: LayoutTemplate,
    color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    github: "https://github.com/JJleem/Mockitup",
    link: "https://jjleem.github.io/Mockitup/",
    logo: "/assets/mockitup.png",
  },
  {
    id: 3,
    title: "Claude Console",
    category: "Personal / LLM Observability Dashboard",
    period: "Personal Project",
    description:
      "Claude Code의 모든 설정을 한 곳에서 관리하고 LLM 호출을 추적하며, 프롬프트를 버전 관리하고 Eval을 실행하는 개발자 전용 로컬 대시보드입니다. RAG · Tool Use · Multi-agent · Prompt Harness · Eval을 직접 구현하며 AI Application Engineering 핵심 역량을 체득하는 프로젝트입니다.",
    tech: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Claude API", "SQLite", "Drizzle ORM", "SSE"],
    achievements: [
      "loggedClaude 래퍼로 모든 Claude API 호출을 SQLite에 자동 기록, Tool Use 루프 에이전트 동작 추적",
      "LLM-as-judge Eval 에이전트: get_runs → submit_evaluation 도구 반복 호출로 관련성·정확도 자동 채점",
      "SSE + 전역 EventEmitter 싱글톤으로 Claude Code 실행 이벤트 실시간 스트림 구현",
    ],
    icon: TerminalSquare,
    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    github: "https://github.com/JJleem/claude-console",
    link: null,
    logo: null,
  },
  {
    id: 4,
    title: "GeckoHub (MVP)",
    category: "Full-Stack / Pet Management Service",
    period: "Personal Project",
    description:
      "크레스티드 게코의 혈통과 성장 과정을 기록하는 풀스택 웹 서비스입니다. Next.js와 Django를 연동하고, AI 툴을 활용한 Vibe Coding으로 핵심 로직 구현에 집중했습니다.",
    tech: ["Next.js 14", "Python", "Typescript", "Django (DRF)", "Supabase", "NextAuth", "Tailwind"],
    achievements: [
      "Self-referencing 모델링으로 부모-자식 개체 간의 '혈통 가계도' 시각화 로직 구현",
      "NextAuth(Social)와 Django JWT 인증 시스템을 통합하여 보안 로그인 환경 구축",
      "Vercel Serverless Function으로 프론트/백엔드를 통합 배포하여 운영 비용 최적화",
    ],
    icon: Dna,
    color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    github: "https://github.com/JJleem/gecko-hub",
    link: "https://gecko-hub-web.vercel.app/",
    logo: null,
  },
];

const SideProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <section className="relative z-20 min-h-screen bg-resume-bg text-resume-text-main pb-15 transition-colors duration-300">
      <div className="absolute h-full w-full inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(100,116,139,0.12)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none -z-10" />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-10 flex items-center gap-3"
        >
          <h1 className="w-full text-4xl md:text-5xl font-bold text-resume-text-main mb-2 tracking-tight border-b border-b-resume-primary pb-2">
            <span className="text-resume-primary">Side Project.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 } },
              }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${project.logo ? "bg-transparent" : project.color} ${!project.logo && "ring-1 ring-inset ring-black/5 dark:ring-white/5"}`}>
                    {project.logo ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image src={project.logo} alt={`${project.title} logo`} fill className="object-cover" />
                      </div>
                    ) : (
                      <project.icon size={24} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{project.title}</h3>
                      <div className="flex items-center gap-1 ml-1">
                        {project.github && (
                          <Link href={project.github} target="_blank" className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1" title="View Github Repo">
                            <Github size={16} />
                          </Link>
                        )}
                        {project.link && (
                          <Link href={project.link} target="_blank" className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1" title="Visit Live Site">
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{project.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 min-h-[60px]">{project.description}</p>

              <div className="mb-6 flex-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Key Achievements</h4>
                <ul className="space-y-1.5">
                  {project.achievements.map((item, i) => (
                    <li key={i} className="text-[13px] text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-snug">
                      <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold rounded border border-slate-200 dark:border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideProjects;
