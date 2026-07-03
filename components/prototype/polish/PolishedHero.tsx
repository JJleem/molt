"use client";

// PROTOTYPE(polish) — VariantH(현행 확정 히어로)의 사본 + 마감 개선.
// 레이아웃·문구·카드 구성·타이밍은 원본과 동일하게 유지하고 다음만 다르다:
//  1) 좌측 텍스트 진입: opacity+12px stagger (총 ~820ms, reduced-motion 시 즉시)
//  2) CTA: press scale·focus-visible·정교한 hover shadow, GitHub 링크 언더라인
//  3) 데모카드: 1~3px pointer parallax + hover lift, 벗어나면 천천히 복귀
//  4) 카드 그림자 hairline + hover elevation 1단계, 스크린샷 위 느린 sheen
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GradientCanvas from "@/components/sections/GradientCanvas";
import GridGuides from "@/components/ui/GridGuides";
import { DUR, EASE_OUT, EASE_OUT_CSS, DIST, STAGGER, HOVER_LIFT, PARALLAX } from "./motion-tokens";

const INK    = "#0a2540";
const SLATE  = "#425466";
const BRAND  = "#0d9488";
const SPRING = "cubic-bezier(0.68,-0.55,0.27,1.55)";
const FLIP_E = "cubic-bezier(0.68,-0.25,0.27,1.0)";
const DUR_OUT = 750;
const DUR_IN  = 900;
const HOLD_MS = 2500;
const INTRO_DELAY = 600;

/* ─── 실제 사이트 스크린샷 설정 (원본과 동일) ─────────────────────────────── */
const SHOT = "/assets/projects";

type ShotSpec = { label: string; url: string; image: string };

const BLOG_SHOT:    ShotSpec = { label: "AI Blog · Cosmic Hustle", url: "cosmic-hustle.ai.kr", image: `${SHOT}/blog/2.png` };
const CHUB_SHOT:    ShotSpec = { label: "C-Hub · 3D 프린터 원격제어", url: "c-hub.info",        image: `${SHOT}/c-hub/1.png` };
const CHUBAPP_SHOT: ShotSpec = { label: "C-Hub App · 원격 모니터링",  url: "c-hub.info",        image: `${SHOT}/c-hub-app/4.png` };
const UNDERDUCK_SHOT: ShotSpec = { label: "UNDERDUCK FC",            url: "underduck.app",     image: `${SHOT}/underduck/0.png` };

/* ─── 폴리시 전용 CSS — 카드 그림자 전환·sheen (이 컴포넌트 안에서만 사용) ── */
const POLISH_CSS = `
.polish-shot {
  box-shadow: 0 0 0 1px rgba(10,37,64,0.05), 0 2px 4px rgba(0,0,0,0.05),
              0 8px 24px rgba(0,0,0,0.10), 0 30px 60px rgba(0,0,0,0.16);
  transition: box-shadow 0.45s ${EASE_OUT_CSS};
}
.polish-cards:hover .polish-shot {
  box-shadow: 0 0 0 1px rgba(10,37,64,0.06), 0 2px 4px rgba(0,0,0,0.05),
              0 12px 30px rgba(0,0,0,0.12), 0 38px 72px rgba(0,0,0,0.18);
}
.polish-shot-phone {
  box-shadow: 0 0 0 1px rgba(10,37,64,0.05), 0 2px 4px rgba(0,0,0,0.06),
              0 12px 32px rgba(0,0,0,0.18), 0 34px 64px rgba(0,0,0,0.20);
  transition: box-shadow 0.45s ${EASE_OUT_CSS};
}
.polish-cards:hover .polish-shot-phone {
  box-shadow: 0 0 0 1px rgba(10,37,64,0.06), 0 2px 4px rgba(0,0,0,0.06),
              0 16px 38px rgba(0,0,0,0.20), 0 42px 76px rgba(0,0,0,0.22);
}
@keyframes polish-sheen-move {
  0%   { transform: translateX(-140%) skewX(-12deg); }
  100% { transform: translateX(340%) skewX(-12deg); }
}
.polish-sheen {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1;
}
.polish-sheen::after {
  content: ""; position: absolute; top: -25%; bottom: -25%; left: 0; width: 34%;
  background: linear-gradient(105deg, transparent, rgba(255,255,255,0.09), transparent);
  animation: polish-sheen-move 8s ${EASE_OUT_CSS} 2.4s infinite;
}
@media (prefers-reduced-motion: reduce) {
  .polish-sheen::after { animation: none; opacity: 0; }
}
`;

/* ─── 공통: 브라우저 크롬 (원본과 동일) ──────────────────────────────────── */
function BrowserChrome({ url, dark }: { url: string; dark?: boolean }) {
  return (
    <div style={{
      background: dark ? "#1c2128" : "#f0f0f0",
      padding: "9px 12px",
      borderBottom: `1px solid ${dark ? "#30363d" : "#dedede"}`,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }}/>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }}/>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }}/>
      </div>
      <div style={{
        flex: 1, background: dark ? "#2d333b" : "#e2e2e2",
        borderRadius: 5, padding: "3px 10px",
        fontSize: 10, color: dark ? "#8b949e" : "#888", textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}>
        {url}
      </div>
    </div>
  );
}

/* ─── 데스크톱 스크린샷 카드 — 그림자만 클래스로 이동(hover 전환), sheen 추가 ── */
function BrowserShot({ spec }: { spec: ShotSpec }) {
  return (
    <div className="polish-shot" style={{ background: "#fff", borderRadius: 14, width: 448, overflow: "hidden" }}>
      <BrowserChrome url={spec.url} />
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: "#0b0f17" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.image}
          alt={spec.label}
          draggable={false}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            animation: "shot-fade 0.55s ease both, ken-burns 9s ease-out both",
          }}
        />
        <div className="polish-sheen" aria-hidden />
      </div>
    </div>
  );
}

/* ─── 모바일 스크린샷 카드 — 그림자만 클래스로 이동 ─────────────────────────── */
function PhoneShot({ spec }: { spec: ShotSpec }) {
  return (
    <div className="polish-shot-phone" style={{ background: "#fff", borderRadius: 30, width: 264, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spec.image}
        alt={spec.label}
        draggable={false}
        style={{ display: "block", width: "100%", height: "auto", animation: "shot-fade 0.55s ease both" }}
      />
    </div>
  );
}

/* ─── 배경 블루프린트 씬 (원본과 동일) ──────────────────────────────────────── */
function draw(delay: number, dur = 0.7): React.CSSProperties {
  return { strokeDasharray: 1, strokeDashoffset: 1, animation: `hero-draw ${dur}s ease ${delay}s forwards` };
}
function pop(delay: number): React.CSSProperties {
  return { opacity: 0, animation: `hero-fade-up 0.5s ease ${delay}s forwards` };
}
function grow(delay: number): React.CSSProperties {
  return { transformBox: "fill-box", transformOrigin: "bottom", transform: "scaleY(0)", animation: `hero-grow 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s forwards` };
}

const BLUEPRINT_FONT = "var(--font-pretendard), ui-sans-serif, system-ui, sans-serif";

function SceneBlog() {
  const A = "#0d9488";
  const tags = [
    { x: 26, w: 50, t: "Next.js" },
    { x: 82, w: 38, t: "LLM" },
    { x: 126, w: 38, t: "SEO" },
    { x: 170, w: 70, t: "11 Agents" },
  ];
  const bars = [30, 46, 38, 64, 52, 78];
  return (
    <g>
      <text x={26} y={52} fontSize={14} fontWeight={800} fill={A} style={pop(0)}>AI BLOG</text>
      <text x={26} y={70} fontSize={10} fill="#94a3b8" style={pop(0.1)}>Cosmic Hustle · 자동 발행 파이프라인</text>
      <path d="M26 80 H190" stroke={A} strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.2, 0.5)} />
      {tags.map((tg, i) => (
        <g key={tg.t}>
          <rect x={tg.x} y={96} width={tg.w} height={18} rx={9} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.35 + i * 0.08, 0.5)} />
          <text x={tg.x + tg.w / 2} y={108} fontSize={8} fill="#94a3b8" textAnchor="middle" style={pop(0.55 + i * 0.08)}>{tg.t}</text>
        </g>
      ))}
      <path d="M360 132 H516" stroke="#CBD5E1" strokeWidth={1} pathLength={1} style={draw(0.3, 0.5)} />
      {bars.map((h, i) => (
        <rect key={i} x={362 + i * 26} y={132 - h} width={16} height={h} rx={2} fill={A} opacity={0.7} style={grow(0.5 + i * 0.07)} />
      ))}
      <text x={360} y={48} fontSize={9} fill="#94a3b8" style={pop(0.4)}>auto-publish ↗</text>

      <text x={26} y={486} fontSize={9} fontWeight={700} letterSpacing="0.12em" fill="#94a3b8" style={pop(0.5)}>RECENT POSTS</text>
      {[0, 1, 2].map(i => (
        <g key={i}>
          <circle cx={30} cy={505 + i * 22} r={3} fill={A} style={pop(0.6 + i * 0.1)} />
          <path d={`M42 ${505 + i * 22} H${260 - i * 30}`} stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.62 + i * 0.1, 0.5)} />
        </g>
      ))}
      <text x={516} y={500} fontSize={26} fontWeight={800} fill={A} textAnchor="end" style={pop(0.7)}>24/7</text>
      <text x={516} y={516} fontSize={9} fill="#94a3b8" textAnchor="end" style={pop(0.8)}>publishing</text>
    </g>
  );
}

function SceneChub() {
  const A = "#6366f1";
  const stats = [
    { x: 26, t: "프린팅", v: "5", c: "#059669" },
    { x: 130, t: "대기", v: "8", c: "#6366f1" },
    { x: 234, t: "오프라인", v: "1", c: "#94a3b8" },
  ];
  const jobs = [
    { t: "benchy_v3 · 67%", p: 0.67 },
    { t: "bracket_A12 · 41%", p: 0.41 },
    { t: "gear_set · 88%", p: 0.88 },
  ];
  return (
    <g>
      <text x={26} y={52} fontSize={14} fontWeight={800} fill={A} style={pop(0)}>C-HUB</text>
      <text x={26} y={70} fontSize={10} fill="#94a3b8" style={pop(0.1)}>carima · 3D 프린터 원격제어</text>
      <path d="M26 80 H210" stroke={A} strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.2, 0.5)} />
      <g style={pop(0.25)}>
        <circle cx={462} cy={48} r={4} fill="#10b981" />
        <text x={472} y={52} fontSize={10} fill="#94a3b8">Live</text>
      </g>
      {stats.map((s, i) => (
        <g key={s.t}>
          <rect x={s.x} y={94} width={92} height={40} rx={7} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.35 + i * 0.1, 0.55)} />
          <text x={s.x + 12} y={118} fontSize={18} fontWeight={800} fill={s.c} style={pop(0.6 + i * 0.1)}>{s.v}</text>
          <text x={s.x + 12} y={130} fontSize={8} fill="#94a3b8" style={pop(0.66 + i * 0.1)}>{s.t}</text>
        </g>
      ))}

      <text x={26} y={486} fontSize={9} fontWeight={700} letterSpacing="0.12em" fill="#94a3b8" style={pop(0.5)}>프린트 큐 · 원격 제어</text>
      {jobs.map((j, i) => {
        const y = 500 + i * 30;
        return (
          <g key={j.t}>
            <rect x={26} y={y - 8} width={360} height={24} rx={6} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.58 + i * 0.1, 0.55)} />
            <circle cx={40} cy={y + 4} r={3} fill={A} style={pop(0.7 + i * 0.1)} />
            <text x={52} y={y + 7} fontSize={9} fill="#94a3b8" style={pop(0.74 + i * 0.1)}>{j.t}</text>
            <path d={`M250 ${y + 4} H374`} stroke="#E2E8F0" strokeWidth={3} strokeLinecap="round" pathLength={1} style={draw(0.78 + i * 0.1, 0.4)} />
            <path d={`M250 ${y + 4} H${250 + 124 * j.p}`} stroke={A} strokeWidth={3} strokeLinecap="round" pathLength={1} style={draw(0.9 + i * 0.1, 0.5)} />
          </g>
        );
      })}
      <text x={516} y={500} fontSize={26} fontWeight={800} fill="#059669" textAnchor="end" style={pop(0.7)}>8</text>
      <text x={516} y={516} fontSize={9} fill="#94a3b8" textAnchor="end" style={pop(0.8)}>online</text>
    </g>
  );
}

function SceneChubApp() {
  const A = "#8b5cf6";
  return (
    <g>
      <text x={10} y={64} fontSize={12} fontWeight={800} fill={A} style={pop(0)}>C-HUB APP</text>
      <text x={10} y={80} fontSize={9} fill="#94a3b8" letterSpacing="0.1em" style={pop(0.12)}>원격 모니터링</text>
      <rect x={14} y={150} width={104} height={96} rx={8} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.25, 0.8)} />
      <path d="M66 150 V134" stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.5, 0.4)} />
      <rect x={30} y={216} width={72} height={14} rx={2} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.55, 0.5)} />
      <rect x={14} y={262} width={104} height={68} rx={6} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.65, 0.6)} />
      <circle cx={26} cy={276} r={3} fill="#ef4444" style={pop(0.95)} />
      <text x={66} y={300} fontSize={8} fill="#94a3b8" textAnchor="middle" style={pop(1.0)}>LIVE CAM</text>
      <text x={14} y={362} fontSize={8} fill="#94a3b8" style={pop(0.85)}>진행률</text>
      <path d="M14 374 H118" stroke="#E2E8F0" strokeWidth={4} strokeLinecap="round" pathLength={1} style={draw(0.9, 0.4)} />
      <path d="M14 374 H89" stroke={A} strokeWidth={4} strokeLinecap="round" pathLength={1} style={draw(1.0, 0.5)} />
      <text x={118} y={366} fontSize={11} fontWeight={700} fill={A} textAnchor="end" style={pop(1.1)}>72%</text>

      <text x={530} y={150} fontSize={9} fill="#94a3b8" textAnchor="end" letterSpacing="0.12em" style={pop(0.2)}>PRINT STATUS</text>
      <text x={530} y={184} fontSize={20} fontWeight={800} fill={A} textAnchor="end" style={pop(0.3)}>프린팅</text>
      <path d="M438 198 H530" stroke={A} strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.4, 0.5)} />
      {["레시피 · Default.xml", "노즐 210°C · 베드 60°C", "시작 14:14:33", "소요 1h 32m"].map((t, i) => (
        <text key={t} x={530} y={224 + i * 20} fontSize={9} fill="#94a3b8" textAnchor="end" style={pop(0.5 + i * 0.1)}>{t}</text>
      ))}
    </g>
  );
}

function SceneUnderduck() {
  const A = "#ec4899";
  const dots = [
    [64, 430],
    [28, 380], [52, 380], [76, 380], [100, 380],
    [28, 320], [52, 320], [76, 320], [100, 320],
    [44, 262], [84, 262],
  ];
  const mods = ["일정 관리", "출석 체크", "투표·공지", "스탯·전적"];
  return (
    <g>
      <text x={16} y={70} fontSize={13} fontWeight={800} fill={A} style={pop(0)}>UNDERDUCK FC</text>
      <text x={16} y={86} fontSize={9} fill="#94a3b8" letterSpacing="0.1em" style={pop(0.12)}>조기축구 운영 대시보드</text>
      <rect x={16} y={150} width={96} height={300} rx={8} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.25, 0.9)} />
      <path d="M16 300 H112" stroke="#CBD5E1" strokeWidth={1} pathLength={1} style={draw(0.7, 0.5)} />
      <circle cx={64} cy={300} r={20} stroke="#CBD5E1" strokeWidth={1} fill="none" pathLength={1} style={draw(0.8, 0.5)} />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={5} fill={A} opacity={0.8} style={pop(0.6 + i * 0.05)} />
      ))}
      <text x={64} y={470} fontSize={8} fill="#94a3b8" textAnchor="middle" letterSpacing="0.18em" style={pop(1.0)}>SQUAD · 4-4-2</text>

      <text x={524} y={150} fontSize={9} fill={A} textAnchor="end" letterSpacing="0.14em" style={pop(0.2)}>FULL-STACK PWA</text>
      <path d="M430 160 H524" stroke={A} strokeWidth={2} strokeLinecap="round" pathLength={1} style={draw(0.3, 0.5)} />
      {mods.map((m, i) => (
        <g key={m}>
          <rect x={428} y={178 + i * 30} width={96} height={22} rx={6} stroke="#CBD5E1" fill="none" pathLength={1} style={draw(0.4 + i * 0.1, 0.55)} />
          <circle cx={442} cy={189 + i * 30} r={3} fill={A} style={pop(0.55 + i * 0.1)} />
          <text x={454} y={193 + i * 30} fontSize={9} fill="#94a3b8" style={pop(0.6 + i * 0.1)}>{m}</text>
        </g>
      ))}
      <text x={524} y={336} fontSize={26} fontWeight={800} fill={A} textAnchor="end" style={pop(0.95)}>82%</text>
      <text x={524} y={352} fontSize={9} fill="#94a3b8" textAnchor="end" style={pop(1.05)}>출석률 · 회원 18</text>
    </g>
  );
}

/* ─── 카드 정의 (원본과 동일) ────────────────────────────────────────────── */
const CARDS = [
  { kind: "browser" as const, spec: BLOG_SHOT,      Scene: SceneBlog },
  { kind: "browser" as const, spec: CHUB_SHOT,      Scene: SceneChub },
  { kind: "phone"   as const, spec: CHUBAPP_SHOT,   Scene: SceneChubApp },
  { kind: "phone"   as const, spec: UNDERDUCK_SHOT, Scene: SceneUnderduck },
];
const N = CARDS.length;

/* ─────────────────────────────────────────────────────────────────────────────
   HeroAnimation — 원본 crossfade 로직 그대로 + 폴리시:
   블루프린트/카드 레이어에 1~3px pointer parallax와 hover lift (rAF lerp, state 없음)
   ───────────────────────────────────────────────────────────────────────────── */
function HeroAnimation({ reduceMotion }: { reduceMotion: boolean }) {
  const [idx, setIdx] = useState(0);
  const [sceneKeys, setSceneKeys] = useState<number[]>(() => Array(N).fill(0));
  const idxRef = useRef(0);

  const [frameOn, setFrameOn] = useState(false);
  const [svgOn,   setSvgOn]   = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFrameOn(true), 260);
    const t2 = setTimeout(() => setSvgOn(true),   460);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 폴리시: parallax 대상 레이어 + 컨테이너
  const rootRef = useRef<HTMLDivElement>(null);
  const svgLayerRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);

  const dr = (perim: number, delay: number): React.CSSProperties => ({
    strokeDasharray: perim,
    strokeDashoffset: svgOn ? 0 : perim,
    transition: svgOn ? `stroke-dashoffset 0.75s ease ${delay}s` : "none",
  });
  const fd = (delay: number): React.CSSProperties => ({
    opacity: svgOn ? 1 : 0,
    transition: svgOn ? `opacity 0.4s ease ${delay}s` : "none",
  });

  useEffect(() => {
    const w0 = wrapRefs.current[0];
    const k0 = cardRefs.current[0];
    if (!w0 || !k0) return;

    w0.style.opacity = "1";
    w0.animate(
      [{ opacity: 0, transform: "scale(0.82)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: 1100, easing: SPRING, delay: INTRO_DELAY, fill: "backwards" }
    );
    k0.animate(
      [{ transform: "rotateY(0deg)" }, { transform: "rotateY(25deg)" }, { transform: "rotateY(0deg)" }],
      { duration: 1100, easing: FLIP_E, delay: INTRO_DELAY }
    );

    let loopId: ReturnType<typeof setInterval>;
    const startT = setTimeout(() => {
      loopId = setInterval(() => {
        const cur = idxRef.current;
        const nxt = (cur + 1) % N;

        wrapRefs.current.forEach(w => w?.getAnimations().forEach(a => a.cancel()));

        const wCur = wrapRefs.current[cur];
        const kCur = cardRefs.current[cur];
        const wNxt = wrapRefs.current[nxt];
        const kNxt = cardRefs.current[nxt];

        if (wCur) { wCur.style.opacity = "0"; wCur.style.transform = ""; }
        if (wNxt) { wNxt.style.opacity = "1"; wNxt.style.transform = ""; }

        if (wCur) wCur.animate(
          [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.85)" }],
          { duration: DUR_OUT, easing: SPRING }
        );
        if (kCur) kCur.animate(
          [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-25deg)" }, { transform: "rotateY(0deg)" }],
          { duration: DUR_OUT, easing: FLIP_E }
        );
        if (wNxt) wNxt.animate(
          [{ opacity: 0, transform: "scale(0.85)" }, { opacity: 1, transform: "scale(1)" }],
          { duration: DUR_IN, easing: SPRING }
        );
        if (kNxt) kNxt.animate(
          [{ transform: "rotateY(0deg)" }, { transform: "rotateY(25deg)" }, { transform: "rotateY(0deg)" }],
          { duration: DUR_IN, easing: FLIP_E }
        );

        idxRef.current = nxt;
        setIdx(nxt);
        setSceneKeys(prev => {
          const next = [...prev];
          next[nxt] = prev[nxt] + 1;
          return next;
        });
      }, HOLD_MS);
    }, INTRO_DELAY + 1100 + 700);

    return () => { clearTimeout(startT); clearInterval(loopId); };
  }, []);

  // 폴리시: pointer parallax — target을 ref에만 저장, rAF에서 lerp (React state 미사용)
  useEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    const svgL = svgLayerRef.current;
    const cardL = cardLayerRef.current;
    if (!root || !svgL || !cardL) return;

    const target = { x: 0, y: 0, hover: 0 };
    const cur = { x: 0, y: 0, hover: 0 };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      target.hover = 1;
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.hover = 0; };

    let raf = 0;
    const tick = () => {
      // 진입은 조금 빠르게, 복귀는 천천히
      const k = target.hover ? 0.10 : 0.045;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      cur.hover += (target.hover - cur.hover) * k;
      svgL.style.transform = `translate3d(${(-cur.x * PARALLAX.blueprint).toFixed(2)}px, ${(-cur.y * PARALLAX.blueprint).toFixed(2)}px, 0)`;
      cardL.style.transform = `translate3d(${(cur.x * PARALLAX.card).toFixed(2)}px, ${(cur.y * PARALLAX.card - cur.hover * HOVER_LIFT).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      svgL.style.transform = "";
      cardL.style.transform = "";
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="polish-cards relative select-none" style={{ width: 540, height: 600, flexShrink: 0 }}>

      {/* ── SVG 블루프린트: z=3 (parallax: 멀리, 반대 방향 1.5px) ── */}
      <div
        aria-hidden
        ref={svgLayerRef}
        style={{ position: "absolute", inset: 0, zIndex: 3, willChange: "transform" }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            opacity: frameOn ? 1 : 0,
            transform: frameOn ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.95s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}
        >
          <svg
            width="540" height="600" viewBox="0 0 540 600" fill="none"
            className="absolute top-0 left-0 pointer-events-none"
            style={{ fontFamily: BLUEPRINT_FONT }}
          >
            <rect x="0.5" y="0.5" width="539" height="599" rx="9.5" fill="#F8FAFC" stroke="#C7D2DE" style={fd(0)}/>
            <path d="M0 31.5H540" stroke="#C7D2DE" style={dr(540, 0.15)}/>
            <circle cx="16" cy="16" r="4" fill="#CFD7DF" style={fd(0.25)}/>
            <circle cx="30" cy="16" r="4" fill="#CFD7DF" style={fd(0.3)}/>
            <circle cx="44" cy="16" r="4" fill="#CFD7DF" style={fd(0.35)}/>

            {CARDS.map(({ Scene }, i) => (
              <g key={i} style={{ opacity: idx === i ? 1 : 0, transition: "opacity 0.55s ease" }}>
                <g key={sceneKeys[i]}>
                  <Scene />
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── DemoCard: z=10 (parallax: 가까이 3px + hover lift 4px) ── */}
      <div ref={cardLayerRef} style={{ position: "absolute", inset: 0, zIndex: 10, willChange: "transform" }}>
        {CARDS.map(({ kind, spec }, i) => (
          <div key={i} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", perspective: "1200px" }}>
            <div ref={el => { wrapRefs.current[i] = el; }} style={{ opacity: 0, transformStyle: "preserve-3d" }}>
              <div ref={el => { cardRefs.current[i] = el; }}>
                {kind === "browser" ? <BrowserShot spec={spec} /> : <PhoneShot spec={spec} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   히어로 메인 — 레이아웃/문구 원본 동일. 텍스트 진입 stagger + CTA 마감만 추가
   ───────────────────────────────────────────────────────────────────────────── */
export default function PolishedHero() {
  const reduce = useReducedMotion() ?? false;

  const fadeUp = {
    hidden: { opacity: 0, y: DIST.sm + 4 },
    show: { opacity: 1, y: 0, transition: { duration: DUR.reveal * 0.9, ease: EASE_OUT } },
  };

  return (
    <section
      id="top"
      className="relative min-h-screen w-full bg-transparent"
      style={{ color: INK }}
    >
      <style dangerouslySetInnerHTML={{ __html: POLISH_CSS }} />
      <GridGuides columns={4} />
      <GradientCanvas />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[7] w-full bg-white/90 lg:w-[58%] lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:to-transparent"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 90%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1140px] items-start gap-8 px-6 pt-[100px] pb-16 lg:gap-16">
        {/* 좌측 텍스트 — 짧은 stagger 진입 (총 ~820ms), reduced-motion 시 즉시 표시 */}
        <motion.div
          className="relative z-[10] w-full flex-shrink-0 lg:w-[46%]"
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{ show: { transition: { staggerChildren: STAGGER } } }}
        >
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND }}/>
            AI Native · Full-Stack Engineer
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]" style={{ color: INK }}>
            제품을 <span style={{ color: BRAND }}>끝까지</span><br/>만드는 엔지니어
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-md text-[18px] leading-[1.62] break-keep" style={{ color: SLATE }}>
            화면(FE)부터 그 뒤의 LLM 시스템, 사용자를 들어오게 만드는 계측·SEO까지 —
            프론트엔드부터 AI까지{" "}
            <span className="font-semibold" style={{ color: INK }}>끝에서 끝</span>을 직접 만듭니다.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(13,148,136,0.5)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-6px_rgba(13,148,136,0.6)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488]"
              style={{ background: BRAND, transitionTimingFunction: EASE_OUT_CSS }}
            >
              프로젝트 보기
              <span className="transition-transform duration-200 group-hover:translate-x-[3px]" style={{ transitionTimingFunction: EASE_OUT_CSS }}>→</span>
            </a>
            <a
              href="https://github.com/JJleem"
              className="group relative inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d9488]"
              style={{ color: INK }}
            >
              GitHub
              <span className="transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]" style={{ color: BRAND, transitionTimingFunction: EASE_OUT_CSS }}>↗</span>
              {/* hover 언더라인 — 좌→우 채움 */}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-[1.5px] w-[calc(100%-18px)] origin-left scale-x-0 rounded-full bg-[#0a2540]/25 transition-transform duration-300 group-hover:scale-x-100"
                style={{ transitionTimingFunction: EASE_OUT_CSS }}
              />
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t pt-6 text-[13px] font-medium" style={{ borderColor: "#eaecef", color: SLATE }}>
            {[["LLM","멀티에이전트 · RAG · Eval"],["Web·App·AI","풀스택 범위"],["E2E","기획 → 배포 → 운영"]].map(([k,v]) => (
              <div key={v} className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold tabular-nums" style={{ color: INK }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 우측 HeroAnimation — 구성 동일, parallax·hover lift만 추가 */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center overflow-visible">
          <HeroAnimation reduceMotion={reduce} />
        </div>
      </div>
    </section>
  );
}
