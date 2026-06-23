"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; total: number; today: number };

export default function LiveVisitorBadge() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    async function getStats() {
      try {
        const hasVisited = sessionStorage.getItem("hasVisited_portfolio");
        const url = !hasVisited
          ? "/api/analytics?action=increment"
          : "/api/analytics";
        const res = await fetch(url, { signal: controller.signal });
        const result = await res.json();
        if (!hasVisited) sessionStorage.setItem("hasVisited_portfolio", "true");
        setState({
          status: "ready",
          total: result.total || 0,
          today: result.today || 0,
        });
      } catch {
        setState({ status: "error" });
      } finally {
        clearTimeout(timeout);
      }
    }
    getStats();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // 값을 받지 못하면 깨진 위젯을 노출하지 않고 조용히 숨긴다.
  if (state.status === "error") return null;

  const loading = state.status === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden items-center gap-4 rounded-full border border-[#e6ebf1] bg-[#f6f9fc] px-4 py-2 shadow-sm transition-all hover:shadow sm:inline-flex"
    >
      <div className="flex items-center gap-2 border-r border-[#e6ebf1] pr-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-medium uppercase text-resume-text-sub">Today</span>
          {loading ? (
            <span className="inline-block h-3 w-6 animate-pulse rounded bg-[#e6ebf1]" />
          ) : (
            <span className="font-bold text-resume-text-main tabular-nums">
              {state.today.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-medium uppercase text-resume-text-sub">Total</span>
          {loading ? (
            <span className="inline-block h-3 w-9 animate-pulse rounded bg-[#e6ebf1]" />
          ) : (
            <span className="font-semibold text-resume-text-sub tabular-nums">
              {state.total.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
