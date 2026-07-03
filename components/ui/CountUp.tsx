"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// 숫자 지표가 화면에 들어오면 0에서 카운트업.
// 숫자로 시작하는 값만 애니메이션, 그 외("매일 09:00" 등)는 그대로 노출.
// 가독성 우선: 최종 값이 명확히 읽히도록 빠르게 수렴(easeOutCubic).
export default function CountUp({
  value,
  duration = 1.2,
}: {
  value: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const match = value.match(/^(\d[\d,]*)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  // SSR과 첫 클라이언트 렌더가 항상 0으로 일치해야 함 (reduce를 초기값에 쓰면 hydration 불일치)
  const [display, setDisplay] = useState<number>(0);

  useEffect(() => {
    if (target === null || !inView) return;
    if (reduce) {
      // reduced-motion: 카운트업 없이 최종값 즉시 표시
      const raf = requestAnimationFrame(() => setDisplay(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduce]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
