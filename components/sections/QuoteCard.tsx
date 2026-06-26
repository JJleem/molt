"use client";

// molt 신념 카드 (Stripe stripe-7 테스티모니얼 구조 — 가짜 추천사 대신 신념 + Cosmic Hustle 크루).
// 블러플 그라데이션 풀카드. 좌: 신념, 우: 에이전트 3인방(투명 PNG, 뒤 광선) + 떠다니는 스파클.
import { motion } from "framer-motion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// 떠다니는 스파클 (점·다이아) — 빈 공간에 생기를. 과하지 않게.
type Spark = { top: string; left: string; size: number; delay: number; dur: number; diamond?: boolean };
const SPARKS: Spark[] = [
  { top: "14%", left: "6%", size: 7, delay: 0, dur: 5 },
  { top: "30%", left: "18%", size: 4, delay: 1.4, dur: 6, diamond: true },
  { top: "10%", left: "34%", size: 5, delay: 0.7, dur: 5.5 },
  { top: "52%", left: "9%", size: 5, delay: 2.1, dur: 6.5, diamond: true },
  { top: "22%", left: "48%", size: 4, delay: 1.1, dur: 5 },
  { top: "68%", left: "20%", size: 6, delay: 0.4, dur: 6 },
  { top: "16%", left: "60%", size: 4, delay: 1.8, dur: 5.5, diamond: true },
  { top: "40%", left: "30%", size: 3, delay: 2.6, dur: 6 },
  { top: "78%", left: "48%", size: 5, delay: 0.9, dur: 5 },
];

export default function QuoteCard() {
  return (
    <section className="relative bg-white py-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl px-8 pt-12 pb-0 md:px-16 md:pt-10"
          style={{
            background: "linear-gradient(120deg, #0f766e 0%, #0d9488 42%, #10b981 100%)",
            boxShadow: "0 40px 80px -32px rgba(13,148,136,0.55)",
          }}
        >
          {/* grain */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
          {/* 소프트 글로우 */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#2fe6e0]/15 blur-3xl" />

          {/* A. 크루 뒤 광선 + 방사형 글로우 */}
          <div className="pointer-events-none absolute -bottom-16 right-[-30px] h-[480px] w-[480px] md:right-[4%]">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 58%, rgba(255,255,255,0.30), rgba(255,255,255,0.07) 42%, transparent 68%)",
                filter: "blur(2px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "repeating-conic-gradient(from 0deg at 50% 58%, rgba(255,255,255,0.11) 0deg 3.5deg, transparent 3.5deg 14deg)",
                maskImage: "radial-gradient(circle at 50% 58%, #000 8%, transparent 58%)",
                WebkitMaskImage: "radial-gradient(circle at 50% 58%, #000 8%, transparent 58%)",
                animation: "quote-rays 48s linear infinite",
              }}
            />
          </div>

          {/* B. 떠다니는 스파클 */}
          <div className="pointer-events-none absolute inset-0">
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="absolute bg-white"
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  borderRadius: s.diamond ? 1 : "50%",
                  transform: s.diamond ? "rotate(45deg)" : undefined,
                  boxShadow: "0 0 8px rgba(255,255,255,0.7)",
                  animation: `quote-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite, quote-float ${s.dur + 2}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            {/* 좌: 신념 */}
            <div className="z-10 pb-4 md:flex-1 md:py-12">
              <blockquote className="max-w-xl text-[26px] font-light leading-[1.4] tracking-tight text-white break-keep md:text-[34px]">
                AI는 사람을{" "}
                <span className="relative whitespace-nowrap font-semibold text-white [text-shadow:0_0_26px_rgba(255,255,255,0.5)]">
                  한계 너머
                  <span className="ml-0.5 text-[#a7f3d0]">↗</span>
                </span>
                로<br className="hidden md:block" /> 이끈다고 믿습니다.
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-2.5">
                <span className="h-px w-7 bg-white/40" />
                <span className="text-[14px] font-semibold tracking-tight text-white/90">molt</span>
              </figcaption>
            </div>

            {/* 우: Cosmic Hustle 크루 (투명 PNG, 텍스트와 살짝 겹치며 바닥에서 올라옴) */}
            <div className="z-0 flex justify-center md:-ml-8 md:self-end md:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cosmic/crew.png"
                alt="Cosmic Hustle AI 에이전트 크루"
                draggable={false}
                className="w-full max-w-[250px] select-none object-contain object-bottom drop-shadow-[0_18px_34px_rgba(0,0,0,0.28)] md:max-w-[340px]"
              />
            </div>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
