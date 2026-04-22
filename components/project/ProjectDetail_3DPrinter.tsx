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
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="w-full bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden font-mono text-[10px] border border-slate-800">
      <div className="flex items-center px-3 py-1.5 bg-[#252526] border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF5F56]"></div>
          <div className="w-2 h-2 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-2 h-2 rounded-full bg-[#27C93F]"></div>
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
    className="bg-resume-card p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3"
  >
    <div className="p-2 bg-resume-badge-bg rounded-lg text-resume-primary">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] text-resume-text-sub uppercase tracking-wider font-bold">{label}</p>
      <p className="text-sm font-bold text-resume-text-main">{value}</p>
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
      className="mb-16 relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-resume-badge-bg rounded-full opacity-0 md:opacity-100"></div>
      <div className="pl-0 md:pl-6">
        <h3 className="text-xl md:text-2xl font-bold text-resume-text-main mb-6">{title}</h3>
        <div className="space-y-6">{children}</div>
      </div>
    </motion.div>
  );
};

const ProblemSolution = ({ title, context, solution, outcome }: ProblemSolutionProps) => (
  <div className="bg-resume-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300">
    <h4 className="text-md md:text-lg font-bold text-resume-text-main mb-3 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-resume-primary"></div>
      {title}
    </h4>
    <div className="space-y-4">
      {context && (
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs text-resume-text-sub leading-relaxed border border-slate-100 dark:border-slate-700 md:text-sm">
          <strong className="text-slate-600 dark:text-slate-300 block mb-1 text-xs uppercase">Problem</strong>
          {context}
        </div>
      )}
      <div>
        <strong className="text-resume-primary text-xs uppercase block mb-2 font-bold ml-1">Solution</strong>
        <ul className="space-y-2">
          {solution.map((item, i) => (
            <li key={i} className="text-resume-text-main md:text-sm text-xs leading-relaxed flex items-start gap-2 pl-1">
              <CheckCircle2 size={14} className="text-resume-primary mt-1 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      {outcome && (
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <Activity size={14} className="text-emerald-500" />
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{outcome}</p>
        </div>
      )}
    </div>
  </div>
);

const ProjectDetail_CaseStudy = () => {
  return (
    <div className="relative z-20 min-h-screen bg-resume-bg text-resume-text-main font-sans transition-colors duration-300">
      <div className="absolute h-full w-full inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none -z-10" />

      <header className="pt-12 pb-12 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-resume-text-main mb-8 tracking-tight border-b border-b-resume-primary pb-2">
              <span className="text-resume-primary">Work Experience.</span>
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-resume-text-sub rounded text-xs font-medium flex items-center gap-1">
                <Calendar size={12} /> 2025.01 - 2026.01
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="flex flex-col gap-4">
                <div className="mt-2 w-fit bg-white rounded-lg px-3 py-1.5">
                <Image src="/assets/carima.png" alt="carima logo" width={100} height={30} />
              </div>
                <h1 className="text-2xl md:text-5xl font-bold text-resume-text-main mb-2 tracking-tight">
                  C-HUB <span className="text-resume-primary">V2.0</span>
                </h1>
                <div className="flex flex-col justify-start items-center gap-2">
                  <p className="text-lg text-resume-text-sub w-full">산업용 3D 프린터 통합 관제 솔루션</p>
                  <div className="w-full flex flex-wrap items-center gap-3 mt-1">
                    <Link href="https://c-hub.info/" target="_blank" className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all">
                      <Globe size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span>Live Service</span>
                      <ExternalLink size={10} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link href="https://hissing-seagull-77f.notion.site/IoT-3D-2e1cb3f80a7780c5ac84c4ac75fe9ab6?pvs=143" target="_blank" className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white hover:shadow-sm transition-all">
                      <div className="relative w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src="/assets/notion.png" alt="Notion" fill className="object-contain" />
                      </div>
                      <span>Notion Tech Spec</span>
                      <ExternalLink size={10} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 hidden md:block">
                <TerminalBlock />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-resume-text-main leading-relaxed text-sm md:text-base mb-6">
                  분산된 이기종 장비의 통합 관제를 위해{" "}
                  <strong className="text-resume-primary bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded mx-1">기획·디자인·개발 전 과정을 리딩</strong>
                  한 프로젝트입니다. 상태 동기화 지연율을{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1 rounded">1초 미만</strong>
                  으로 최적화하여 물리적 거리에 상관없는 실시간 제어 환경을 구현했습니다. UI/UX 전체{" "}
                  <strong className="text-slate-900 dark:text-slate-100">영문화(100%)</strong>를 통해 글로벌 시장에 최적화하였고, 현재{" "}
                  <strong className="text-slate-900 dark:text-slate-100">베트남을 비롯한 글로벌 산업 현장</strong>에 도입되어 가동 중입니다.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex-col sm:w-fit h-full w-full">
                    <span className="flex items-center gap-2">
                      <Users size={14} className="text-resume-text-sub" />
                      <span className="text-xs font-bold text-resume-text-main">
                        Backend 1 + Frontend 1 <span className="text-resume-primary">(Me)</span>
                      </span>
                    </span>
                    <span className="text-resume-text-sub text-[10px]">기획(50%) + 디자인(100%) + 퍼블리싱(100%) + 프론트엔드(100%)</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 sm:w-fit w-full">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-700/30 justify-center sm:w-fit h-full w-full">
                      <Image src="/assets/gs.png" alt="GS인증로고" width={40} height={50} />
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">GS인증 1등급 취득</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center">
                <LiveMetric icon={Zap} label="Latency" value="< 85ms" delay={0.2} />
                <LiveMetric icon={Database} label="Data Integrity" value="99.9%" delay={0.3} />
                <LiveMetric icon={Lock} label="Security" value="Level 4" delay={0.4} />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <Section title="Challenge & Solution" delay={0.2}>
          <ProblemSolution title="하드웨어와 웹의 상태 불일치" context="수십 대의 장비가 동시에 보내는 센서 데이터(온도, 수위 등)가 비동기적으로 도착하여, UI 깜빡임과 데이터 역전 현상이 발생했습니다." solution={["서버 데이터와 로컬 제어 상태(Recoil)를 분리하는 이원화된 상태 관리 전략 도입", "Recoil Atom Family 패턴으로 장비 ID별 상태 스코프 격리, 리렌더링 범위 최소화"]} outcome="상태 업데이트 지연 3s → 0.8s 단축 및 UI 렌더링 최적화" />
          <ProblemSolution title="불안정한 네트워크와 명령 유실" context="공장 Wi-Fi 연결이 불안정하여 제어 명령(시작/중지)이 서버에 도달하지 못하는 경우가 빈번했습니다." solution={["자체 WebSocket 엔진 구현: 연결 끊김 감지 시 명령을 메모리 큐에 적재", "재연결 성공 즉시 큐 Flush 및 순차 전송 보장", "낙관적 업데이트로 사용자에게 즉각 피드백 제공 후 백그라운드 동기화"]} />
        </Section>

        <Section title="Performance & Optimization" delay={0.1}>
          <ProblemSolution title="고빈도 데이터로 인한 메인 스레드 부하" context="초당 수백 건의 WebSocket 메시지를 실시간으로 DOM에 반영하다 보니 브라우저 프리징 발생" solution={["100ms 단위 Throttling 버퍼 도입하여 데이터 업데이트 빈도 제어", "requestAnimationFrame과 동기화하여 모니터 주사율에 맞춰 배치렌더링"]} />
          <ProblemSolution title="메모리 누수 방지 및 모바일 최적화" context="장시간 모니터링 시 메모리 사용량이 증가하고, 모바일에서 데이터 로딩이 느린 문제" solution={["엄격한 Cleanup 정책: 언마운트 시 WebSocket 리스너 및 WebRTC 스트림 즉시 해제", "모바일 환경 감지 시 초기 데이터 페칭 양 축소 및 UI 레이아웃 단순화"]} />
        </Section>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-resume-text-sub text-xs font-bold uppercase tracking-widest mb-4">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "SCSS", "Recoil", "TanStack Query", "Recharts", "Framer Motion", "react-hook-form", "lottie-react", "Axios", "JSZip", "Crypto-js", "WebSocket", "@dnd-kit", "WebRTC"].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-800 text-resume-text-main rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">{tech}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail_CaseStudy;
