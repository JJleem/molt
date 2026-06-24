"use client";

import React, { useEffect, useRef } from "react";

/* 핑(마스코트) — 화면에 들어오면 딱 한 번 재생되고, 끝나면 "짜잔" 포즈에서 정지(루프 X).
   /ping.webm = 투명, 차이 기반 키잉으로 팔·컬러 이펙트까지 전부 보존(잘림 없음).
   흰 배경 버전이 필요하면 /ping-white.mp4. */
export default function Mascot({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          v.currentTime = 0;
          v.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src="/ping.webm"
      muted
      playsInline
      preload="auto"
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
