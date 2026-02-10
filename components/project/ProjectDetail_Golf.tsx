"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Smartphone,
  MapPin,
  Cpu,
  Layers,
  Fingerprint,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- [Visual Component: Compact Feature Card] ---
const FeatureCard = ({ icon: Icon, title, items, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
        <Icon size={20} />
      </div>
      <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
    </div>

    <ul className="space-y-2.5 flex-1">
      {items.map((item: string, i: number) => (
        <li
          key={i}
          className="text-slate-600 text-sm leading-relaxed flex items-start gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

const ProjectDetail_Golf = () => {
  return (
    <div className="relative z-20 min-h-screen bg-resume-bg text-resume-text-main font-sans">
      {/* 배경 패턴 (Main과 다르게 점 패턴으로 가볍게) */}
      <div className="absolute h-full w-full inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none -z-10" />

      {/* 1. Header Area (Compact) */}
      <header className="pt-12 pb-12 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 rounded text-xs font-medium flex items-center gap-1">
                <Calendar size={12} /> 2024.09 - 2025.01
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <Image
                src="/assets/hf.png"
                alt="humanf logo"
                width={100}
                height={30}
                className="mt-2"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Golf Course Geofencing App
              </h1>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-2xl">
              골프장 내장객의 위치를 실시간으로 추적하여{" "}
              <strong className="text-indigo-600">
                지오펜싱(Geofencing) 기반 자동 체크인/아웃
              </strong>
              을 처리하는 모바일 앱 POC입니다. React Native 환경에서 Android
              네이티브 모듈을 직접 연동하여 정밀한 위치 추적 시스템을
              구현했습니다.
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex-col">
              <span className="flex items-center gap-2">
                <Users size={14} className="text-resume-text-sub" />
                <span className="text-xs font-bold text-resume-text-main">
                  Backend 2 + Frontend 1
                  <span className="text-resume-primary">(Me)</span>
                </span>
              </span>
              <span className="text-resume-text-sub text-[10px]">
                디자인(100%) + 퍼블리싱(100%) + 프론트엔드(100%)
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 2. Key Technical Features (Grid Layout) */}
        <div className="mb-16">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
            Key Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Native Module */}
            <FeatureCard
              icon={Smartphone}
              title="Android Native Bridge"
              delay={0.1}
              items={[
                "JS 환경의 한계를 넘어 정밀한 위치 추적을 위해 Android 네이티브 모듈 직접 구현",
                "NativeEventEmitter로 양방향 통신 브리지를 구축하여 위도·경도·속도 데이터를 실시간 파싱",
                "지오펜싱 트리거 반응 속도를 최적화하여 JS 스레드 부하 최소화",
              ]}
            />

            {/* Card 2: State Management */}
            <FeatureCard
              icon={Layers}
              title="Domain-Driven State"
              delay={0.2}
              items={[
                "GPS, 사용자 세션, 예약 데이터 등 성격이 다른 도메인을 Recoil Atom으로 명확히 분리",
                "고빈도 위치 데이터를 불필요한 렌더링 없이 처리하기 위해 Selector로 UI 업데이트 주기 제어",
                "전역 상태의 복잡도를 낮추고 유지보수성 향상",
              ]}
            />

            {/* Card 3: UX/UI */}
            <FeatureCard
              icon={Fingerprint}
              title="Mobile-First UX"
              delay={0.3}
              items={[
                "예약 삭제 시 'Long-press + Haptic' 인터랙션을 적용하여 오작동 방지 및 조작감 개선",
                "예약 확정까지의 흐름을 One-Step으로 설계하여 사용자 이탈률 감소",
                "필수 값 누락 시 즉각적인 모달 피드백 제공",
              ]}
            />

            {/* Card 4: Tech Stack (Card형태로 통합) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600">
                  <Cpu size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Tech Stack</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "React Native",
                  "TypeScript",
                  "Recoil",
                  "Android Native Module",
                  "Styled-Components",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail_Golf;
