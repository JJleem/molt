"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Link as LinkIcon, ArrowUp } from "lucide-react";
import SlantBg from "@/components/sections/SlantBg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="relative scroll-mt-20 overflow-hidden px-6 pb-16 pt-28 font-sans text-[#8898aa] md:px-12"
    >
      <SlantBg color="#0a2540" top bottom={false} />
      {/* subtle blurple glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[#0d9488]/[0.08] blur-[100px]" />

      <div className="relative z-10 mx-auto flex max-w-[1140px] flex-col gap-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="max-w-md text-2xl font-light leading-snug tracking-tight text-white md:text-3xl">
            함께 좋은 제품을 만들어요.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="mailto:leemjaejun@gmail.com"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
              title="Email"
            >
              <Mail size={18} />
            </Link>
            <Link
              href="https://github.com/JJleem"
              target="_blank"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
              title="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://velog.io/@leemjaejun/posts"
              target="_blank"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
              title="Blog"
            >
              <LinkIcon size={18} />
            </Link>
            <div className="mx-1 h-6 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="group flex items-center justify-center rounded-full bg-[#0d9488] p-2.5 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]"
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
