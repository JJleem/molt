"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Mail,
  Link as LinkIcon,
  Terminal,
  CheckCircle2,
  MonitorSmartphone,
  Bot,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- [Data] ---
const PHILOSOPHY_DATA = [
  {
    id: "responsibility",
    icon: <Rocket className="w-5 h-5 text-indigo-500" />,
    title: "끝까지 책임지고, 1에서 100을 만듭니다.",
    desc: "하나의 프로덕트가 세상에 나오기까지의 모든 과정을 즐깁니다.",
    bullets: [
      "기획부터 디자인, 퍼블리싱, 배포까지 프론트엔드의 전체 라이프사이클을 주도적으로 경험했습니다.",
      "대량의 데이터 렌더링과 실시간 웹소켓 통신 등 복잡한 상태 관리(Server/Client State 분리)를 안정적으로 구현해 냅니다.",
      "산업용 관제 솔루션(C-Hub)을 성공적으로 런칭하고 GS인증 1등급 획득에 기여하며 제품의 가치를 직접 증명했습니다.",
    ],
  },
  {
    id: "ai-driven",
    icon: <Bot className="w-5 h-5 text-emerald-500" />,
    title: "AI와 함께 개발의 한계를 넓힙니다.",
    desc: "AI를 단순한 검색 도구가 아닌, '페어 프로그래밍 파트너'로 활용합니다.",
    bullets: [
      "바이브 코딩(Vibe Coding)을 적극 도입하여, 아이디어를 빠르게 코드로 구체화하고 프로덕트의 퀄리티를 높입니다.",

      "단순한 코더를 넘어, AI 시대에 맞는 효율적이고 경제적인 프론트엔드 아키텍처를 끊임없이 고민합니다.",
    ],
  },
  {
    id: "adaptability",
    icon: <MonitorSmartphone className="w-5 h-5 text-rose-500" />,
    title: "환경을 가리지 않고 최적의 UX를 고민합니다.",
    desc: "플랫폼과 도메인의 경계를 넘어 사용자 경험(UX)의 본질에 집중합니다.",
    bullets: [
      "웹 브라우저를 넘어 라즈베리파이(임베디드) 환경의 GUI 개발까지 스펙트럼을 넓히며 다양한 렌더링 최적화를 경험했습니다.",
      "'어떻게 하면 유저가 더 직관적으로 제어할 수 있을까?'를 묻고, 기획/디자인/백엔드 등 타 직군과 적극적으로 소통합니다.",
      "미래의 저와 동료들을 위해, 유지보수가 용이하고 가독성 높은 코드를 작성하기 위해 노력합니다.",
    ],
  },
];

// --- [Component] ---
const IntroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-white text-slate-600 py-20 px-6 md:px-12 font-sans overflow-hidden">
      {/* Background Grid Pattern (밝고 은은한 모눈종이 패턴) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-16">
        {/* 1. Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-slate-200 pb-12"
        >
          {/* Profile Image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shrink-0 shadow-lg bg-slate-50">
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Image
                src="/assets/jj.png"
                alt="임재준"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
              안녕하세요,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
                한계를 긋지 않는
              </span>
              <br />
              프론트엔드 개발자 <span className="text-slate-900">임재준</span>
              입니다.
            </h1>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="mailto:leemjaejun@gmail.com"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Mail size={16} /> Email
              </Link>
              <Link
                href="https://github.com/JJleem"
                target="_blank"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Github size={16} /> GitHub
              </Link>
              <Link
                href="https://velog.io/@leemjaejun/posts"
                target="_blank"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <LinkIcon size={16} /> Blog
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. Philosophy Content */}
        <div className="flex flex-col gap-10 md:gap-12">
          {PHILOSOPHY_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-3 md:gap-4 group"
            >
              {/* Title Section */}
              <div className="flex items-start md:items-center gap-3">
                {/* 모바일에서는 아이콘이 텍스트와 줄바꿈되지 않도록 위쪽으로 살짝 정렬(mt-0.5), 크기 조절 */}
                <div className="p-2 md:p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-colors shrink-0 mt-0.5 md:mt-0">
                  {item.icon}
                </div>
                <div>
                  {/* 모바일: text-base(16px), 데스크탑: text-2xl(24px) */}
                  <h3 className="text-base md:text-2xl font-bold text-slate-800 mb-0.5 md:mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  {/* 모바일: text-xs(12px), 데스크탑: text-sm(14px) */}
                  <p className="text-xs md:text-sm text-slate-500 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bullet Points */}
              {/* 모바일에서는 들여쓰기를 살짝 줄임 (pl-[2.75rem]) */}
              <ul className="mt-1 md:mt-2 space-y-2 md:space-y-3 pl-[2.75rem] md:pl-[3.25rem]">
                {item.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    // 모바일: text-[13px]로 섬세하게 조절, 데스크탑: text-base(16px)
                    // break-keep: 한글 단어가 쪼개지지 않도록 설정 (모바일 가독성 핵심)
                    className="flex items-start gap-2 md:gap-2.5 text-[13px] md:text-base text-slate-600 leading-relaxed break-keep"
                  >
                    <CheckCircle2
                      // 모바일에서는 체크 아이콘도 살짝 줄임
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300 mt-1 shrink-0 group-hover:text-indigo-300 transition-colors"
                    />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: bullet.replace(
                          /(C-Hub|바이브 코딩|GS인증 1등급|라즈베리파이|프론트엔드 아키텍처|Server\/Client State 분리)/g,
                          // 하이라이팅 박스도 모바일에 맞춰서 패딩(px-1 py-0.5)과 글씨 크기(text-[12px])를 줄임
                          '<strong class="text-slate-900 font-bold bg-slate-100 px-1 py-0.5 md:px-1.5 md:py-0.5 rounded text-[12px] md:text-[14px]">$1</strong>',
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
