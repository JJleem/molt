"use client";

// molt 철학 인용 카드 (Stripe stripe-7 테스티모니얼 구조 — 가짜 추천사 대신 브랜드 서사).
// 블러플 그라데이션 풀카드, 흰 텍스트, 큰 라이트 인용. molt = 개발 시작부터 써온 이름.
import { motion } from "framer-motion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function QuoteCard() {
  return (
    <section className="relative bg-white py-16">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-16 md:py-20"
          style={{
            background: "linear-gradient(120deg, #5b54f0 0%, #635bff 42%, #8f69eb 100%)",
            boxShadow: "0 40px 80px -32px rgba(99,91,255,0.55)",
          }}
        >
          {/* grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: NOISE }}
          />
          {/* 소프트 글로우 */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#2fe6e0]/15 blur-3xl" />

          <div className="relative">
            <span className="text-[64px] font-bold leading-none text-white/30">“</span>
            <blockquote className="-mt-6 max-w-3xl text-[26px] font-light leading-[1.4] tracking-tight text-white break-keep md:text-[34px]">
              기술은 끊임없이 <span className="font-semibold">탈피</span>한다.
              <br className="hidden md:block" />
              나는 그 속도로 탈피하며, 벗을 때마다 <span className="font-semibold">더 큰 형태</span>가 된다.
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-white/40" />
              <span className="text-[15px] font-semibold text-white">molt</span>
              <span className="text-[13px] text-white/70">— 개발을 시작한 날부터 써온 이름</span>
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
