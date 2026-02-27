"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Link as LinkIcon, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  // 맨 위로 스크롤 올라가는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0F1115] text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800 overflow-hidden font-sans">
      {/* 은은한 배경 효과 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          {/* 좌측: 로고 및 타이틀 */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={scrollToTop}
            >
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center">
                <Image
                  src="/assets/molt.png"
                  alt="molt logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                molt.
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium text-center md:text-left">
              Let&apos;s build something great together.
            </p>
          </div>

          {/* 우측: 소셜 링크 및 Top 버튼 */}
          <div className="flex items-center gap-5">
            <Link
              href="mailto:leemjaejun@gmail.com"
              className="p-2 rounded-full bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/30 transition-all"
              title="Send Email"
            >
              <Mail size={18} />
            </Link>
            <Link
              href="https://github.com/JJleem"
              target="_blank"
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
              title="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://velog.io/@leemjaejun/posts"
              target="_blank"
              className="p-2 rounded-full bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 transition-all"
              title="Blog"
            >
              <LinkIcon size={18} />
            </Link>

            {/* 구분선 */}
            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            {/* Back to Top 버튼 */}
            <button
              onClick={scrollToTop}
              className="group flex items-center justify-center p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-white hover:scale-110 transition-all shadow-lg"
              title="Back to top"
            >
              <ArrowUp
                size={18}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
          <p>© 2026 molt. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-rose-500 animate-pulse">♥</span> by
            Lim Jae-jun
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
