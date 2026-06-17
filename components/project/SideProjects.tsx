"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  CloudLightning,
  LayoutTemplate,
  TerminalSquare,
  BarChart3,
  Dna,
  ExternalLink,
  Github,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sideProjects } from "@/content/side-projects";
import { localize } from "@/content/locale";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#635bff";

const ICONS: Record<string, LucideIcon> = {
  CloudLightning,
  LayoutTemplate,
  TerminalSquare,
  BarChart3,
  Dna,
};

const SideProjects = () => {
  const projects = localize(sideProjects);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <section id="side" className="relative z-20 scroll-mt-16 overflow-hidden bg-white py-24" style={{ color: INK }}>
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#7c5cef" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7c5cef" }} />
            More Work
          </span>
          <h2 className="text-gradient mt-3 pb-1 text-4xl font-bold tracking-tight md:text-5xl">사이드 프로젝트</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed break-keep md:text-base" style={{ color: SLATE }}>
            업무 밖에서 직접 만들고 운영하며 검증한 작업들입니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => {
            const Icon = ICONS[project.iconName] ?? TerminalSquare;
            return (
              <motion.div
                key={project.id}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 } },
                }}
                className="group relative flex h-full flex-col rounded-2xl border border-[#e6ebf1] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${project.logo ? "bg-transparent" : project.color} ${!project.logo && "ring-1 ring-inset ring-[#e6ebf1]"}`}>
                      {project.logo ? (
                        <div className="relative h-full w-full overflow-hidden rounded-xl">
                          <Image src={project.logo} alt={`${project.title} logo`} fill className="object-cover" />
                        </div>
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold leading-tight tracking-tight" style={{ color: INK }}>{project.title}</h3>
                        <div className="ml-1 flex items-center gap-1">
                          {project.github && (
                            <Link href={project.github} target="_blank" className="p-1 transition-colors hover:text-[#635bff]" style={{ color: SLATE }} title="View Github Repo">
                              <Github size={16} />
                            </Link>
                          )}
                          {project.link && (
                            <Link href={project.link} target="_blank" className="p-1 transition-colors hover:text-[#635bff]" style={{ color: SLATE }} title="Visit Live Site">
                              <ExternalLink size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: SLATE }}>{project.category}</span>
                    </div>
                  </div>
                </div>

                <p className="mb-4 min-h-[60px] text-sm leading-relaxed break-keep" style={{ color: SLATE }}>{project.description}</p>

                <div className="mb-6 flex-1">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: SLATE }}>Key Achievements</h4>
                  <ul className="space-y-1.5">
                    {project.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] leading-snug break-keep" style={{ color: INK }}>
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: BLURPLE }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#e6ebf1] pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-2.5 py-1 text-[11px] font-semibold" style={{ color: INK }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SideProjects;
