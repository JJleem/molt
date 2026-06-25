"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Activity,
  Check,
  ExternalLink,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProjectGallery from "@/components/ui/ProjectGallery";
import { cHubGallery, cHubMobileGallery } from "@/content/galleries";
import SlantBg from "@/components/sections/SlantBg";
import GridGuides from "@/components/ui/GridGuides";

// ── 흰 카드 내부 — 다른 섹션과 동일한 라이트 톤 ──
const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#0d9488";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

// ── 다크 배경 위 텍스트 ──
const BG = "#0a2540";
const ONDARK = "#eef3f9";
const ONDARK_SUB = "#9fb1c7";
const TEAL_HI = "#2dd4bf";

/* 다크 배경 위 체크 항목 (CosmicHustle CheckItem과 동일 패턴) */
function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] leading-relaxed break-keep" style={{ color: ONDARK }}>
      <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" color={TEAL_HI} />
      {text}
    </li>
  );
}

/* Challenge 항목 (CosmicHustle CapabilityItem과 동일 패턴) — 다크 배경 위, 여백으로 구분 */
function ChallengeItem({ index, title, context, solution, outcome }: { index: number; title: string; context: string; solution: string[]; outcome?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index - 1) * 0.05 }}
      className="pt-5"
    >
      <span className="text-sm font-bold tabular-nums" style={{ color: TEAL_HI }}>[{index}]</span>
      <h4 className="mt-2 text-[15px] font-bold tracking-tight" style={{ color: ONDARK }}>{title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed break-keep" style={{ color: ONDARK_SUB }}>
        <span className="font-semibold" style={{ color: ONDARK }}>문제 — </span>{context}
      </p>
      <ul className="mt-3 space-y-1.5">
        {solution.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed break-keep" style={{ color: ONDARK }}>
            <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0" color={TEAL_HI} />
            {item}
          </li>
        ))}
      </ul>
      {outcome && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
          <Activity size={14} /> {outcome}
        </p>
      )}
    </motion.div>
  );
}

const CHALLENGES = [
  {
    title: "하드웨어와 웹의 상태 불일치",
    context: "수십 대의 장비가 비동기로 보내는 센서 데이터(온도·수위 등)로 UI 깜빡임과 데이터 역전이 발생.",
    solution: ["서버 데이터와 로컬 제어 상태(Recoil)를 분리한 이원화 상태 관리", "Recoil Atom Family로 장비 ID별 스코프 격리 → 리렌더 최소화"],
    outcome: "상태 업데이트 지연 3s → 0.8s 단축",
  },
  {
    title: "불안정한 네트워크와 명령 유실",
    context: "공장 Wi-Fi 불안정으로 제어 명령(시작/중지)이 서버에 도달하지 못하는 경우가 빈번.",
    solution: ["자체 WebSocket 엔진: 끊김 감지 시 명령을 메모리 큐에 적재", "재연결 즉시 큐 Flush·순차 전송 보장", "낙관적 업데이트로 즉각 피드백 후 백그라운드 동기화"],
  },
  {
    title: "고빈도 데이터로 인한 메인 스레드 부하",
    context: "초당 수백 건의 WebSocket 메시지를 실시간 DOM 반영하다 브라우저 프리징 발생.",
    solution: ["100ms 단위 Throttling 버퍼로 업데이트 빈도 제어", "requestAnimationFrame 동기화로 주사율에 맞춘 배치 렌더링"],
  },
  {
    title: "메모리 누수 방지 및 모바일 최적화",
    context: "장시간 모니터링 시 메모리 증가, 모바일에서 데이터 로딩 지연.",
    solution: ["언마운트 시 WebSocket 리스너·WebRTC 스트림 즉시 해제(엄격 Cleanup)", "모바일 감지 시 초기 페칭량 축소·레이아웃 단순화"],
  },
];

const ProjectDetail_CaseStudy = () => {
  return (
    <section id="work" className="relative z-20 scroll-mt-16 overflow-hidden py-28 font-sans" style={{ color: ONDARK }}>
      <SlantBg color={BG} top bottom />
      {/* 오른쪽 상단 모서리 — 히어로 띠 색의 소프트 코너 글로우(고급 무드).
          SlantBg(size 72)와 동일한 사선으로 클립 → 경사선 위로 새어나가지 않음. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        style={{ clipPath: "polygon(0 72px, 100% 0, 100% calc(100% - 72px), 0 100%)" }}
      >
        <div
          className="absolute -right-40 -top-[52px] h-[520px] w-[520px] rounded-full opacity-60 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(45,212,191,0.55) 0%, rgba(13,148,136,0.28) 42%, transparent 72%)" }}
        />
      </div>

      <GridGuides columns={4} tone="dark" />
      <div className="relative z-10 max-w-[1140px] mx-auto px-6">
        {/* ── 섹션 헤더 (CosmicHustle 헤더 구조) ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: TEAL_HI }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL_HI }} />
            Work Experience
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: ONDARK }}>실무 경험</h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-snug lg:max-w-[50%]" style={{ color: ONDARK }}>
            산업용 3D 프린터 통합 관제 솔루션 — <span style={{ color: TEAL_HI }}>C-HUB V2.0</span>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed break-keep lg:max-w-[50%]" style={{ color: ONDARK_SUB }}>
            분산된 이기종 장비의 통합 관제를 위해 기획·디자인·개발 전 과정을 리딩한 프로젝트. 실시간 제어 환경을
            구현하고 UI/UX 전체 영문화로 글로벌 시장에 최적화, 현재 베트남 등 글로벌 산업 현장에 도입되어 가동 중입니다.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium" style={{ color: ONDARK_SUB }}>
              <Calendar size={12} /> 2025.01 - 2026.01
            </span>
          </div>
        </motion.div>

        {/* ── 제품 블록 — 2-col [5fr_7fr] (CosmicHustle AI 블로그 구조) ── */}
        <div className="mt-16 pt-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ONDARK }}>C-HUB V2.0</h3>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">글로벌 도입 · 가동 중</span>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">GS인증 1등급</span>
          </div>

          {/* 상단 2단 — 좌: 로고+팀카드+CTA / 우: 핵심 성과 (골프 블록과 동일 구조) */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left: 로고 + 팀 카드 + CTA */}
            <div className="flex flex-col">
              <div className="w-fit rounded-lg bg-white px-3 py-1.5">
                <Image src="/assets/carima.png" alt="carima logo" width={100} height={30} />
              </div>

              {/* 팀/오너십 카드 — 흰 카드 */}
              <div className={`mt-6 rounded-2xl p-5 ${CARD} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <Users size={14} style={{ color: SLATE }} />
                  <span className="text-xs font-bold" style={{ color: INK }}>Backend 1 + Frontend 1 <span style={{ color: BLURPLE }}>(Me)</span></span>
                </div>
                <p className="text-[12px]" style={{ color: SLATE }}>기획(50%) + 디자인(100%) + 퍼블리싱(100%) + 프론트엔드(100%)</p>
                <div className="flex items-center gap-2 pt-1 border-t border-[#e6ebf1]">
                  <Image src="/assets/gs.png" alt="GS인증로고" width={36} height={45} />
                  <span className="text-xs font-bold text-amber-700">GS인증 1등급 취득</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="https://c-hub.info/" target="_blank" className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-[0_6px_18px_-4px_rgba(13,148,136,0.5)] transition-transform hover:-translate-y-0.5" style={{ background: BLURPLE }}>
                  <Globe size={15} /> Live Service
                  <ExternalLink size={12} className="opacity-70" />
                </Link>
                <Link href="https://hissing-seagull-77f.notion.site/IoT-3D-2e1cb3f80a7780c5ac84c4ac75fe9ab6?pvs=143" target="_blank" className="group flex items-center gap-2 px-5 py-2.5 border border-white/15 rounded-full text-sm font-bold transition-colors hover:bg-white/[0.06]" style={{ color: ONDARK }}>
                  <div className="relative w-3.5 h-3.5">
                    <Image src="/assets/notion.png" alt="Notion" fill className="object-contain" />
                  </div>
                  Notion Tech Spec
                  <ExternalLink size={12} className="opacity-40" />
                </Link>
              </div>
            </div>

            {/* Right: 핵심 성과 */}
            <div className="flex flex-col">
              <ul className="space-y-3">
                <CheckItem text="기획·디자인·개발 전 과정 리딩 — 1인 프론트엔드, GS인증 1등급 취득" />
                <CheckItem text="이기종 장비 통합 관제 — 웹소켓 기반 실시간 상태 동기화" />
                <CheckItem text="상태 동기화 지연 1초 미만(3s → 0.8s)으로 최적화" />
                <CheckItem text="UI/UX 영문화 100% — 베트남 등 글로벌 산업현장 도입·가동" />
              </ul>
            </div>
          </div>

          {/* 풀폭 슬라이더 — 다른 섹션과 동일하게 크게 */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }} className="mt-10">
            <ProjectGallery gallery={cHubGallery} tone="dark" />
          </motion.div>
        </div>

        {/* ── Challenge & Solution — 항목식 2-col (CapabilityItem 구조) ── */}
        <div className="mt-16 pt-12">
          <div className="mb-8 flex gap-3">
            <span className="mt-1 w-[3px] flex-shrink-0 rounded-full" style={{ background: TEAL_HI }} />
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: ONDARK }}>Challenge &amp; Solution</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed break-keep" style={{ color: ONDARK_SUB }}>
                실시간·고빈도·불안정 네트워크 환경에서 마주친 핵심 엔지니어링 문제와 해결 과정.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
            {CHALLENGES.map((c, i) => (
              <ChallengeItem key={c.title} index={i + 1} {...c} />
            ))}
          </div>
        </div>

        {/* ── 모바일 앱 확장 — stripe식 피처 행 (text | 폰 갤러리) ── */}
        <div className="mt-16 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: TEAL_HI }}>Native Mobile App</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 개발 완료
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight md:text-3xl" style={{ color: ONDARK }}>네이티브 모바일 앱</h3>
              <p className="mt-4 text-[15px] leading-relaxed break-keep" style={{ color: ONDARK_SUB }}>
                산업용 관제 시스템을 <span className="font-semibold" style={{ color: ONDARK }}>React Native로 새로 개발</span>했습니다. 기존 웹과
                <span className="font-semibold" style={{ color: ONDARK }}> 동일한 API</span>를 그대로 사용해, 현장에서 폰으로도 똑같이 관제할 수 있습니다.
              </p>
              <ul className="mt-5 space-y-3">
                <CheckItem text="현장에서 폰으로 장비를 실시간 제어·모니터링" />
                <CheckItem text="푸시 알림 등 모바일 네이티브 경험에 맞춰 재설계" />
                <CheckItem text="기존 웹과 동일한 API — 백엔드 변경 없이 네이티브로 신규 구현" />
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Expo", "React Native", "expo-router", "NativeWind", "TanStack Query", "Zustand", "react-hook-form", "Reanimated", "react-native-svg", "expo-notifications", "i18next"].map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold" style={{ color: ONDARK_SUB }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[280px]">
              <ProjectGallery gallery={cHubMobileGallery} tone="dark" />
            </div>
          </motion.div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="mt-14 pt-8">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: ONDARK_SUB }}>Tech Stack (Web)</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "SCSS", "Recoil", "TanStack Query", "Recharts", "Framer Motion", "react-hook-form", "lottie-react", "Axios", "JSZip", "Crypto-js", "WebSocket", "@dnd-kit", "WebRTC"].map((tech) => (
              <span key={tech} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold" style={{ color: ONDARK_SUB }}>{tech}</span>
            ))}
          </div>
        </div>

        {/* ── 이전 실무 — (주)미디어그룹 사람과숲 · 골프 지오펜싱 앱 (압축 블록) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-20 pt-12"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#67e8f9" }}>Previously</span>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ONDARK }}>골프장 지오펜싱 자동 체크인 앱</h3>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300">POC</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left: 로고 + 메타 + 설명 + 팀 */}
            <div className="flex flex-col">
              <div className="w-fit rounded-lg bg-white px-3 py-1.5">
                <Image src="/assets/hf.png" alt="사람과숲 logo" width={100} height={30} />
              </div>
              <p className="mt-4 text-sm" style={{ color: ONDARK_SUB }}>
                <span className="font-bold" style={{ color: ONDARK }}>(주)미디어그룹 사람과숲</span> · 프론트엔드 개발자
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium" style={{ color: ONDARK_SUB }}>
                  <Calendar size={12} /> 2024.09 - 2025.01
                </span>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed break-keep" style={{ color: ONDARK_SUB }}>
                골프장 내장객 위치를 실시간 추적해 <span className="font-semibold" style={{ color: ONDARK }}>지오펜싱 기반 자동 체크인/아웃</span>을
                처리하는 모바일 앱 POC. JS 환경의 한계를 넘어 정밀한 위치 추적을 위해 Android 네이티브 모듈을 직접 연동했습니다.
              </p>

              {/* 팀/오너십 카드 */}
              <div className={`mt-6 rounded-2xl p-5 ${CARD} flex flex-col gap-2`}>
                <div className="flex items-center gap-2">
                  <Users size={14} style={{ color: SLATE }} />
                  <span className="text-xs font-bold" style={{ color: INK }}>Backend 2 + Frontend 1 <span style={{ color: BLURPLE }}>(Me)</span></span>
                </div>
                <p className="text-[12px]" style={{ color: SLATE }}>디자인(100%) + 퍼블리싱(100%) + 프론트엔드(100%)</p>
              </div>
            </div>

            {/* Right: 핵심 성과 + 기술 */}
            <div className="flex flex-col">
              <ul className="space-y-3">
                <CheckItem text="Android 네이티브 모듈 직접 구현 + NativeEventEmitter 양방향 브리지로 위·경도·속도 실시간 파싱" />
                <CheckItem text="지오펜싱 트리거 반응 속도 최적화 → JS 스레드 부하 최소화" />
                <CheckItem text="GPS·세션·예약 도메인을 Recoil Atom으로 분리, Selector로 고빈도 위치 데이터의 렌더링 주기 제어" />
                <CheckItem text="Long-press + Haptic 예약 삭제, One-Step 예약 확정 흐름으로 오작동 방지·이탈률 감소" />
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {["React Native", "TypeScript", "Recoil", "Android Native Module", "Native Bridge", "Styled-Components"].map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold" style={{ color: ONDARK_SUB }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDetail_CaseStudy;
