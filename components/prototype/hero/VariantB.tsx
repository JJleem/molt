"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const OLD_IDENTITY = "프론트엔드 개발자";
const NEW_IDENTITY = "AI를 부려 제품을 끝까지 만드는 엔지니어";

const BG = "#f7f4ef";
const HUSK_DEEP = "#8a4b2a";
const HUSK = "#c2772f";
const HUSK_LIGHT = "#e0a96b";

// Subtle filament/grain for the husk surface: faint diagonal repeating lines
// (the shed-skin "fibers") + a soft warm gradient. Tailwind arbitrary value
// gets messy here, so we build the layered background inline.
const HUSK_SURFACE =
  // fiber grain
  "repeating-linear-gradient(118deg, rgba(138,75,42,0.10) 0px, rgba(138,75,42,0.10) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 5px)," +
  // cross weave for an organic membrane feel
  "repeating-linear-gradient(28deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 7px)," +
  // warm translucent body
  `linear-gradient(135deg, ${HUSK_LIGHT} 0%, ${HUSK} 48%, ${HUSK_DEEP} 100%)`;

export default function VariantB() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // --- Husk peel (the main event, 0.3 → 0.7) ---
  // The sheet peels from the top-right corner. We use clip-path inset that
  // grows from the top while the sheet lifts (rotateX), curls (skew), and
  // slides up-and-away, carrying the old word with it.
  const peel = useTransform(scrollYProgress, [0.28, 0.72], [0, 1]);

  // clip-path: inset eats the sheet from the top downward as it peels off.
  const huskClip = useTransform(peel, (p) => {
    const top = p * 118; // overshoot past 100 so the last sliver clears
    return `inset(${Math.min(top, 100)}% 0% 0% 0%)`;
  });
  const huskY = useTransform(peel, [0, 1], ["0%", "-46%"]);
  const huskRotX = useTransform(peel, [0, 1], [0, 52]); // lifts toward viewer
  const huskSkew = useTransform(peel, [0, 0.5, 1], [0, 6, 2]); // curl
  const huskScale = useTransform(peel, [0, 1], [1, 1.06]);
  const huskShadow = useTransform(peel, [0, 0.15, 1], [0.12, 0.32, 0]);

  // a soft "tear" highlight line that rides the peeling edge
  const tearTop = useTransform(peel, (p) => `${Math.min(p * 118, 100)}%`);
  const tearOpacity = useTransform(peel, [0, 0.06, 0.9, 1], [0, 1, 1, 0]);

  // OLD word sits ON the husk → fades out with the sheet (a touch ahead).
  const oldOpacity = useTransform(scrollYProgress, [0, 0.3, 0.62], [1, 1, 0]);

  // NEW identity revealed beneath as husk clears.
  const newOpacity = useTransform(scrollYProgress, [0.55, 0.82, 1], [0, 0.6, 1]);
  const newY = useTransform(scrollYProgress, [0.55, 1], [16, 0]);
  const newBlur = useTransform(scrollYProgress, [0.55, 0.9], [6, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  // The discarded husk settling as a thin sliver along the page edge.
  const remnantOpacity = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const remnantH = useTransform(scrollYProgress, [0.62, 1], ["0px", "8px"]);

  // Derived string transforms (hoisted above any early return — hooks rule).
  const newBlurFilter = useTransform(newBlur, (b) => `blur(${b}px)`);
  const huskShadowCss = useTransform(
    huskShadow,
    (s) => `0 30px 60px -20px rgba(58,28,12,${s})`,
  );

  // --- Reduced motion: static final hero only ---
  if (reduced) {
    return (
      <section
        className="relative flex h-screen w-full items-center justify-center"
        style={{ background: BG }}
      >
        <span className="absolute left-6 top-6 text-sm font-medium tracking-tight text-stone-900">
          molt
        </span>
        <div className="max-w-4xl px-6 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            {NEW_IDENTITY}
          </h1>
          <p className="mt-8 text-sm tracking-widest text-stone-500">임재준</p>
        </div>
        {/* persistent shed remnant along the bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-[6px]"
          style={{
            background: `linear-gradient(90deg, ${HUSK_DEEP}, ${HUSK}, ${HUSK_LIGHT})`,
            opacity: 0.85,
          }}
        />
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: "240vh" }} className="relative">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: BG, perspective: "1400px" }}
      >
        {/* wordmark */}
        <span className="absolute left-6 top-6 z-40 text-sm font-medium tracking-tight text-stone-900">
          molt
        </span>

        {/* NEW identity — crisp underneath, revealed as the husk peels */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
          style={{
            opacity: newOpacity,
            y: newY,
            filter: newBlurFilter,
          }}
        >
          <h1 className="max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            {NEW_IDENTITY}
          </h1>
          <motion.p
            className="mt-8 text-sm tracking-widest text-stone-500"
            style={{ opacity: nameOpacity }}
          >
            임재준
          </motion.p>
        </motion.div>

        {/* THE HUSK SHEET — translucent shed-skin membrane that peels away */}
        <motion.div
          className="absolute inset-0 z-20 origin-top"
          style={{
            clipPath: huskClip,
            y: huskY,
            rotateX: huskRotX,
            skewX: huskSkew,
            scale: huskScale,
            transformOrigin: "top center",
          }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{
              background: HUSK_SURFACE,
              backgroundSize: "auto, auto, 100% 100%",
              opacity: 0.92,
              boxShadow: huskShadowCss,
            }}
          >
            {/* OLD identity printed ON the husk */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-6"
              style={{ opacity: oldOpacity }}
            >
              <h2
                className="text-center text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl"
                style={{
                  color: "#2b1a10",
                  mixBlendMode: "multiply",
                  opacity: 0.78,
                }}
              >
                {OLD_IDENTITY}
              </h2>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* tear highlight riding the peeling edge */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 h-[3px]"
          style={{
            top: tearTop,
            opacity: tearOpacity,
            background: `linear-gradient(90deg, transparent, ${HUSK_LIGHT}, #fff7ee, ${HUSK_LIGHT}, transparent)`,
            boxShadow: `0 0 12px rgba(224,169,107,0.8)`,
          }}
        />

        {/* discarded husk settling as a thin sliver along the bottom edge */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
          style={{
            height: remnantH,
            opacity: remnantOpacity,
            background: `linear-gradient(90deg, ${HUSK_DEEP}, ${HUSK}, ${HUSK_LIGHT}, ${HUSK})`,
            filter: "blur(0.2px)",
          }}
        />
      </div>
    </section>
  );
}
