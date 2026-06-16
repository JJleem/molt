"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Github,
  GitCommit,
  GitPullRequest,
  Users,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { GitHubCalendar } from "react-github-calendar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Image from "next/image";
import CosmicTexture from "@/components/ui/CosmicTexture";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay: number;
  isLoading: boolean;
}

const StatCard = ({ label, value, icon: Icon, delay, isLoading }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
  >
    <div className="p-2.5 bg-white/[0.03] rounded-xl text-resume-text-main border border-white/10">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[11px] text-resume-text-sub uppercase tracking-wider font-bold mb-0.5">
        {label}
      </p>
      {isLoading ? (
        <div className="h-6 w-16 bg-white/[0.06] animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-lg font-bold text-resume-text-main">{value}</p>
      )}
    </div>
  </motion.div>
);

const GithubStatus = ({ username = "your-github-username" }: { username?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ commits: 0, prsAndIssues: 0, repos: 0, followers: 0 });

  useEffect(() => {
    setIsMounted(true);
    const fetchGithubStats = async () => {
      try {
        const res = await fetch(`/api/github?username=${username}`);
        const data = await res.json();
        if (data) {
          setStats({
            commits: data.commits || 0,
            prsAndIssues: data.prsAndIssues || 0,
            repos: data.repos || 0,
            followers: data.followers || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (username !== "your-github-username") fetchGithubStats();
    else setIsLoading(false);
  }, [username]);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  return (
    <section className="py-24 relative z-20 overflow-hidden bg-resume-bg">
      <CosmicTexture />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-resume-text-sub">Activity</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between mt-3 mb-4 border-b border-white/10 pb-4 gap-4">
            <h2 className="text-3xl md:text-5xl font-bold text-resume-text-main tracking-tight flex items-center gap-3">
              <Github size={32} className="text-resume-text-main" />
              <span>GitHub 활동</span>
            </h2>
            <Link
              href={`https://github.com/${username}`}
              target="_blank"
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-full text-xs font-bold text-resume-text-main hover:bg-white/10 transition-colors"
            >
              <span className="flex gap-1">
                <Image src="/assets/molt.png" width={16} height={12} alt="GitHub Icon" className="shrink" />
                @{username}
              </span>
            </Link>
          </div>
          <p className="text-resume-text-sub text-sm break-keep">꾸준한 문제 해결과 성장의 기록입니다.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={GitCommit} label="Total Commits" value={`${stats.commits.toLocaleString()}+`} delay={0.1} isLoading={isLoading} />
          <StatCard icon={Users} label="Followers" value={stats.followers.toLocaleString()} delay={0.2} isLoading={isLoading} />
          <StatCard icon={GitPullRequest} label="PRs & Issues" value={stats.prsAndIssues.toLocaleString()} delay={0.3} isLoading={isLoading} />
          <StatCard icon={Github} label="Repositories" value={stats.repos.toLocaleString()} delay={0.4} isLoading={isLoading} />
        </div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
          }}
          className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] overflow-x-auto flex justify-center"
        >
          <div className="min-w-[750px] w-full flex justify-center relative">
            {isMounted ? (
              <>
                <GitHubCalendar
                  username={username}
                  theme={calendarTheme}
                  colorScheme="dark"
                  blockSize={14}
                  blockMargin={5}
                  fontSize={14}
                  labels={{ totalCount: "{{count}} contributions in the last half year" }}
                  renderBlock={(block, activity) =>
                    React.cloneElement(block, {
                      "data-tooltip-id": "github-tooltip",
                      "data-tooltip-html": `${activity.count || "No"} contributions on ${activity.date}`,
                    })
                  }
                />
                <Tooltip
                  id="github-tooltip"
                  place="top"
                  className="bg-slate-800! text-white! text-xs! px-3! py-1.5! rounded-md! z-50!"
                />
              </>
            ) : (
              <div className="w-full h-[120px] bg-white/[0.03] animate-pulse rounded-lg"></div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GithubStatus;
