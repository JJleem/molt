"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LiveVisitorBadge() {
  const [data, setData] = useState({ total: 0, today: 0, loading: true });

  useEffect(() => {
    async function getStats() {
      try {
        const hasVisited = sessionStorage.getItem("hasVisited_portfolio");
        const url = !hasVisited
          ? "/api/analytics?action=increment"
          : "/api/analytics";
        const res = await fetch(url);
        const result = await res.json();
        if (!hasVisited) sessionStorage.setItem("hasVisited_portfolio", "true");
        setData({ total: result.total || 0, today: result.today || 0, loading: false });
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
      className="inline-flex items-center gap-4 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-default"
    >
      <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium uppercase">Today</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {data.loading ? "..." : data.today.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium uppercase">Total</span>
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {data.loading ? "..." : data.total.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
