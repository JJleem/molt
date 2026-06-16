import React from "react";
import { Lock } from "lucide-react";

// 맥 브라우저 창 목업 — 제품 스크린샷을 고급스럽게 감싼다 (synex 무드).
export default function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-resume-card shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-resume-text-sub">
          <Lock size={10} /> {url}
        </div>
        <span className="w-8 shrink-0" />
      </div>
      {children}
    </div>
  );
}
