"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  CloudLightning,
  LayoutTemplate,
  TerminalSquare,
  BarChart3,
  Dna,
  ExternalLink,
  Github,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GridGuides from "@/components/ui/GridGuides";
import { sideProjects } from "@/content/side-projects";
import { localize } from "@/content/locale";
import type { SideProject } from "@/content/types";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#0d9488";

const ICONS: Record<string, LucideIcon> = {
  CloudLightning,
  LayoutTemplate,
  TerminalSquare,
  BarChart3,
  Dna,
};

// 프로젝트 color 클래스(bg-xxx-500/15 text-xxx-400)에서 강조 색을 뽑아 목업 액센트로 사용.
const ACCENTS: Record<string, string> = {
  "claude-console": "#f97316",
  centiment: "#8b5cf6",
  "naver-ads": "#14b8a6",
  mockitup: "#6366f1",
  "gecko-hub": "#22c55e",
};

type Project = SideProject;

// Stripe식 상단 프리뷰 프레임 — 스크린샷이 있으면 contain, 없으면 색상 기반 faux UI 패널.
const ProjectPreview = ({ project, Icon }: { project: Project; Icon: LucideIcon }) => {
  const accent = ACCENTS[project.id] ?? BLURPLE;

  return (
    <div
      className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden border-b border-[#e6ebf1] transition-[height] duration-300 ease-out [@media(hover:hover)]:h-48 [@media(hover:hover)]:group-hover:h-36"
      style={{ background: "linear-gradient(160deg, #f6f9fc 0%, #eef3f8 100%)" }}
    >
      {/* 미세한 그리드 도트 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(#d4deea 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* 히어로 띠 색상(0d9488→0891b2→0ea5e9→10b981) 사선 스윕 — 전부 덮지 않고 사악 흐른다.
          평소엔 숨겨두고 hover 시에만 나타난다. 터치 기기(hover 불가)에선 항상 표시. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(115deg, rgba(13,148,136,0.85) 0%, rgba(8,145,178,0.62) 28%, rgba(14,165,233,0.40) 50%, rgba(16,185,129,0.20) 70%, transparent 88%)",
        }}
      />
      {/* 좌하단 컬러 글로우 한 점 */}
      <div
        className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full opacity-100 blur-2xl transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(13,148,136,0.7) 0%, transparent 70%)" }}
      />

      {project.logo ? (
        <div className="relative h-[80%] w-[80%]">
          <Image src={project.logo} alt={`${project.title} preview`} fill className="object-contain drop-shadow-[0_12px_30px_rgba(10,37,64,0.18)]" />
        </div>
      ) : (
        // faux UI 패널 — 흰 카드가 떠 있는 느낌
        <div className="relative w-[72%] rounded-xl bg-white p-4 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.28)] ring-1 ring-black/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${accent}1a`, color: accent }}>
              <Icon size={18} />
            </div>
            <div className="flex-1">
              <div className="h-2 w-1/2 rounded-full" style={{ background: accent, opacity: 0.85 }} />
              <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-[#e6ebf1]" />
            </div>
          </div>
          <div className="mt-3.5 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-[#eef2f7]" />
            <div className="h-1.5 w-[88%] rounded-full bg-[#eef2f7]" />
          </div>
          <div className="mt-3.5 flex gap-1.5">
            <div className="h-5 w-14 rounded-md" style={{ background: `${accent}26` }} />
            <div className="h-5 w-10 rounded-md bg-[#eef2f7]" />
          </div>
        </div>
      )}
    </div>
  );
};

const SideProjects = () => {
  const projects = localize(sideProjects);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // 카드 1장(폭 + gap) 단위로 이동
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="side" className="relative z-20 scroll-mt-16 overflow-hidden bg-white py-24" style={{ color: INK }}>
      <GridGuides columns={4} />
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#10b981" }} />
              <span className="text-gradient">More Work</span>
            </span>
            <h2 className="text-gradient mt-3 pb-1 text-4xl font-bold tracking-tight md:text-5xl">사이드 프로젝트</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed break-keep md:text-base" style={{ color: SLATE }}>
              업무 밖에서 직접 만들고 운영하며 검증한 작업들입니다.
            </p>
          </div>

          {/* 슬라이드 네비게이션 */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="이전"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ebf1] bg-white text-[#0a2540] transition-all hover:border-[#0d9488] hover:text-[#0d9488] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e6ebf1] disabled:hover:text-[#0a2540]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="다음"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ebf1] bg-white text-[#0a2540] transition-all hover:border-[#0d9488] hover:text-[#0d9488] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e6ebf1] disabled:hover:text-[#0a2540]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 가로 슬라이드 트랙 — 풀폭으로 풀고, 첫 카드만 컨테이너 왼쪽 끝에 정렬.
          스크롤하면 카드가 화면 양쪽 끝으로 자연스럽게 흘러나간다. */}
      <motion.div
        className="relative z-10"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } },
        }}
      >
        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-14 pt-2 pl-[max(1.5rem,calc((100vw-1140px)/2+1.5rem))] pr-[max(1.5rem,calc((100vw-1140px)/2+1.5rem))] scroll-pl-[max(1.5rem,calc((100vw-1140px)/2+1.5rem))]"
        >
          {projects.map((project, index) => {
            const Icon = ICONS[project.iconName] ?? TerminalSquare;
            return (
              <motion.article
                key={project.id}
                data-card
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.5 } },
                }}
                className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)] sm:w-[340px]"
              >
                {/* 상단 프리뷰 프레임 (Stripe식) */}
                <ProjectPreview project={project} Icon={Icon} />

                {/* 본문 */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: SLATE }}>
                    {project.category}
                  </span>
                  <h3 className="mt-1.5 text-lg font-bold leading-tight tracking-tight" style={{ color: INK }}>
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed break-keep" style={{ color: SLATE }}>
                    {project.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-2.5 py-1 text-[11px] font-semibold" style={{ color: INK }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* GitHub / Live demo — 평소엔 접혀 있다가 hover 시 자연스럽게 올라온다.
                        터치 기기(hover 불가)에선 항상 펼쳐둔다(모바일 최적화). */}
                    {(project.github || project.link) && (
                      <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr]">
                        <div className="min-h-0 overflow-hidden">
                          <div className="mt-3.5 flex translate-y-0 items-center gap-4 border-t border-[#e6ebf1] pt-3.5 opacity-100 transition-[opacity,transform] duration-300 ease-out [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                            {project.github && (
                              <Link
                                href={project.github}
                                target="_blank"
                                className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-[#0d9488]"
                                style={{ color: BLURPLE }}
                              >
                                <Github size={15} />
                                GitHub
                                <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                              </Link>
                            )}
                            {project.link && (
                              <Link
                                href={project.link}
                                target="_blank"
                                className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-[#0d9488]"
                                style={{ color: BLURPLE }}
                              >
                                <ExternalLink size={15} />
                                Live demo
                                <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default SideProjects;
