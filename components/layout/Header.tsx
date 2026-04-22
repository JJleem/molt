"use client";

import Link from "next/link";
import LiveVisitorBadge from "@/components/analytics/LiveVisitorBadge";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Molt<span className="text-indigo-600 dark:text-indigo-400">.</span>dev
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all text-base"
            title={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <LiveVisitorBadge />
        </div>
      </div>
    </header>
  );
}
