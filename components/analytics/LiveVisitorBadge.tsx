"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LiveVisitorBadge() {
  const [data, setData] = useState({ total: 0, today: 0, loading: true });

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch("/api/analytics");
        const result = await res.json();

        let fetchedTotal = result.total || 0;
        let fetchedToday = result.today || 0;

        // 1. 세션 스토리지에서 현재 유저의 방문 여부 확인
        const hasVisited = sessionStorage.getItem("hasVisited_portfolio");

        // 2. 이번 세션에 처음 접속한 거라면 (GA4 처리가 아직 안 됐을 테니) 내 몫을 +1 해줌
        if (!hasVisited) {
          fetchedTotal += 1;
          fetchedToday += 1;
          sessionStorage.setItem("hasVisited_portfolio", "true");
        }

        setData({
          total: fetchedTotal,
          today: fetchedToday,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }
    getStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-4 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:shadow hover:border-slate-300 transition-all cursor-default"
    >
      {/* 핑 애니메이션 부분 */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {/* <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
          Live
        </span> */}
      </div>

      {/* 통계 숫자 부분 */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-400 text-[11px] font-medium uppercase">
            Today
          </span>
          <span className="font-bold text-slate-900">
            {data.loading ? "..." : data.today.toLocaleString()}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-400 text-[11px] font-medium uppercase">
            Total
          </span>
          <span className="font-semibold text-slate-500">
            {data.loading ? "..." : data.total.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
