"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  ExternalLink,
  Globe,
  Github,
  Users,
  ArrowRight,
  Database,
  Server,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import ProjectGallery from "@/components/ui/ProjectGallery";
import { underduckGallery } from "@/content/galleries";

// ── 라이트 톤 — 배경은 주변(사이드프로젝트 섹션, 흰색) 그대로. 핑크는 액센트로만(UNDERDUCK 브랜드) ──
const INK = "#0a2540";
const SLATE = "#425466";
const PINK = "#ec4899";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

// TODO: 실제 배포 도메인으로 교체 (현재 Vercel 배포 도메인 모름 → 임시)
const LIVE_URL = "https://underducfc-dashboard.vercel.app/";
const FE_REPO = "https://github.com/JJleem/underducfc-dashboard";
const BE_REPO = "https://github.com/JJleem/underduck-backend";

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] leading-relaxed break-keep" style={{ color: INK }}>
      <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" color={PINK} />
      {text}
    </li>
  );
}

// 풀스택 3계층 — 컴팩트 인라인 pill (프론트 → 백엔드 → DB + 배포 타깃).
function ArchPill({ icon: Icon, title, sub }: { icon: typeof Server; title: string; sub: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#e6ebf1] bg-white px-2 py-0.5 text-[11px] font-bold" style={{ color: INK }}>
      <Icon size={12} color={PINK} /> {title}
      <span className="font-medium" style={{ color: SLATE }}>· {sub}</span>
    </span>
  );
}

const TECH = [
  { label: "Frontend", items: ["Next.js 16", "TypeScript", "Tailwind v4", "Radix / shadcn", "Zustand", "react-dnd", "Framer Motion", "next-auth", "web-push"] },
  { label: "Backend", items: ["FastAPI", "Python", "SQLAlchemy", "PostgreSQL", "Alembic", "pytest"] },
  { label: "Infra / Ops", items: ["AWS Lightsail", "systemd", "nginx", "certbot TLS", "GitHub Actions", "Vercel", "Cloudinary"] },
];

// 사이드프로젝트 섹션 헤더 ↔ 슬라이더 사이에 들어가는 "대표 프로젝트" 블록.
// 자체 <section>/배경 없이 주변 톤을 그대로 따른다.
const ProjectDetail_Underduck = () => {
  return (
    <div id="underduck" className="relative z-10 mx-auto mb-16 max-w-[1140px] scroll-mt-16 px-6 font-sans">
      {/* 헤더 텍스트 ↔ 폰 갤러리를 처음부터 좌우로 나란히 → 세로 길이 축소 */}
      <div className="border-t border-[#e6ebf1] pt-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
          {/* Left: 헤더 + 핵심 성과 + 오너십 + CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: PINK }} />
              Featured · Live Product
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl" style={{ color: INK }}>
              동아리 운영을 통째로 옮긴 풀스택 PWA
            </h3>
            <p className="mt-2.5 text-[15px] font-light leading-snug" style={{ color: INK }}>
              조기축구 동아리 운영 대시보드 — <span style={{ color: PINK }}>UNDERDUCK FC</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed break-keep" style={{ color: SLATE }}>
              매주 카톡에 흩어지던 일정·라인업·기록·투표를 한 곳으로 모은 서비스. 구글 시트로 빠르게 MVP를 검증한 뒤,
              동시성·관계형 데이터의 한계를 만나 <span className="font-semibold" style={{ color: INK }}>FastAPI + PostgreSQL 백엔드로 직접 이전</span>했습니다.
              프론트(PWA)부터 백엔드·AWS 배포·CI까지 1인 풀스택으로 만들었고, 실제 동아리원이 매주 사용합니다.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-3 py-1 text-xs font-medium" style={{ color: SLATE }}>
                <Calendar size={12} /> 2026.02 - 운영 중
              </span>
              <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: "rgba(236,72,153,0.3)", background: "rgba(236,72,153,0.08)", color: "#be185d" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: PINK }} /> 실사용 · 매주 가동
              </span>
            </div>

            <ul className="mt-7 space-y-3">
              <CheckItem text="구글 시트로 MVP 검증 → FastAPI + PostgreSQL로 백엔드 직접 이전 (동시성·관계형 데이터 한계 해소)" />
              <CheckItem text="PWA — 홈화면 설치 + 웹푸시(VAPID)로 앱 설치 없이 앱 경험 (iOS 16.4+ / Android)" />
              <CheckItem text="출전·골·MOM 누적으로 칭호(타이틀)를 자동 부여하는 게이미피케이션 시스템 + 칭호 도감" />
              <CheckItem text="7가지 포메이션 DnD 라인업 에디터 → 인스타 스토리 포맷으로 바로 공유" />
              <CheckItem text="투표 시스템 — 상대·날씨·경기장·일정 + 참석/미정/불참 + 댓글, 주 1회 자동 생성·리마인더 cron" />
              <CheckItem text="X-Secret 헤더(상수시간 비교) + 서버사이드 프록시로 백엔드 보호" />
            </ul>

            {/* 오너십 카드 */}
            <div className={`mt-6 rounded-2xl p-5 ${CARD} flex flex-col gap-3`}>
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: SLATE }} />
                <span className="text-xs font-bold" style={{ color: INK }}>1인 풀스택 <span style={{ color: PINK }}>(Me)</span></span>
              </div>
              <p className="text-[12px]" style={{ color: SLATE }}>기획(100%) + 디자인(100%) + 프론트엔드(100%) + 백엔드(100%) + 인프라/배포(100%)</p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={LIVE_URL} target="_blank" className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_-4px_rgba(236,72,153,0.5)] transition-transform hover:-translate-y-0.5" style={{ background: PINK }}>
                <Globe size={15} /> Live Service
                <ExternalLink size={12} className="opacity-70" />
              </Link>
              <Link href={FE_REPO} target="_blank" className="group flex items-center gap-2 rounded-full border border-[#e6ebf1] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#f6f9fc]" style={{ color: INK }}>
                <Github size={15} /> Frontend
              </Link>
              <Link href={BE_REPO} target="_blank" className="group flex items-center gap-2 rounded-full border border-[#e6ebf1] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#f6f9fc]" style={{ color: INK }}>
                <Github size={15} /> Backend
              </Link>
            </div>

            {/* 아키텍처 + 스택 — CTA 바로 아래, 작게 */}
            <div className="mt-7 border-t border-[#e6ebf1] pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: SLATE }}>Architecture</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <ArchPill icon={Smartphone} title="Next.js PWA" sub="Vercel" />
                <ArrowRight size={12} className="shrink-0" style={{ color: PINK }} />
                <ArchPill icon={Server} title="FastAPI" sub="AWS Lightsail" />
                <ArrowRight size={12} className="shrink-0" style={{ color: PINK }} />
                <ArchPill icon={Database} title="PostgreSQL" sub="GitHub Actions CI" />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: SLATE }}>Tech Stack</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH.flatMap((g) => g.items).map((t) => (
                  <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-2 py-0.5 text-[10px] font-semibold" style={{ color: INK }}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: 폰 갤러리 — 헤더 옆 상단 정렬 + 스크롤 따라오게 sticky */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }} className="mx-auto w-full max-w-[300px] lg:sticky lg:top-24">
            <ProjectGallery gallery={underduckGallery} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail_Underduck;
