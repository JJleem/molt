"use client";

// 최종 CTA (Stripe stripe-11 하단 "Ready to get started?" 구조) — 푸터 직전 마무리.
// 푸터의 연락처와 역할이 겹치지 않게, 여기는 "채용·협업 제안"을 향한 행동 유도에 집중.
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import GridGuides from "@/components/ui/GridGuides";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#0d9488";

export default function FinalCTA() {
  return (
    <section className="relative bg-white py-24">
      <GridGuides columns={4} />
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLURPLE }} />
            <span className="text-gradient">Let&apos;s build</span>
          </p>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.12] tracking-tight md:text-[44px]" style={{ color: INK }}>
            제품을 끝까지 만들 사람,
            <br />
            찾고 계신가요?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed break-keep" style={{ color: SLATE }}>
            프론트엔드부터 AI 시스템까지 — 다음 제품을 함께 만들 팀을 찾고 있습니다.
            편하게 연락 주세요.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(13,148,136,0.6)] transition-transform hover:-translate-y-0.5"
              style={{ background: BLURPLE }}
            >
              연락하기
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="https://github.com/JJleem"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-[#e6ebf1] px-6 py-3 text-[15px] font-semibold transition-colors hover:bg-[#f6f9fc]"
              style={{ color: INK }}
            >
              <Github size={16} /> GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
