"use client";

// PROTOTYPE — wipe me. 히어로 시그니처 변주 스위처.
import React, { useEffect } from "react";

export default function PrototypeSwitcher({
  variants,
  current,
  onChange,
}: {
  variants: { key: string; name: string }[];
  current: string;
  onChange: (key: string) => void;
}) {
  const idx = Math.max(0, variants.findIndex((v) => v.key === current));
  const go = (delta: number) => {
    const next = (idx + delta + variants.length) % variants.length;
    onChange(variants[next].key);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#171210]/90 px-2 py-1.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <button onClick={() => go(-1)} className="rounded-full px-2.5 py-1 text-lg leading-none hover:bg-white/10" aria-label="이전 변주">‹</button>
      <span className="min-w-[180px] px-2 text-center text-xs font-semibold tabular-nums">
        {variants[idx].key} — {variants[idx].name}
      </span>
      <button onClick={() => go(1)} className="rounded-full px-2.5 py-1 text-lg leading-none hover:bg-white/10" aria-label="다음 변주">›</button>
    </div>
  );
}
