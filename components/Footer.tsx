"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Link as LinkIcon, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-[#0a2540] px-6 py-16 font-sans text-[#8898aa] md:px-12"
    >
      {/* subtle blurple glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[#635bff]/[0.08] blur-[100px]" />

      <div className="relative z-10 mx-auto flex max-w-[1140px] flex-col gap-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="max-w-md text-2xl font-light leading-snug tracking-tight text-white md:text-3xl">
            함께 좋은 제품을 만들어요.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="mailto:leemjaejun@gmail.com"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-colors hover:bg-white/10 hover:text-white"
              title="Email"
            >
              <Mail size={18} />
            </Link>
            <Link
              href="https://github.com/JJleem"
              target="_blank"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-colors hover:bg-white/10 hover:text-white"
              title="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://velog.io/@leemjaejun/posts"
              target="_blank"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-colors hover:bg-white/10 hover:text-white"
              title="Blog"
            >
              <LinkIcon size={18} />
            </Link>
            <div className="mx-1 h-6 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="group flex items-center justify-center rounded-full bg-[#635bff] p-2.5 text-white shadow-lg transition-transform hover:-translate-y-0.5"
              title="맨 위로"
            >
              <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs font-medium text-[#8898aa] md:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-md bg-white/10">
              <Image src="/assets/molt.png" alt="molt logo" fill className="object-cover" />
            </div>
            <span>© 2026 임재준 · molt.dev</span>
          </div>
          <p>Frontend · AI · Full-Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
