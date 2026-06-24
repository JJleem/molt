"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import type { Metric } from "@/content/types";

const INK = "#0a2540";
const SLATE = "#425466";
const CARD = "border border-[#e6ebf1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

interface LiveStats {
  posts: number;
  views: number;
  today: number;
}

/* 블로그 지표 4종 — 정적 값(콘텐츠)을 SSR 폴백으로 두고,
   live 플래그가 붙은 카드는 /api/cosmic-feed 의 실시간 값으로 덮어쓴다. */
export default function BlogMetrics({ metrics }: { metrics: Metric[] }) {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/cosmic-feed", { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => setStats(d?.stats ?? null))
      .catch(() => setStats(null));
    return () => ac.abort();
  }, []);

  const resolve = (m: Metric): { value: string; hint?: string; live: boolean } => {
    if (m.live && stats) {
      if (m.live === "posts") return { value: `${stats.posts.toLocaleString()}글`, hint: "실시간 · 매일 자동 발행", live: true };
      if (m.live === "views") return { value: stats.views.toLocaleString(), hint: stats.today > 0 ? `오늘 +${stats.today.toLocaleString()}` : "라이브", live: true };
    }
    return { value: m.value, hint: m.hint, live: false };
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m, i) => {
        const r = resolve(m);
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`relative rounded-2xl p-5 ${CARD}`}
          >
            {r.live && (
              <span className="absolute right-3 top-3 flex h-2 w-2" title="실시간">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            <p className="text-3xl font-bold tracking-tight" style={{ color: INK }}>
              <CountUp value={r.value} />
            </p>
            <p className="mt-1.5 text-sm font-bold" style={{ color: INK }}>{m.label}</p>
            {r.hint && <p className="mt-0.5 text-xs" style={{ color: SLATE }}>{r.hint}</p>}
          </motion.div>
        );
      })}
    </div>
  );
}
