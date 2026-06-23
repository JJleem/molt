"use client";

// 기술 스택 로고 월 (Stripe stripe-2/8 로고 월 구조) — 섹션 사이 시각적 쉬어가는 지점.
// 회색 단조 텍스트 로고. 호버 시 blurple로 살짝 살아남. 연회색 면.
import { motion } from "framer-motion";
import SlantBg from "@/components/sections/SlantBg";

const SLATE = "#425466";

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "React Native",
  "Python",
  "LangGraph",
  "WebSocket",
  "Recoil",
  "TanStack Query",
  "three.js",
  "Framer Motion",
];

export default function TechLogoWall() {
  return (
    <section className="relative py-20">
      <SlantBg color="#f6f9fc" top bottom={false} />
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        <p
          className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: SLATE }}
        >
          매일 손에 쥐는 도구들
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {STACK.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="cursor-default text-[17px] font-bold tracking-tight text-[#5b6b7f] transition-colors duration-200 hover:text-[#0d9488] md:text-[19px]"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
