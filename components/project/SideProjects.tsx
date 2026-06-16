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
import CosmicTexture from "@/components/ui/CosmicTexture";

const ICONS: Record<string, LucideIcon> = {
  CloudLightning,
  LayoutTemplate,
  TerminalSquare,
  BarChart3,
  Dna,
};

const GLASS =
  "border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]";

const SideProjects = () => {
  const projects = localize(sideProjects);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <section id="side" className="relative z-20 scroll-mt-16 overflow-hidden bg-resume-bg py-24 text-resume-text-main">
      <CosmicTexture />
      <div className="mx-auto max-w-4xl px-6">
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
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-resume-text-sub">More Work</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-resume-text-main md:text-6xl">사이드 프로젝트</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-resume-text-sub break-keep md:text-base">
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
                className={`group relative flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-0.5 ${GLASS}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${project.logo ? "bg-transparent" : project.color} ${!project.logo && "ring-1 ring-inset ring-white/10"}`}>
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
                        <h3 className="text-lg font-bold leading-tight tracking-tight text-resume-text-main">{project.title}</h3>
                        <div className="ml-1 flex items-center gap-1">
                          {project.github && (
                            <Link href={project.github} target="_blank" className="p-1 text-resume-text-sub/70 transition-colors hover:text-resume-text-main" title="View Github Repo">
                              <Github size={16} />
                            </Link>
                          )}
                          {project.link && (
                            <Link href={project.link} target="_blank" className="p-1 text-resume-text-sub/70 transition-colors hover:text-resume-text-main" title="Visit Live Site">
                              <ExternalLink size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-resume-text-sub">{project.category}</span>
                    </div>
                  </div>
                </div>

                <p className="mb-4 min-h-[60px] text-sm leading-relaxed text-resume-text-sub break-keep">{project.description}</p>

                <div className="mb-6 flex-1">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-resume-text-sub">Key Achievements</h4>
                  <ul className="space-y-1.5">
                    {project.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-resume-text-main break-keep">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-resume-text-main/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-resume-card px-2.5 py-1 text-[11px] font-semibold text-resume-text-main">
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
