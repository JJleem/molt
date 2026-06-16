"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";
import { agents } from "@/content/agents";

interface FeedPost {
  title: string;
  url: string;
  date: string;
  agentId: string;
  views: number;
}

const AGENT_MAP = Object.fromEntries(agents.map((a) => [a.id, a]));
const GLASS = "border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.4)]";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export default function LiveFeed() {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/cosmic-feed", { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch(() => setPosts([]));
    return () => ac.abort();
  }, []);

  if (posts === null) {
    return (
      <div className={`mt-8 rounded-2xl p-5 ${GLASS}`}>
        <div className="mb-4 h-4 w-44 animate-pulse rounded bg-white/[0.06]" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-5 w-full animate-pulse rounded bg-white/[0.03]" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mt-8 rounded-2xl p-5 ${GLASS}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <h4 className="text-sm font-bold text-resume-text-main">LIVE · 에이전트가 방금 발행한 글</h4>
      </div>

      <ul className="divide-y divide-white/5">
        {posts.map((post, i) => {
          const agent = AGENT_MAP[post.agentId];
          return (
            <li key={i}>
              <Link href={post.url} target="_blank" className="group flex items-center gap-3 py-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: agent?.color ?? "#a8a29e" }}
                  title={agent?.name}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-resume-text-main transition-opacity group-hover:opacity-60">
                  {post.title}
                </span>
                <span className="hidden shrink-0 items-center gap-1 text-xs text-resume-text-sub sm:flex">
                  <Eye size={12} /> {post.views.toLocaleString()}
                </span>
                <span className="shrink-0 text-xs text-resume-text-sub">{relativeTime(post.date)}</span>
                <ArrowUpRight size={14} className="shrink-0 text-resume-text-sub/50 transition-colors group-hover:text-resume-text-main" />
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
