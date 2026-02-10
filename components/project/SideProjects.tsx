"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  CloudLightning,
  LayoutTemplate,
  Code2,
  ExternalLink,
  Github,
  Rocket,
  Dna, // Github 아이콘 추가
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    id: 1,
    title: "Naver Ad Data Pipeline",
    category: "Freelance / Data Engineering",
    period: "2026.01 (1 Month)",
    // ⭐ 수정됨: '무엇을(광고지표)' '왜(분석)' 수집하는지 명시 + 기술적 해결(Migration)
    description:
      "네이버 검색광고 API와 연동하여 노출수·클릭수·CTR·총비용 등 핵심 마케팅 지표를 수집하는 데이터 파이프라인입니다. 기존 GAS의 성능 한계를 GCP Serverless로 마이그레이션하여 대용량 광고 데이터의 정합성을 확보했습니다.",
    tech: ["GCP (Cloud Run)", "BigQuery", "Node.js", "Cloud Scheduler"],
    achievements: [
      // 1. 문제 해결 (데이터 누락 방지 & 안정성)
      "GAS 실행 시간(6분) 한계를 극복하고, 광고 성과 지표의 누락 없는 수집 환경 구축",
      // 2. 대용량 처리 (데이터 엔지니어링 역량)
      "Node.js 스트리밍으로 4,000만 건의 레거시 광고 데이터를 BigQuery에 초기 적재 및 파티셔닝 적용",
      // 3. 자동화 & 비즈니스 가치 (ROAS 분석 기반 마련)
      "Cloud Scheduler로 매일 전일자 광고 리포트를 자동 적재하여 ROAS 분석을 위한 데이터 마트 기반 마련",
    ],
    icon: CloudLightning,
    color: "bg-teal-50 text-teal-600",

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
    color: "bg-indigo-50 text-indigo-600",

    // ⭐ GitHub 및 배포 링크 설정
    github: "https://github.com/JJleem/Mockitup",
    link: "https://jjleem.github.io/Mockitup/",

    logo: "/assets/mockitup.png",
  },
  {
    id: 3,
    title: "MoltSpace (Portfolio v1)", // v1임을 명시
    category: "Personal / 3D Interactive Web",
    period: "Legacy Project",
    description:
      "'Molt'와 'Space'를 결합한 우주 컨셉의 3D 웹 사이트입니다. 이전 버전의 포트폴리오로, Three.js를 활용한 시각적 효과와 사용자 중심의 직관적인 UI/UX 구현에 집중했습니다.",
    tech: ["React", "TypeScript", "Three.js", "Recoil"],
    achievements: [
      // 1. 성능 최적화 (가장 중요)
      "Three.js 렌더링 최적화: 뷰포트 이탈 시 렌더링 루프를 중지하여 메모리 리소스 관리",
      // 2. 아키텍처
      "JSON 기반의 데이터 구조 설계 및 동적 라우팅으로 유지보수성 확보",
      // 3. UX 개선
      "모바일/데스크톱 인터랙션 분기 처리로 디바이스별 끊김 없는 경험 제공",
    ],
    icon: Rocket, // lucide-react에서 Rocket 아이콘 import 필요
    color: "bg-purple-50 text-purple-600",

    github: "https://github.com/JJleem/Portfolio",
    link: "https://moltspace.com/", // 배포된 링크가 있다면 넣으세요 (없으면 null)
    logo: "/assets/moltspace.png",
  },
  {
    id: 4,
    title: "GeckoHub (MVP)",
    category: "Full-Stack / Pet Management Service",
    period: "Personal Project",
    // ⭐ AI 활용(Vibe Coding)을 'Rapid Prototyping'으로 포장
    description:
      "크레스티드 게코의 혈통과 성장 과정을 기록하는 풀스택 웹 서비스입니다. Next.js와 Django를 연동하고, AI 툴을 활용한 Vibe Coding으로 핵심 로직 구현에 집중했습니다.",
    tech: [
      "Next.js 14",
      "Python",
      "Typescript",
      "Django (DRF)",
      "Supabase",
      "NextAuth",
      "Tailwind",
    ],
    achievements: [
      // 1. 데이터 모델링 강조
      "Self-referencing 모델링으로 부모-자식 개체 간의 '혈통 가계도' 시각화 로직 구현",
      // 2. 풀스택 연동 강조
      "NextAuth(Social)와 Django JWT 인증 시스템을 통합하여 보안 로그인 환경 구축",
      // 3. 인프라/배포
      "Vercel Serverless Function으로 프론트/백엔드를 통합 배포하여 운영 비용 최적화",
    ],
    icon: Dna,
    color: "bg-green-50 text-green-600",

    // 깃허브만 있어도 충분합니다.
    github: "https://github.com/JJleem/gecko-hub",
    link: "https://gecko-hub-web.vercel.app/", // 배포 링크 있으면 넣고 없으면 null
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
    <section className="relative z-20 min-h-screen bg-resume-bg text-resume-text-main pb-15">
      <div className="absolute h-full w-full inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none -z-10" />
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
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
          <h1 className="w-full text-4xl md:text-5xl font-bold text-resume-text-main mb-2 tracking-tight border-b border-b-resume-primary pb-2  ">
            <span className="text-resume-primary">Side Project.</span>
          </h1>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1, duration: 0.5 },
                },
              }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* 로고/아이콘 영역 */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                      project.logo ? "bg-transparent" : project.color
                    } ${!project.logo && "ring-1 ring-inset ring-black/5"}`}
                  >
                    {project.logo ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={project.logo}
                          alt={`${project.title} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <project.icon size={24} />
                    )}
                  </div>

                  {/* 텍스트 및 링크 영역 */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">
                        {project.title}
                      </h3>

                      {/* 링크 아이콘 그룹 */}
                      <div className="flex items-center gap-1 ml-1">
                        {/* 1. GitHub Link */}
                        {project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            className="text-slate-400 hover:text-slate-800 transition-colors p-1"
                            title="View Github Repo"
                          >
                            <Github size={16} />
                          </Link>
                        )}

                        {/* 2. Live Link (External) */}
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                            title="Visit Live Site"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4 min-h-[60px]">
                {project.description}
              </p>

              {/* Achievements */}
              <div className="mb-6 flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Achievements
                </h4>
                <ul className="space-y-1.5">
                  {project.achievements.map((item, i) => (
                    <li
                      key={i}
                      className="text-[13px] text-slate-700 flex items-start gap-2 leading-snug"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer: Tech Stack */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-200"
                    >
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
