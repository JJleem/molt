"use client";

// 히어로 직후 4-피처 컬럼 (Stripe stripe-2 구조).
// ★ 히어로 그라데이션 시트가 이 섹션 상단으로 *그대로 흘러내려와* 흰색으로 페이드 → "띠 이어짐".
//   (히어로 하단 시트 색 = teal(좌)→blurple→violet(우) 와 매칭, 그 위에 작은 teal→violet 리본 조각.)
// 각 컬럼: 아이콘(틴트 사각) + 컬러 eyebrow + 한글 타이틀 + 설명. 색은 히어로 그라데이션 4톤.
import { motion, useReducedMotion } from "framer-motion";
import { LayoutTemplate, Cpu, LineChart, Workflow, type LucideIcon } from "lucide-react";
import GridGuides from "@/components/ui/GridGuides";
import { DUR, EASE_OUT, DIST, STAGGER } from "@/components/ui/motion-tokens";

const INK = "#0a2540";
const SLATE = "#425466";

type Cap = { accent: string; eyebrow: string; title: string; desc: string; icon: LucideIcon };

const CAPS: Cap[] = [
  {
    accent: "#0891b2",
    eyebrow: "Interface",
    title: "프로덕션 UI",
    desc: "React·Next.js로 실시간·반응형 UI를 프로덕션 수준으로 설계·구현합니다.",
    icon: LayoutTemplate,
  },
  {
    accent: "#0d9488",
    eyebrow: "AI Systems",
    title: "멀티에이전트 시스템",
    desc: "에이전트 파이프라인·LLM 오케스트레이션으로 제품의 핵심 로직을 구축합니다.",
    icon: Cpu,
  },
  {
    accent: "#10b981",
    eyebrow: "Growth",
    title: "트래픽 · 전환",
    desc: "계측·SEO·자동 발행으로 실제 트래픽과 전환을 만들어냅니다.",
    icon: LineChart,
  },
  {
    accent: "#f59e0b",
    eyebrow: "Ownership",
    title: "엔드투엔드 오너십",
    desc: "기획·디자인·개발·배포·운영까지 제품 전 과정을 직접 책임집니다.",
    icon: Workflow,
  },
];

function tint(hex: string) {
  return `color-mix(in srgb, ${hex} 14%, white)`;
}

export default function CapabilitiesStrip() {
  // 배경 시트는 부모 래퍼(page.tsx)가 한 장으로 그림 → 여기는 투명. features는 시트 아래에 오도록 pt 확보.
  // 레이아웃: stripe-2 4-피처 밴드 = 아이콘 + (컬러 세로 바 + 타이틀) + 설명. 컬럼 사이 옅은 세로 구분선.
  const reduce = useReducedMotion() ?? false;

  const item = {
    hidden: { opacity: 0, y: DIST.md },
    show: { opacity: 1, y: 0, transition: { duration: DUR.reveal * 0.85, ease: EASE_OUT } },
  };

  return (
    <section className="relative z-20 bg-transparent pb-20 pt-[140px] md:pt-[200px]" style={{ color: INK }}>
      <GridGuides columns={4} top="top-[240px] md:top-[330px]" />
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        {/* 컬럼 사이 세로 구분은 섹션의 점선 GridGuides가 담당 */}
        <motion.div
          className="grid grid-cols-1 gap-x-0 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-0"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ show: { transition: { staggerChildren: STAGGER } } }}
        >
          {CAPS.map((cap) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.eyebrow}
                variants={item}
                className="relative lg:px-7 lg:[&:first-child]:pl-0"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: tint(cap.accent), color: cap.accent }}
                >
                  <Icon size={18} />
                </span>
                {/* 컬러 세로 바 + eyebrow/타이틀 — stripe-2 시그니처 */}
                <div className="mt-4 flex gap-3">
                  <span
                    className="mt-0.5 w-[3px] flex-shrink-0 rounded-full"
                    style={{ background: cap.accent }}
                  />
                  <div>
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: cap.accent }}
                    >
                      {cap.eyebrow}
                    </p>
                    <h3 className="mt-1 text-[18px] font-bold tracking-tight" style={{ color: INK }}>
                      {cap.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed break-keep" style={{ color: SLATE }}>
                  {cap.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
