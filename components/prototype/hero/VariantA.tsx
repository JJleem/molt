"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/**
 * VARIANT A — "가닥이 글자를 짜고 푼다" (Thread weaves & unravels the text)
 *
 * A single warm "husk thread" is the protagonist.
 *  progress 0    : OLD identity "프론트엔드 개발자" is DRAWN/WOVEN from the thread.
 *  progress ~0.5 : the thread UNRAVELS — loose filament strands drift off to the edge (shed husk).
 *  progress 1    : a single elegant strand settles down the right edge and the
 *                  NEW identity "AI를 부려 제품을 끝까지 만드는 엔지니어" is drawn cleanly.
 *
 * THROWAWAY prototype — no abstractions.
 */

const PALETTE = {
  canvas: "#f7f4ef",
  text: "#1c1917",
  sub: "#78716c",
  huskDeep: "#8a4b2a",
  husk: "#c2772f",
  huskLight: "#e0a96b",
};

// A few loose filament paths used during the "unravel" phase. Hand-faked curves
// that read as drifting thread coming apart from the old word toward the edge.
const STRANDS: { d: string; delay: number }[] = [
  { d: "M 120 300 C 360 240, 700 360, 1320 200", delay: 0 },
  { d: "M 140 330 C 420 420, 760 260, 1320 320", delay: 0.06 },
  { d: "M 110 360 C 380 300, 820 440, 1320 260", delay: 0.12 },
  { d: "M 160 300 C 500 360, 900 300, 1320 380", delay: 0.04 },
  { d: "M 100 340 C 460 260, 740 420, 1320 160", delay: 0.1 },
];

export default function VariantA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // ---- REDUCED MOTION: static final hero, single screen, no scroll. ----
  if (reduced) {
    return (
      <section
        className="relative flex min-h-screen w-full items-center"
        style={{ background: PALETTE.canvas }}
      >
        <span
          className="absolute left-8 top-8 text-sm font-bold tracking-tight"
          style={{ color: PALETTE.text }}
        >
          molt
        </span>
        {/* one persistent settled strand down the right edge */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M 1300 -40 C 1320 300, 1280 560, 1320 940"
            fill="none"
            stroke={PALETTE.husk}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <div className="relative z-10 px-8 md:px-20">
          <p
            className="mb-4 text-sm font-semibold tracking-tight"
            style={{ color: PALETTE.sub }}
          >
            임재준
          </p>
          <h1
            className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
            style={{ color: PALETTE.text }}
          >
            AI를 부려 제품을
            <br />
            끝까지 만드는 엔지니어
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: "240vh" }} className="relative">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: PALETTE.canvas }}
      >
        {/* wordmark */}
        <span
          className="absolute left-8 top-8 z-30 text-sm font-bold tracking-tight"
          style={{ color: PALETTE.text }}
        >
          molt
        </span>

        <Stage progress={scrollYProgress} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Stage({ progress }: { progress: MotionValue<number> }) {
  // PHASE WINDOWS along progress 0→1
  //  0.00–0.30  weave old word in
  //  0.30–0.45  hold
  //  0.45–0.62  unravel into strands
  //  0.62–1.00  settle single strand + draw new word

  // OLD word: draw on (0→0.3), then dissolve as it unravels (0.45→0.6)
  const oldDraw = useTransform(progress, [0, 0.3], [0, 1]);
  const oldOpacity = useTransform(progress, [0, 0.1, 0.45, 0.6], [0, 1, 1, 0]);
  const oldBlur = useTransform(progress, [0.45, 0.62], [0, 8]);
  const oldFilter = useTransform(oldBlur, (b) => `blur(${b}px)`);
  const oldY = useTransform(progress, [0.45, 0.62], [0, -30]);

  // STRANDS: appear and flow off during unravel, gone by the time things settle
  const strandsDraw = useTransform(progress, [0.45, 0.7], [0, 1]);
  const strandsOpacity = useTransform(
    progress,
    [0.42, 0.5, 0.72, 0.85],
    [0, 1, 1, 0]
  );
  const strandsDrift = useTransform(progress, [0.45, 0.85], [0, 120]);

  // SETTLED single right-edge strand: draws in as everything else clears
  const settledDraw = useTransform(progress, [0.6, 0.85], [0, 1]);
  const settledOpacity = useTransform(progress, [0.58, 0.7], [0, 1]);

  // NEW word: drawn cleanly at the end, with a spring-y rise
  const newDraw = useTransform(progress, [0.68, 0.95], [0, 1]);
  const newOpacity = useTransform(progress, [0.66, 0.78], [0, 1]);
  const newY = useTransform(progress, [0.66, 0.95], [28, 0]);
  const nameOpacity = useTransform(progress, [0.78, 0.92], [0, 1]);

  return (
    <div className="absolute inset-0">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="huskGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PALETTE.huskDeep} />
            <stop offset="55%" stopColor={PALETTE.husk} />
            <stop offset="100%" stopColor={PALETTE.huskLight} />
          </linearGradient>
        </defs>

        {/* OLD word woven from thread — SVG text traced by stroke */}
        <motion.text
          x="120"
          y="470"
          fontSize="120"
          fontWeight={800}
          letterSpacing="-4"
          fill="none"
          stroke={PALETTE.husk}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: oldDraw,
            opacity: oldOpacity,
            filter: oldFilter,
            y: oldY,
          }}
        >
          프론트엔드 개발자
        </motion.text>

        {/* UNRAVELING loose strands drifting toward the right edge */}
        <motion.g style={{ opacity: strandsOpacity, x: strandsDrift }}>
          {STRANDS.map((s, i) => (
            <motion.path
              key={i}
              d={s.d}
              fill="none"
              stroke="url(#huskGrad)"
              strokeWidth={1.2}
              strokeLinecap="round"
              style={{ pathLength: strandsDraw }}
              opacity={0.85 - i * 0.08}
            />
          ))}
        </motion.g>

        {/* SETTLED single elegant strand down the right edge */}
        <motion.path
          d="M 1300 -40 C 1320 300, 1280 560, 1320 940"
          fill="none"
          stroke={PALETTE.husk}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ pathLength: settledDraw, opacity: settledOpacity }}
        />

        {/* NEW identity — drawn cleanly, crisp */}
        <motion.g style={{ opacity: newOpacity, y: newY }}>
          <motion.text
            x="120"
            y="400"
            fontSize="86"
            fontWeight={800}
            letterSpacing="-3"
            fill="none"
            stroke={PALETTE.huskDeep}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: newDraw }}
          >
            AI를 부려 제품을
          </motion.text>
          <motion.text
            x="120"
            y="520"
            fontSize="86"
            fontWeight={800}
            letterSpacing="-3"
            fill="none"
            stroke={PALETTE.huskDeep}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: newDraw }}
          >
            끝까지 만드는 엔지니어
          </motion.text>
        </motion.g>
      </svg>

      {/* Crisp HTML overlay of the NEW identity for legibility once settled. */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center px-8 md:px-20"
        style={{ opacity: newOpacity }}
      >
        <motion.p
          className="mb-4 text-sm font-semibold tracking-tight"
          style={{ color: PALETTE.sub, opacity: nameOpacity }}
        >
          임재준
        </motion.p>
        <motion.h1
          className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
          style={{ color: PALETTE.text, y: newY }}
        >
          AI를 부려 제품을
          <br />
          끝까지 만드는 엔지니어
        </motion.h1>
      </motion.div>
    </div>
  );
}
