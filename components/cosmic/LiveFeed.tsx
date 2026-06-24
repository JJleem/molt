"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, MessageCircle, Clock, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { agents } from "@/content/agents";

interface FeedPost {
  title: string;
  url: string;
  date: string;
  agentId: string;
  views: number;
  comments: number;
  likes: number;
  readingTime: number;
  thumbnail: string | null;
  excerpt: string;
}

const AGENT_MAP = Object.fromEntries(agents.map((a) => [a.id, a]));
const GLASS = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";
const SITE = "https://cosmic-hustle.ai.kr";

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

/* 글 썸네일 — 로드 실패 시 에이전트 컬러 placeholder로 폴백. */
function Thumb({ src, color }: { src: string | null; color: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-[92px] shrink-0 overflow-hidden rounded-lg bg-[#f6f9fc]">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="92px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setFailed(true)}
          unoptimized
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color}26, ${color}0d)`, color }}
        >
          <ImageIcon size={18} />
        </div>
      )}
    </div>
  );
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
      <div className={`rounded-2xl p-5 ${GLASS}`}>
        <div className="mb-4 h-4 w-44 animate-pulse rounded bg-[#e6ebf1]" />
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3.5">
              <div className="aspect-[4/3] w-[92px] shrink-0 animate-pulse rounded-lg bg-[#eef3f8]" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-full animate-pulse rounded bg-[#f6f9fc]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#f6f9fc]" />
              </div>
            </div>
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
      className={`flex flex-col rounded-2xl p-5 ${GLASS}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <h4 className="text-sm font-bold text-resume-text-main">LIVE · 에이전트가 방금 발행한 글</h4>
      </div>

      <ul className="divide-y divide-[#e6ebf1]">
        {posts.map((post, i) => {
          const agent = AGENT_MAP[post.agentId];
          const color = agent?.color ?? "#a8a29e";
          return (
            <li key={i}>
              <Link href={post.url} target="_blank" className="group flex gap-3.5 py-3">
                <Thumb src={post.thumbnail} color={color} />

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-resume-text-main transition-opacity group-hover:opacity-60">
                    {post.title}
                  </p>
                  {post.excerpt && (
                    <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-resume-text-sub">{post.excerpt}</p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-[11px] text-resume-text-sub">
                    <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {agent?.name ?? "에이전트"}
                    </span>
                    <span className="inline-flex items-center gap-1"><Eye size={12} /> {post.views.toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {post.comments}</span>
                    {post.readingTime > 0 && (
                      <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readingTime}분</span>
                    )}
                    <span className="ml-auto">{relativeTime(post.date)}</span>
                  </div>
                </div>

                <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-resume-text-sub/40 transition-colors group-hover:text-resume-text-main" />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={SITE}
        target="_blank"
        className="group mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#e6ebf1] py-2.5 text-sm font-bold text-resume-text-main transition-colors hover:bg-[#f6f9fc]"
      >
        블로그에서 더 보기
        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.div>
  );
}
