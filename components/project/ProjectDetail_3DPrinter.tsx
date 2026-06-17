"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Calendar,
  Users,
  Activity,
  Zap,
  CheckCircle2,
  Database,
  Lock,
  ExternalLink,
  Globe,
  Smartphone,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProjectGallery from "@/components/ui/ProjectGallery";
import { cHubGallery } from "@/content/galleries";
import SlantBg from "@/components/sections/SlantBg";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#635bff";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

interface LiveMetricProps {
  label: string;
  value: string;
  delay: number;
  icon: LucideIcon;
}

interface ProblemSolutionProps {
  title: string;
  context?: string;
  solution: string[];
  outcome?: string;
}

const TerminalBlock = () => {
  const logs = [
    { time: "14:20:01", type: "INFO", msg: "WebSocket Connection Established" },
    { time: "14:20:02", type: "SYNC", msg: "Real Time Syncing..." },
    { time: "14:20:03", type: "DATA", msg: "Sensor: Temp:36°C   /   Z-Position:50" },
  ];
  return (
    <div className="w-full rounded-xl border border-[#e6ebf1] bg-[#1e1e1e] shadow-sm overflow-hidden font-mono text-[10px]">
      <div className="flex items-center px-3 py-1.5 bg-[#252526] border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
          <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
          <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
        </div>
        <span className="ml-2 text-gray-500">3D_PRINTER_console</span>
      </div>
      <div className="p-3 space-y-1.5">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="flex gap-2">
            <span className="text-gray-500">[{log.time}]</span>
            <span className={log.type === "INFO" ? "text-blue-400" : log.type === "SYNC" ? "text-yellow-400" : "text-emerald-400"}>{log.type}</span>
            <span className="text-gray-300">{log.msg}</span>
          </motion.div>
        ))}
        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-3 bg-gray-400 inline-block align-middle ml-1" />
      </div>
    </div>
  );
};

const LiveMetric = ({ label, value, icon: Icon, delay }: LiveMetricProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`p-3 rounded-2xl flex items-center gap-3 ${CARD}`}
  >
    <div className="p-2 bg-[#f6f9fc] rounded-xl border border-[#e6ebf1]" style={{ color: INK }}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: SLATE }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: INK }}>{value}</p>
    </div>
  </motion.div>
);

const Section = ({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();
  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);
  return (
    <motion.div
      ref={ref}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } } }}
      initial="hidden"
      animate={controls}
      className="mb-14 relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e6ebf1] rounded-full opacity-0 md:opacity-100" />
      <div className="pl-0 md:pl-6">
        <h3 className="text-xl md:text-2xl font-bold mb-6 tracking-tight" style={{ color: INK }}>{title}</h3>
        <div className="space-y-6">{children}</div>
      </div>
    </motion.div>
  );
};

const ProblemSolution = ({ title, context, solution, outcome }: ProblemSolutionProps) => (
  <div className={`p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 ${CARD}`}>
    <h4 className="text-md md:text-lg font-bold mb-3 flex items-center gap-2" style={{ color: INK }}>
      <div className="w-2 h-2 rounded-full" style={{ background: BLURPLE }} />
      {title}
    </h4>
    <div className="space-y-4">
      {context && (
        <div className="bg-[#f6f9fc] p-3 rounded-xl text-xs leading-relaxed border border-[#e6ebf1] md:text-sm break-keep" style={{ color: SLATE }}>
          <strong className="block mb-1 text-xs uppercase tracking-wider" style={{ color: INK }}>Problem</strong>
          {context}
        </div>
      )}
      <div>
        <strong className="text-xs uppercase tracking-wider block mb-2 font-bold ml-1" style={{ color: SLATE }}>Solution</strong>
        <ul className="space-y-2">
          {solution.map((item, i) => (
            <li key={i} className="md:text-sm text-xs leading-relaxed flex items-start gap-2 pl-1 break-keep" style={{ color: INK }}>
              <CheckCircle2 size={14} className="mt-1 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      {outcome && (
        <div className="pt-3 mt-2 border-t border-[#e6ebf1] flex items-center gap-2">
          <Activity size={14} className="text-emerald-500" />
          <p className="text-emerald-600 text-sm font-bold">{outcome}</p>
        </div>
      )}
    </div>
  </div>
);

const ProjectDetail_CaseStudy = () => {
  return (
    <section id="work" className="relative z-20 scroll-mt-16 py-28 font-sans" style={{ color: INK }}>
      <SlantBg color="#f6f9fc" top bottom />

      <div className="relative z-10 max-w-[1140px] mx-auto px-6">
        {/* ── 섹션 헤더 ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: BLURPLE }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLURPLE }} />
            Work Experience
          </span>
          <h2 className="text-gradient mt-3 mb-6 text-4xl md:text-5xl font-bold tracking-tight">실무 경험</h2>
          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1 border border-[#e6ebf1] bg-white rounded-full text-xs font-medium flex items-center gap-1.5" style={{ color: SLATE }}>
              <Calendar size={12} /> 2025.01 - 2026.01
            </span>
          </div>
        </motion.div>

        {/* ── C-HUB 2-col 히어로 ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: 제품 설명 */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }} className="flex flex-col gap-5">
            <div className="w-fit rounded-lg bg-white px-3 py-1.5 border border-[#e6ebf1]">
              <Image src="/assets/carima.png" alt="carima logo" width={100} height={30} />
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: INK }}>
                C-HUB <span style={{ color: BLURPLE }}>V2.0</span>
              </h3>
              <p className="mt-1.5 text-lg" style={{ color: SLATE }}>산업용 3D 프린터 통합 관제 솔루션</p>
            </div>

            <p className="text-[15px] leading-relaxed break-keep" style={{ color: SLATE }}>
              분산된 이기종 장비의 통합 관제를 위해{" "}
              <strong className="font-bold" style={{ color: INK }}>기획·디자인·개발 전 과정을 리딩</strong>
              한 프로젝트입니다. 상태 동기화 지연율을{" "}
              <strong className="text-emerald-600">1초 미만</strong>
              으로 최적화하여 물리적 거리에 상관없는 실시간 제어 환경을 구현했습니다. UI/UX 전체{" "}
              <strong style={{ color: INK }}>영문화(100%)</strong>를 통해 글로벌 시장에 최적화하였고, 현재{" "}
              <strong style={{ color: INK }}>베트남을 비롯한 글로벌 산업 현장</strong>에 도입되어 가동 중입니다.
            </p>

            {/* Team + GS */}
            <div className={`rounded-2xl p-5 ${CARD} flex flex-col gap-3`}>
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: SLATE }} />
                <span className="text-xs font-bold" style={{ color: INK }}>Backend 1 + Frontend 1 <span style={{ color: BLURPLE }}>(Me)</span></span>
              </div>
              <p className="text-[11px]" style={{ color: SLATE }}>기획(50%) + 디자인(100%) + 퍼블리싱(100%) + 프론트엔드(100%)</p>
              <div className="flex items-center gap-2 pt-1 border-t border-[#e6ebf1]">
                <Image src="/assets/gs.png" alt="GS인증로고" width={36} height={45} />
                <span className="text-xs font-bold text-amber-700">GS인증 1등급 취득</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <Link href="https://c-hub.info/" target="_blank" className="group flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold text-white shadow-[0_6px_18px_-4px_rgba(99,91,255,0.5)] transition-transform hover:-translate-y-0.5" style={{ background: BLURPLE }}>
                <Globe size={14} /> Live Service
                <ExternalLink size={11} className="opacity-70" />
              </Link>
              <Link href="https://hissing-seagull-77f.notion.site/IoT-3D-2e1cb3f80a7780c5ac84c4ac75fe9ab6?pvs=143" target="_blank" className="group flex items-center gap-2 px-4 py-2 border border-[#e6ebf1] rounded-full text-[13px] font-bold transition-colors hover:bg-[#f6f9fc]" style={{ color: INK }}>
                <div className="relative w-3.5 h-3.5">
                  <Image src="/assets/notion.png" alt="Notion" fill className="object-contain" />
                </div>
                Notion Tech Spec
                <ExternalLink size={11} className="opacity-40" />
              </Link>
            </div>

            {/* 메트릭 */}
            <div className="flex flex-col gap-3 pt-2">
              <LiveMetric icon={Zap} label="Latency" value="< 85ms" delay={0.2} />
              <LiveMetric icon={Database} label="Data Integrity" value="99.9%" delay={0.3} />
              <LiveMetric icon={Lock} label="Security" value="Level 4" delay={0.4} />
            </div>
          </motion.div>

          {/* Right: gallery + terminal */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }} className="flex flex-col gap-5">
            <ProjectGallery gallery={cHubGallery} />
            <TerminalBlock />
          </motion.div>
        </div>

        {/* ── Challenge & Solution (full-width) ── */}
        <div className="mt-16 border-t border-[#e6ebf1] pt-14">
          <Section title="Challenge & Solution" delay={0.2}>
            <ProblemSolution
              title="하드웨어와 웹의 상태 불일치"
              context="수십 대의 장비가 동시에 보내는 센서 데이터(온도, 수위 등)가 비동기적으로 도착하여, UI 깜빡임과 데이터 역전 현상이 발생했습니다."
              solution={["서버 데이터와 로컬 제어 상태(Recoil)를 분리하는 이원화된 상태 관리 전략 도입", "Recoil Atom Family 패턴으로 장비 ID별 상태 스코프 격리, 리렌더링 범위 최소화"]}
              outcome="상태 업데이트 지연 3s → 0.8s 단축 및 UI 렌더링 최적화"
            />
            <ProblemSolution
              title="불안정한 네트워크와 명령 유실"
              context="공장 Wi-Fi 연결이 불안정하여 제어 명령(시작/중지)이 서버에 도달하지 못하는 경우가 빈번했습니다."
              solution={["자체 WebSocket 엔진 구현: 연결 끊김 감지 시 명령을 메모리 큐에 적재", "재연결 성공 즉시 큐 Flush 및 순차 전송 보장", "낙관적 업데이트로 사용자에게 즉각 피드백 제공 후 백그라운드 동기화"]}
            />
          </Section>

          <Section title="Performance & Optimization" delay={0.1}>
            <ProblemSolution
              title="고빈도 데이터로 인한 메인 스레드 부하"
              context="초당 수백 건의 WebSocket 메시지를 실시간으로 DOM에 반영하다 보니 브라우저 프리징 발생"
              solution={["100ms 단위 Throttling 버퍼 도입하여 데이터 업데이트 빈도 제어", "requestAnimationFrame과 동기화하여 모니터 주사율에 맞춰 배치렌더링"]}
            />
            <ProblemSolution
              title="메모리 누수 방지 및 모바일 최적화"
              context="장시간 모니터링 시 메모리 사용량이 증가하고, 모바일에서 데이터 로딩이 느린 문제"
              solution={["엄격한 Cleanup 정책: 언마운트 시 WebSocket 리스너 및 WebRTC 스트림 즉시 해제", "모바일 환경 감지 시 초기 데이터 페칭 양 축소 및 UI 레이아웃 단순화"]}
            />
          </Section>
        </div>

        {/* 모바일 앱 확장 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-6 md:p-8 ${CARD}`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-[#f6f9fc] border border-[#e6ebf1] p-2.5" style={{ color: INK }}>
              <Smartphone size={20} />
            </div>
            <h3 className="text-lg font-bold md:text-xl tracking-tight" style={{ color: INK }}>모바일 앱으로 확장 중</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> In Development · 미배포
            </span>
          </div>
          <p className="mb-4 text-sm leading-relaxed break-keep" style={{ color: SLATE }}>
            웹으로 검증된 산업용 관제 시스템을, 같은 기능을 네이티브 모바일 앱으로 이식하며{" "}
            <strong style={{ color: INK }}>앱화(App-ification)</strong>를 진행 중입니다. 현장에서 폰으로도
            장비를 실시간 제어·모니터링할 수 있도록, 푸시 알림 등 모바일 네이티브 경험에 맞춰 재설계하고 있습니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Expo", "React Native", "expo-router", "NativeWind", "TanStack Query", "React Native Skia", "expo-notifications", "i18next"].map((t) => (
              <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-3 py-1 text-xs font-semibold" style={{ color: INK }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <div className="mt-10 pt-8 border-t border-[#e6ebf1]">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: SLATE }}>Tech Stack (Web)</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "SCSS", "Recoil", "TanStack Query", "Recharts", "Framer Motion", "react-hook-form", "lottie-react", "Axios", "JSZip", "Crypto-js", "WebSocket", "@dnd-kit", "WebRTC"].map((tech) => (
              <span key={tech} className="rounded-full border border-[#e6ebf1] bg-white px-3 py-1 text-xs font-semibold" style={{ color: INK }}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail_CaseStudy;
