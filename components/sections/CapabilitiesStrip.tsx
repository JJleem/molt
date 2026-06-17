"use client";

// 히어로 직후 4-피처 컬럼 (Stripe stripe-2 구조).
// ★ 히어로 그라데이션 시트가 이 섹션 상단으로 *그대로 흘러내려와* 흰색으로 페이드 → "띠 이어짐".
//   (히어로 하단 시트 색 = teal(좌)→blurple→violet(우) 와 매칭, 그 위에 작은 teal→violet 리본 조각.)
// 각 컬럼: 아이콘(틴트 사각) + 컬러 eyebrow + 한글 타이틀 + 설명. 색은 히어로 그라데이션 4톤.
import { motion } from "framer-motion";
import { LayoutTemplate, Cpu, LineChart, Workflow, type LucideIcon } from "lucide-react";

const INK = "#0a2540";
const SLATE = "#425466";

type Cap = { accent: string; eyebrow: string; title: string; desc: string; icon: LucideIcon };

const CAPS: Cap[] = [
  {
    accent: "#0e9bb5",
    eyebrow: "Interface",
    title: "화면을 끝까지",
    desc: "프로덕션 React·Next.js로 실시간·반응형 UI를 직접 설계하고 구현합니다.",
    icon: LayoutTemplate,
  },
  {
    accent: "#635bff",
    eyebrow: "AI Systems",
    title: "LLM을 부려",
    desc: "멀티 에이전트 파이프라인·LLM 오케스트레이션으로 제품의 핵심 로직을 만듭니다.",
    icon: Cpu,
  },
  {
    accent: "#7c5cef",
    eyebrow: "Growth",
    title: "사용자를 들어오게",
    desc: "계측·SEO·자동 발행 파이프라인으로 실제 트래픽과 사용자를 만듭니다.",
    icon: LineChart,
  },
  {
    accent: "#c45c8a",
    eyebrow: "Ownership",
    title: "끝에서 끝까지",
    desc: "기획·디자인·개발·배포·운영까지 제품의 처음부터 끝을 직접 책임집니다.",
    icon: Workflow,
  },
];

function tint(hex: string) {
  return `color-mix(in srgb, ${hex} 14%, white)`;
}

export default function CapabilitiesStrip() {
  // 배경 시트는 부모 래퍼(page.tsx)가 한 장으로 그림 → 여기는 투명. features는 시트 아래에 오도록 pt 확보.
  return (
    <section className="relative z-20 bg-transparent pb-20 pt-[240px] md:pt-[330px]" style={{ color: INK }}>
      <div className="relative mx-auto max-w-[1140px] px-6">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CAPS.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.eyebrow}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative border-t-2 pt-5"
                style={{ borderColor: cap.accent }}
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: tint(cap.accent), color: cap.accent }}
                >
                  <Icon size={18} />
                </span>
                <p
                  className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: cap.accent }}
                >
                  {cap.eyebrow}
                </p>
                <h3 className="mt-1.5 text-[18px] font-bold tracking-tight" style={{ color: INK }}>
                  {cap.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed break-keep" style={{ color: SLATE }}>
                  {cap.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
