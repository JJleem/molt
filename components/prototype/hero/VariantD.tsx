"use client";

// PROTOTYPE — wipe me. VariantD r2 = B(허물 벗기) + C(입자) 하이브리드 개선.
// · 색: 무지갯빛 뱀허물(하늘·초록·파랑 이리데센트)
// · 가장자리: 삐뚤빼뚤 불규칙한 찢긴 edge(polygon)
// · 조각: 둥근 blob, 스크롤 내릴 때만 부스럼처럼 떨어져 아래로 낙하(중력)
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

const BG = "#f6f5f2";
// 무지갯빛 뱀허물 — 하늘/초록/파랑이 섞인 이리데센트
const C_PALE = "#d6ece6"; // 옅은 아쿠아
const C_GREEN = "#9fd0b4"; // 하늘초록
const C_SKY = "#8fcae0"; // 하늘
const C_BLUE = "#6fa6d6"; // 파랑
const C_DEEP = "#4a7e9a"; // 깊은 청록
const FLAKE_COLORS = [C_PALE, C_GREEN, C_SKY, C_BLUE];

// 비늘(둥근 도트) + 이리데센트 본체 — 더 유기적/둥근 표면
const HUSK_SURFACE =
  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.30) 0px, rgba(255,255,255,0.30) 1.4px, rgba(255,255,255,0) 2.2px)," +
  "radial-gradient(circle at 50% 50%, rgba(74,126,154,0.16) 0px, rgba(74,126,154,0.16) 1.2px, rgba(255,255,255,0) 2px)," +
  `linear-gradient(125deg, ${C_PALE} 0%, ${C_GREEN} 26%, ${C_SKY} 50%, ${C_BLUE} 74%, ${C_DEEP} 100%)`;

// 불규칙 찢긴 가장자리 — 17점(x=0..100), 세로 흔들림(%) 고정값(SSR 안정)
const EDGE = [0, -2.5, 3, -1.5, 4.5, -3.5, 2, -4, 3.5, -1, 5, -3, 1.5, -2.5, 4, -1.5, 0];

export default function VariantD() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // --- 껍질 벗기 (0.28 → 0.72) ---
  const peel = useTransform(scrollYProgress, [0.28, 0.72], [0, 1]);

  // 불규칙 찢긴 edge polygon — 허물 = 찢긴 선 "아래" 영역
  const huskClip = useTransform(peel, (p) => {
    const d = p * 118;
    const top = EDGE.map((off, i) => {
      const x = (i / (EDGE.length - 1)) * 100;
      const y = Math.max(0, Math.min(100, d + off));
      return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
    });
    return `polygon(${top.join(", ")}, 100% 100%, 0% 100%)`;
  });
  const huskY = useTransform(peel, [0, 1], ["0%", "-44%"]);
  const huskRotX = useTransform(peel, [0, 1], [0, 46]);
  const huskSkew = useTransform(peel, [0, 0.5, 1], [0, 4, 1.5]);
  const huskScale = useTransform(peel, [0, 1], [1, 1.04]);
  const huskShadow = useTransform(peel, [0, 0.15, 1], [0.1, 0.24, 0]);

  const oldOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);

  const newOpacity = useTransform(scrollYProgress, [0.55, 0.82, 1], [0, 0.6, 1]);
  const newY = useTransform(scrollYProgress, [0.55, 1], [16, 0]);
  const newBlur = useTransform(scrollYProgress, [0.55, 0.9], [6, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);

  const remnantOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, 0.7]);
  const remnantH = useTransform(scrollYProgress, [0.62, 1], ["0px", "5px"]);

  const newBlurFilter = useTransform(newBlur, (b) => `blur(${b}px)`);
  const huskShadowCss = useTransform(
    huskShadow,
    (s) => `0 30px 60px -20px rgba(40,70,84,${s})`,
  );

  // --- 캔버스: 스크롤 내릴 때만 둥근 허물조각이 부서져 아래로 낙하 ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastPeel = 0;
    type Flake = {
      x: number; y: number; vx: number; vy: number;
      size: number; squash: number; rot: number; vr: number;
      life: number; maxLife: number; color: string;
    };
    let flakes: Flake[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const edgeYAt = (xFrac: number, depthPx: number) => {
      // 불규칙 edge를 px y로 — 선형 보간
      const seg = xFrac * (EDGE.length - 1);
      const i = Math.min(EDGE.length - 2, Math.floor(seg));
      const f = seg - i;
      const off = EDGE[i] * (1 - f) + EDGE[i + 1] * f;
      return depthPx + (off / 100) * height;
    };

    const spawn = (count: number, depthPx: number) => {
      for (let k = 0; k < count; k++) {
        if (flakes.length > 1300) break;
        const xf = Math.random();
        const x = xf * width;
        const y = edgeYAt(xf, depthPx) + (Math.random() - 0.5) * 8;
        flakes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.0, // 약한 좌우 흩어짐
          vy: 0.2 + Math.random() * 0.7, // 아래로 (부스럼처럼 떨어짐)
          size: 1.6 + Math.random() * 3.6,
          squash: 0.5 + Math.random() * 0.4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.18,
          life: 0,
          maxLife: 80 + Math.random() * 70,
          color: FLAKE_COLORS[(Math.random() * FLAKE_COLORS.length) | 0],
        });
      }
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const p = progressRef.current;
      const peelP = Math.max(0, Math.min(1, (p - 0.28) / 0.44));
      const depthPx = Math.min(peelP * 1.18, 1) * height;

      // 스크롤 *전진*한 만큼만 방출 (멈추면 안 생김 → 벚꽃 무한부유 방지)
      const dPeel = peelP - lastPeel;
      lastPeel = peelP;
      if (peelP > 0 && peelP < 1 && dPeel > 0.0005) {
        spawn(Math.min(46, Math.round(dPeel * 1500)), depthPx);
      }

      const next: typeof flakes = [];
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.life += 1;
        f.vy += 0.05; // 중력
        f.x += f.vx;
        f.y += f.vy;
        f.rot += f.vr;
        if (f.life >= f.maxLife || f.y > height + 24) continue;

        const lifeT = f.life / f.maxLife;
        const alpha = (1 - lifeT) * 0.9;
        if (alpha <= 0.02) {
          next.push(f);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.fillStyle = f.color;
        // 둥근 조각(눌린 타원)
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size * f.squash, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        next.push(f);
      }
      flakes = next;
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(render);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

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
        <div
          className="absolute inset-x-0 bottom-0 h-[5px]"
          style={{
            background: `linear-gradient(90deg, ${C_DEEP}, ${C_SKY}, ${C_GREEN}, ${C_PALE})`,
            opacity: 0.75,
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
        <span className="absolute left-6 top-6 z-40 text-sm font-medium tracking-tight text-stone-900">
          molt
        </span>

        {/* 현재 정체성 — 아래에서 드러남 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
          style={{ opacity: newOpacity, y: newY, filter: newBlurFilter }}
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

        {/* 허물 시트 — 불규칙 찢긴 가장자리로 벗겨짐 */}
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
              backgroundSize: "9px 9px, 9px 9px, 100% 100%",
              backgroundPosition: "0 0, 4px 4px, 0 0",
              opacity: 0.95,
              boxShadow: huskShadowCss,
            }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-6"
              style={{ opacity: oldOpacity }}
            >
              <h2
                className="text-center text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl"
                style={{ color: "#1f3a44", mixBlendMode: "multiply", opacity: 0.78 }}
              >
                {OLD_IDENTITY}
              </h2>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 떨어지는 둥근 허물조각 */}
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />

        {/* 남은 허물 잔재 */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          style={{
            height: remnantH,
            opacity: remnantOpacity,
            background: `linear-gradient(90deg, ${C_DEEP}, ${C_SKY}, ${C_GREEN}, ${C_PALE})`,
          }}
        />
      </div>
    </section>
  );
}
