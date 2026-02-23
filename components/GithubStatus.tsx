"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Github, GitCommit, GitPullRequest, Zap, Users } from "lucide-react";
import Link from "next/link";
import { GitHubCalendar } from "react-github-calendar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
// --- [Visual Components] ---

// 요약 스탯 카드
const StatCard = ({ label, value, icon: Icon, delay, isLoading }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
  >
    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700 border border-slate-100">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
        {label}
      </p>
      {isLoading ? (
        <div className="h-6 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-lg font-bold text-slate-800">{value}</p>
      )}
    </div>
  </motion.div>
);

const GithubStatus = ({
  username = "your-github-username",
}: {
  username?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  // Hydration 에러 방지용 마운트 상태
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    commits: 0,
    prsAndIssues: 0,
    repos: 0,
    followers: 0,
  });

  // 컴포넌트 마운트 및 데이터 페칭
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

    if (username !== "your-github-username") {
      fetchGithubStats();
    } else {
      setIsLoading(false);
    }
  }, [username]);

  // 스크롤 애니메이션 트리거
  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  // GitHub 잔디 커스텀 테마 (Light Mode 기준 깔끔한 그린 톤)
  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  };

  return (
    <section className="py-12 relative z-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* 복구된 예쁜 Header 영역 */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 border-b border-b-resume-primary pb-3 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-resume-text-main tracking-tight flex items-center gap-3">
              <Github size={32} className="text-slate-800" />
              <span>
                GitHub{" "}
                <span className="text-resume-primary">Contributions.</span>
              </span>
            </h2>
            <Link
              href={`https://github.com/${username}`}
              target="_blank"
              className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-slate-400 hover:text-slate-800 hover:shadow-sm transition-all"
            >
              <span>@{username}</span>
            </Link>
          </div>
          <p className="text-resume-text-sub text-sm">
            꾸준한 문제 해결과 성장의 기록입니다.
          </p>
        </motion.div>

        {/* 동적으로 변경된 Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={GitCommit}
            label="Total Commits"
            value={`${stats.commits.toLocaleString()}+`}
            delay={0.1}
            isLoading={isLoading}
          />
          <StatCard
            icon={Users}
            label="Followers"
            value={stats.followers.toLocaleString()}
            delay={0.2}
            isLoading={isLoading}
          />
          <StatCard
            icon={GitPullRequest}
            label="PRs & Issues"
            value={stats.prsAndIssues.toLocaleString()}
            delay={0.3}
            isLoading={isLoading}
          />
          <StatCard
            icon={Github}
            label="Repositories"
            value={stats.repos.toLocaleString()}
            delay={0.4}
            isLoading={isLoading}
          />
        </div>

        {/* GitHub Calendar (잔디) 영역 */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.3, duration: 0.5 },
            },
          }}
          className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar flex justify-center"
        >
          <div className="min-w-[750px] w-full flex justify-center relative">
            {isMounted ? (
              <>
                <GitHubCalendar
                  username={username}
                  theme={calendarTheme}
                  colorScheme="light"
                  blockSize={14}
                  blockMargin={5}
                  fontSize={14}
                  labels={{
                    totalCount: "{{count}} contributions in the last half year",
                  }}
                  // 3. renderBlock을 추가하여 각 잔디 블록에 툴팁 데이터 속성 주입
                  renderBlock={(block, activity) =>
                    React.cloneElement(block, {
                      "data-tooltip-id": "github-tooltip",
                      "data-tooltip-html": `${activity.count || "No"} contributions on ${activity.date}`,
                    })
                  }
                />
                {/* 4. 툴팁 UI 렌더링 (잔디 달력 하단에 배치) */}
                <Tooltip
                  id="github-tooltip"
                  place="top"
                  className="bg-slate-800! text-white! text-xs! px-3! py-1.5! rounded-md! z-50!"
                />
              </>
            ) : (
              <div className="w-full h-[120px] bg-slate-100 animate-pulse rounded-lg"></div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GithubStatus;
