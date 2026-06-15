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
    <section className="relative z-20 min-h-screen bg-resume-bg text-resume-text-main pb-15 transition-colors duration-300">
      <div className="absolute h-full w-full inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(100,116,139,0.12)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none -z-10" />
      <div className="max-w-4xl mx-auto px-6 pt-20">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-10 flex items-center gap-3"
        >
          <h1 className="w-full text-4xl md:text-5xl font-bold text-resume-text-main mb-2 tracking-tight border-b border-b-resume-primary pb-2">
            <span className="text-resume-primary">Side Projects.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${project.logo ? "bg-transparent" : project.color} ${!project.logo && "ring-1 ring-inset ring-black/5 dark:ring-white/5"}`}>
                      {project.logo ? (
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          <Image src={project.logo} alt={`${project.title} logo`} fill className="object-cover" />
                        </div>
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{project.title}</h3>
                        <div className="flex items-center gap-1 ml-1">
                          {project.github && (
                            <Link href={project.github} target="_blank" className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1" title="View Github Repo">
                              <Github size={16} />
                            </Link>
                          )}
                          {project.link && (
                            <Link href={project.link} target="_blank" className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1" title="Visit Live Site">
                              <ExternalLink size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{project.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 min-h-[60px]">{project.description}</p>

                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Key Achievements</h4>
                  <ul className="space-y-1.5">
                    {project.achievements.map((item, i) => (
                      <li key={i} className="text-[13px] text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-snug">
                        <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold rounded border border-slate-200 dark:border-slate-700">
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
