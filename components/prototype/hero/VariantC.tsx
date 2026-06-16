"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const OLD_IDENTITY = "프론트엔드 개발자";
const NEW_IDENTITY = "AI를 부려 제품을 끝까지 만드는 엔지니어";

const HUSK = ["#8a4b2a", "#c2772f", "#e0a96b"] as const;
const BG = "#f7f4ef";

type Particle = {
  // origin sampled from the old word
  ox: number;
  oy: number;
  // per-particle current parameters
  speed: number; // horizontal drift rate
  amp: number; // vertical wave amplitude
  freq: number; // wave frequency
  phase: number; // wave phase offset
  size: number;
  color: string;
  release: number; // progress at which this particle starts streaming (0.3–0.7)
};

export default function VariantC() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // shared progress ref read by the rAF loop (no per-frame setState)
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // ---- HTML text transforms (driven by scroll) ----
  // old word: crisp until ~0.25, then blurs + fades as it dissolves
  const oldBlur = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, 2, 14]);
  const oldOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55], [1, 0.85, 0]);
  const oldScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.04]);

  // new word: condenses from blur into crisp near the end
  const newBlur = useTransform(scrollYProgress, [0.6, 0.85, 1], [22, 6, 0]);
  const newOpacity = useTransform(scrollYProgress, [0.6, 0.78, 1], [0, 0.4, 1]);
  const newY = useTransform(scrollYProgress, [0.6, 1], [18, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

  // blur strings (hooks must run unconditionally, before any early return)
  const oldFilter = useTransform(oldBlur, (b) => `blur(${b}px)`);
  const newFilter = useTransform(newBlur, (b) => `blur(${b}px)`);

  // ---- Canvas particle current ----
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const oldTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;

    // Sample the old word into particle points via an offscreen canvas.
    const buildParticles = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(width));
      off.height = Math.max(1, Math.floor(height));
      const octx = off.getContext("2d");
      if (!octx) return;

      // font size roughly matching the displayed old word
      const fontSize = Math.min(width * 0.11, 132);
      octx.fillStyle = "#000";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
      octx.fillText(OLD_IDENTITY, width / 2, height * 0.46);

      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, off.width, off.height).data;
      } catch {
        // getImageData can throw in rare sandbox cases; bail gracefully.
        particles = [];
        return;
      }

      const next: Particle[] = [];
      const grid = 4; // sampling step in px
      for (let y = 0; y < off.height; y += grid) {
        for (let x = 0; x < off.width; x += grid) {
          const alpha = data[(y * off.width + x) * 4 + 3];
          if (alpha > 128) {
            next.push({
              ox: x,
              oy: y,
              speed: 0.9 + Math.random() * 1.6,
              amp: 12 + Math.random() * 34,
              freq: 0.004 + Math.random() * 0.006,
              phase: Math.random() * Math.PI * 2,
              size: 0.8 + Math.random() * 1.6,
              color: HUSK[(Math.random() * HUSK.length) | 0],
              release: 0.3 + Math.random() * 0.4,
            });
          }
        }
      }
      particles = next;
    };

    buildParticles();

    let t = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 1;
      const p = progressRef.current;

      ctx.clearRect(0, 0, width, height);

      if (particles.length === 0) return;

      // dissolve window: 0.3 → 0.7 sweeps everything across and off-screen.
      // After 0.7 only a faint lingering current along the bottom edge remains.
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // how far this particle is into its journey (0 = at rest, 1 = swept away)
        const local = (p - pt.release) / (1 - pt.release);
        const journey = Math.max(0, Math.min(1, local));

        // horizontal travel: rightward off the screen as journey rises
        const travel = journey * (width * 0.75) * pt.speed;
        const x = pt.ox + travel;

        // funnel vertically toward a single flowing thread line as it streams
        const threadY = height * 0.52;
        const pull = journey * journey; // ease-in
        const baseY = pt.oy + (threadY - pt.oy) * pull;
        const wave =
          Math.sin(x * pt.freq + t * 0.02 + pt.phase) * pt.amp * (0.4 + journey);
        const y = baseY + wave;

        if (x > width + 20) continue;

        // opacity: invisible before release, bright while streaming, fading at edge
        let alpha: number;
        if (journey <= 0) {
          alpha = 0; // word itself is handled by HTML layer
        } else {
          const edgeFade = 1 - Math.min(1, (x - width * 0.7) / (width * 0.3));
          alpha = Math.min(1, journey * 2.4) * Math.max(0, edgeFade) * 0.85;
        }
        if (alpha <= 0.01) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        const r = pt.size * (1 + journey * 0.6);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // faint lingering current along the lower edge once dissolve is done
      if (p > 0.7) {
        const lingerAlpha = Math.min(1, (p - 0.7) / 0.3) * 0.22;
        const baseY = height * 0.78;
        ctx.globalAlpha = lingerAlpha;
        for (let k = 0; k < 90; k++) {
          const x = ((t * 1.4 + k * (width / 90)) % (width + 60)) - 30;
          const y =
            baseY + Math.sin(x * 0.01 + t * 0.015 + k) * 14 + (k % 3) * 4;
          ctx.fillStyle = HUSK[k % HUSK.length];
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + (k % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(render);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(buildParticles);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  // ---- Reduced motion: static final hero only ----
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
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            {NEW_IDENTITY}
          </h1>
          <p className="mt-6 text-sm tracking-widest text-stone-500">임재준</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: "240vh" }} className="relative">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: BG }}
      >
        {/* wordmark */}
        <span className="absolute left-6 top-6 z-30 text-sm font-medium tracking-tight text-stone-900">
          molt
        </span>

        {/* particle current canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 h-full w-full"
        />

        {/* OLD identity — crisp, then dissolves into blur */}
        <motion.div
          ref={oldTextRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{
            filter: oldFilter,
            opacity: oldOpacity,
            scale: oldScale,
          }}
        >
          <h2 className="text-center text-5xl font-semibold tracking-tight text-stone-900 sm:text-7xl md:text-8xl">
            {OLD_IDENTITY}
          </h2>
        </motion.div>

        {/* NEW identity — condenses from blur into crisp */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          style={{
            filter: newFilter,
            opacity: newOpacity,
            y: newY,
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
      </div>
    </section>
  );
}
