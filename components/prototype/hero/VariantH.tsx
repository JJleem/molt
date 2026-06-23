"use client";

import { useEffect, useRef, useState } from "react";
import GradientCanvas from "@/components/sections/GradientCanvas";

const INK    = "#0a2540";
const SLATE  = "#425466";
const BRAND  = "#0d9488";
const SPRING = "cubic-bezier(0.68,-0.55,0.27,1.55)";
const FLIP_E = "cubic-bezier(0.68,-0.25,0.27,1.0)";
const DUR_OUT = 750;
const DUR_IN  = 900;
const HOLD_MS = 3200;

type GroupName = "mobileWallet" | "contact" | "shippingDetails" | "paymentDetails";

const CARD_GROUPS: GroupName[][] = [
  ["mobileWallet", "contact", "shippingDetails", "paymentDetails"],
  ["mobileWallet", "contact", "paymentDetails"],
  ["contact", "shippingDetails", "paymentDetails"],
];

function rowStyle(animKey: number, i: number): React.CSSProperties {
  return {
    animationName: animKey > 0 ? "row-slide-in" : "none",
    animationDuration: "0.38s",
    animationTimingFunction: "cubic-bezier(0.65,0.05,0.36,1)",
    animationFillMode: "backwards",
    animationDelay: `${430 + i * 110}ms`,
  };
}

/* ─── Card 0: BabyBlue (AI Pipeline) ─────────────────────────────────────── */
function BabyBlueCard({ ak }: { ak: number }) {
  return (
    <div style={{ background: "#e3f5ff", borderRadius: 16, width: 400, overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.09),0 28px 56px rgba(0,0,0,0.12)" }}>
      <div style={{ padding: "26px 22px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:BRAND, borderRadius:10,
            display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14, fontWeight:800 }}>
            M
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:INK, lineHeight:1.2 }}>AI Blog Pipeline</div>
            <div style={{ fontSize:11, color:BRAND, fontWeight:600, marginTop:2 }}>E2E AI</div>
          </div>
        </div>
        <span style={{ fontSize:10, fontWeight:700, background:"#dcfce7", color:"#059669",
          borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:6, height:6, background:"#10b981", borderRadius:"50%", display:"inline-block" }}/>
          Running
        </span>
      </div>

      <div style={{ margin:"20px 22px", background:"white", borderRadius:12, padding:"18px 18px" }}>
        <div style={{ fontSize:9, color:"#9ca3af", fontWeight:700, letterSpacing:"0.08em",
          textTransform:"uppercase", marginBottom:14 }}>Pipeline Flow</div>
        <div style={{ display:"flex", alignItems:"center" }}>
          {(["🔍 Crawl","✍️ AI Write","🚀 Publish"] as const).map((s, i) => (
            <div key={s} style={{ display:"flex", alignItems:"center", flex: i<2 ? "0 0 auto" : 1 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:26, marginBottom:6 }}>{s.split(" ")[0]}</div>
                <div style={{ fontSize:11, fontWeight:600,
                  color:["#0d9488","#0891b2","#6366f1"][i] }}>{s.split(" ")[1]}</div>
              </div>
              {i < 2 && (
                <div style={{ padding:"0 10px", color:"#cbd5e1", fontSize:16, marginBottom:10 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div key={ak} style={{ padding:"0 22px" }}>
        {([
          { label:"Stack",    value:"Next.js · LangGraph · Vercel" },
          { label:"Agents",   value:"11 Active" },
          { label:"Schedule", value:"24/7 Auto-Publish" },
        ] as const).map(({ label, value }, i) => (
          <div key={label} style={{
            ...rowStyle(ak, i),
            display:"flex", justifyContent:"space-between", alignItems:"center",
            background:"rgba(255,255,255,0.65)", borderRadius:10,
            padding:"13px 16px", marginBottom:10,
          }}>
            <span style={{ fontSize:11, color:SLATE, fontWeight:500 }}>{label}</span>
            <span style={{ fontSize:12, color:INK, fontWeight:600 }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:"14px 22px 28px" }}>
        <button style={{ width:"100%", background:BRAND, color:"white", border:"none",
          borderRadius:10, padding:"14px 0", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          파이프라인 보기 →
        </button>
      </div>
    </div>
  );
}

/* ─── Card 1: Lakers/Purple (C-HUB) ──────────────────────────────────────── */
function LakersCard({ ak }: { ak: number }) {
  return (
    <div style={{ background:"#6366f1", borderRadius:16, width:360, overflow:"hidden",
      boxShadow:"0 2px 4px rgba(0,0,0,0.08),0 8px 24px rgba(99,102,241,0.35),0 28px 56px rgba(0,0,0,0.16)" }}>
      <div style={{ padding:"26px 24px 18px", borderBottom:"1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:10, fontWeight:700, background:"rgba(255,255,255,0.2)",
            color:"white", borderRadius:20, padding:"4px 12px" }}>GS 1등급 인증</span>
          <span style={{ fontSize:10, fontWeight:700, background:"#dcfce7", color:"#059669",
            borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:6, height:6, background:"#10b981", borderRadius:"50%", display:"inline-block" }}/>
            Live
          </span>
        </div>
        <div style={{ marginTop:16, color:"white", fontSize:22, fontWeight:800, lineHeight:1.2 }}>
          C-HUB 2.0
        </div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginTop:6 }}>
          공공기관 통합 업무 플랫폼
        </div>
      </div>

      <div style={{ display:"flex", padding:"20px 24px", gap:12 }}>
        {([
          { label:"사용자", value:"500+" },
          { label:"인증",   value:"GS" },
          { label:"배포",   value:"On-prem" },
        ] as const).map(({ label, value }) => (
          <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 10px" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>{label}</div>
            <div style={{ fontSize:16, fontWeight:800, color:"white", marginTop:4 }}>{value}</div>
          </div>
        ))}
      </div>

      <div key={ak} style={{ padding:"0 24px" }}>
        {([
          "✓  실시간 협업 (WebSocket)",
          "✓  전자결재 워크플로우",
          "✓  공지·일정·문서 통합관리",
          "✓  React · Node · PostgreSQL",
        ] as const).map((text, i) => (
          <div key={text} style={{
            ...rowStyle(ak, i),
            fontSize:12, color:"rgba(255,255,255,0.85)", fontWeight:500,
            padding:"12px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}>
            {text}
          </div>
        ))}
      </div>

      <div style={{ padding:"20px 24px 28px" }}>
        <button style={{ width:"100%", background:"white", color:"#6366f1", border:"none",
          borderRadius:10, padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          프로젝트 보기 →
        </button>
      </div>
    </div>
  );
}

/* ─── Card 2: Tron/Dark (Research Engine) ────────────────────────────────── */
function TronCard({ ak }: { ak: number }) {
  return (
    <div style={{ background:"#0a2540", borderRadius:16, width:382, overflow:"hidden",
      boxShadow:"0 2px 4px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.3),0 28px 56px rgba(0,0,0,0.2)" }}>
      <div style={{ padding:"26px 22px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:10, fontWeight:700, color:BRAND, letterSpacing:"0.1em",
            textTransform:"uppercase" }}>Multi-Agent RAG</div>
          <span style={{ fontSize:10, fontWeight:700, background:"rgba(139,92,246,0.2)", color:"#a78bfa",
            borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:6, height:6, background:"#8b5cf6", borderRadius:"50%", display:"inline-block" }}/>
            Active
          </span>
        </div>
        <div style={{ marginTop:12, color:"white", fontSize:20, fontWeight:800 }}>Research Engine</div>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:5 }}>
          Python · LangGraph · Vector DB
        </div>
      </div>

      <div style={{ margin:"18px 22px", background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"16px 16px" }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", fontWeight:700,
          letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Query</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontStyle:"italic", lineHeight:1.5 }}>
          "최신 AI 트렌드 시장 분석..."
        </div>
      </div>

      <div key={ak} style={{ padding:"0 22px" }}>
        {([
          { step:"01", label:"Vector Search", color:BRAND },
          { step:"02", label:"Reranking",     color:"#0891b2" },
          { step:"03", label:"GPT-4o 생성",   color:"#8b5cf6" },
        ] as const).map(({ step, label, color }, i) => (
          <div key={step} style={{
            ...rowStyle(ak, i),
            display:"flex", alignItems:"center", gap:10,
            padding:"13px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <span style={{ fontSize:10, fontWeight:700, color, minWidth:20 }}>{step}</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:500 }}>{label}</span>
            <span style={{ marginLeft:"auto", fontSize:10, color:"rgba(255,255,255,0.3)" }}>→</span>
          </div>
        ))}
      </div>

      <div style={{ margin:"16px 22px", background:"rgba(13,148,136,0.1)", borderRadius:10,
        padding:"14px 16px", border:"1px solid rgba(13,148,136,0.2)" }}>
        <span style={{ fontSize:11, color:BRAND, fontWeight:600 }}>✓ Report generated</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginLeft:8 }}>2.3s</span>
      </div>

      <div style={{ padding:"4px 22px 28px" }}>
        <button style={{ width:"100%", background:BRAND, color:"white", border:"none",
          borderRadius:10, padding:"14px 0", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          에이전트 보기 →
        </button>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   HeroAnimation — 3 cards always in DOM, simultaneous crossfade
   Z 레이어: SVG(z=3) < GradientCanvas(z=5) < DemoCard(z=10)
   ───────────────────────────────────────────────────────────────────────────── */
function HeroAnimation() {
  const [idx, setIdx]       = useState(0);
  const [rowAnimKeys, setRowAnimKeys] = useState<[number, number, number]>([0, 0, 0]);
  const idxRef = useRef(0);

  const [frameOn, setFrameOn] = useState(false);
  const [svgOn,   setSvgOn]   = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFrameOn(true), 260);
    const t2 = setTimeout(() => setSvgOn(true),   460);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const mobileWalletRef = useRef<SVGGElement>(null);
  const contactRef      = useRef<SVGGElement>(null);
  const shippingRef     = useRef<SVGGElement>(null);
  const paymentRef      = useRef<SVGGElement>(null);

  // 6 refs — 3 wrap (opacity+scale) + 3 card (rotateY)
  const wrap0 = useRef<HTMLDivElement>(null);
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const card0 = useRef<HTMLDivElement>(null);
  const card1 = useRef<HTMLDivElement>(null);
  const card2 = useRef<HTMLDivElement>(null);
  const wrapRefs = [wrap0, wrap1, wrap2];
  const cardRefs = [card0, card1, card2];

  const dr = (perim: number, delay: number): React.CSSProperties => ({
    strokeDasharray: perim,
    strokeDashoffset: svgOn ? 0 : perim,
    transition: svgOn ? `stroke-dashoffset 0.75s ease ${delay}s` : "none",
  });
  const fd = (delay: number): React.CSSProperties => ({
    opacity: svgOn ? 1 : 0,
    transition: svgOn ? `opacity 0.4s ease ${delay}s` : "none",
  });

  function groupEl(name: GroupName): SVGGElement | null {
    if (name === "mobileWallet")    return mobileWalletRef.current;
    if (name === "contact")         return contactRef.current;
    if (name === "shippingDetails") return shippingRef.current;
    if (name === "paymentDetails")  return paymentRef.current;
    return null;
  }

  useEffect(() => {
    const w0 = wrap0.current;
    const k0 = card0.current;
    if (!w0 || !k0) return;

    // intro: 최종 상태(opacity:1) 미리 커밋 → 애니메이션 종료 후 자연 복귀, onfinish 불필요
    w0.style.opacity = "1";
    w0.animate(
      [{ opacity: 0, transform: "scale(0.82)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: 1100, easing: SPRING, delay: 1850, fill: "backwards" }
    );
    k0.animate(
      [{ transform: "rotateY(0deg)" }, { transform: "rotateY(25deg)" }, { transform: "rotateY(0deg)" }],
      { duration: 1100, easing: FLIP_E, delay: 1850 }
    );

    let loopId: ReturnType<typeof setInterval>;
    const startT = setTimeout(() => {
      loopId = setInterval(() => {
        const cur = idxRef.current;
        const nxt = (cur + 1) % 3;
        const curG = CARD_GROUPS[cur];
        const nxtG = CARD_GROUPS[nxt];
        const leaving  = curG.filter(g => !nxtG.includes(g));
        const entering = nxtG.filter(g => !curG.includes(g));

        // 이전 사이클 잔류 애니메이션 정리
        for (let i = 0; i < 3; i++) {
          wrapRefs[i].current?.getAnimations().forEach(a => a.cancel());
        }

        // SVG: fade out leaving groups immediately
        leaving.forEach(name => {
          const el = groupEl(name);
          if (!el) return;
          el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
          el.style.opacity    = "0";
          el.style.transform  = "scale(0.88) translateY(-6px)";
        });

        const wCur = wrapRefs[cur].current;
        const kCur = cardRefs[cur].current;
        const wNxt = wrapRefs[nxt].current;
        const kNxt = cardRefs[nxt].current;

        // 핵심: 애니메이션 시작 전 최종 inline style 미리 커밋
        // WAAPI는 재생 중에만 inline을 오버라이드, fill:none(기본)으로 끝나면 여기 값으로 복귀
        // → onfinish / fill:forwards / cancel 구조 제거, 불발 버그 원천 차단
        if (wCur) { wCur.style.opacity = "0"; wCur.style.transform = ""; }
        if (wNxt) { wNxt.style.opacity = "1"; wNxt.style.transform = ""; }

        // OUT + IN 동시 시작 (fill 없음 = 기본 fill:none)
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
        setRowAnimKeys(prev => {
          const next = [...prev] as [number, number, number];
          next[nxt] = prev[nxt] + 1;
          return next;
        });

        // SVG entering groups: onfinish 대신 setTimeout
        if (entering.length > 0) {
          setTimeout(() => {
            entering.forEach((name, i) => {
              const el = groupEl(name);
              if (!el) return;
              el.style.transition = "none";
              el.style.opacity    = "0";
              el.style.transform  = "scale(0.88) translateY(8px)";
              requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.transition = `opacity 0.4s ease ${i * 0.13}s, transform 0.4s ease ${i * 0.13}s`;
                el.style.opacity    = "1";
                el.style.transform  = "scale(1) translateY(0px)";
              }));
            });
          }, DUR_IN);
        }
      }, HOLD_MS);
    }, 1850 + 1100 + 600);

    return () => { clearTimeout(startT); clearInterval(loopId); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // 루트: position:relative, z-index 없음 → stacking context 미생성
    <div className="relative select-none" style={{ width: 540, height: 620, flexShrink: 0 }}>

      {/* ── SVG 프레임: z=3 (GradientCanvas z=5 아래) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          opacity: frameOn ? 1 : 0,
          transform: frameOn ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.95s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.3s",
        }}
      >
        <svg
          width="540" height="600" viewBox="0 0 540 600" fill="none"
          className="absolute top-0 left-0 pointer-events-none"
        >
          <rect x="0.5" y="0.5" width="539" height="599" rx="7.5" fill="#F6F9FB" stroke="#AAB7C4" style={fd(0)}/>
          <path d="M0 21.5H540" stroke="#AAB7C4" style={dr(540, 0.15)}/>
          <circle cx="13" cy="11" r="4" fill="#CFD7DF" style={fd(0.25)}/>
          <circle cx="27" cy="11" r="4" fill="#CFD7DF" style={fd(0.3)}/>
          <circle cx="41" cy="11" r="4" fill="#CFD7DF" style={fd(0.35)}/>
          <path d="M270 21.5V598.5" stroke="#CFD7DF" style={dr(577, 0.3)}/>
          <path d="M24 54.5H68" stroke="#CFD7DF" strokeLinecap="round" style={fd(0.3)}/>
          <text x="290" y="53" fill="#ABB5C5" fontSize="10" fontFamily="system-ui,sans-serif" style={fd(0.5)}>Order summary</text>
          <path d="M288 68H412" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(0.7)}/>
          <path d="M288 76H364" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(0.85)}/>

          <g ref={mobileWalletRef}>
            <rect x="12.5" y="93.5" width="165" height="53" rx="7.5" stroke="#CFD7DF" style={dr(436, 0.8)}/>
            <text x="26" y="114" fill="#ABB5C5" fontSize="9" fontFamily="system-ui,sans-serif" style={fd(1.5)}>Mobile wallet</text>
            <path d="M26 129H118" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(1.6)}/>
          </g>

          <g ref={contactRef}>
            <rect x="12.5" y="163.5" width="165" height="53" rx="7.5" stroke="#CFD7DF" style={dr(436, 1.6)}/>
            <text x="26" y="184" fill="#ABB5C5" fontSize="9" fontFamily="system-ui,sans-serif" style={fd(2.3)}>Contact</text>
            <path d="M26 199H118" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(2.4)}/>
          </g>

          <g ref={shippingRef}>
            <rect x="12.5" y="233.5" width="165" height="73" rx="7.5" stroke="#CFD7DF" style={dr(476, 2.4)}/>
            <text x="26" y="252" fill="#ABB5C5" fontSize="9" fontFamily="system-ui,sans-serif" style={fd(3.1)}>Shipping details</text>
            <path d="M26 269H118" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(3.2)}/>
            <path d="M26 277H102" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(3.3)}/>
          </g>

          <g ref={paymentRef}>
            <rect x="12.5" y="323.5" width="165" height="73" rx="7.5" stroke="#CFD7DF" style={dr(476, 3.2)}/>
            <text x="26" y="342" fill="#ABB5C5" fontSize="9" fontFamily="system-ui,sans-serif" style={fd(3.9)}>Payment details</text>
            <path d="M26 358H118" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(4.0)}/>
            <path d="M26 366H118" stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(4.1)}/>
            <path d="M26 374H62"  stroke="#C4CCD8" strokeWidth="4" strokeLinecap="round" style={fd(4.2)}/>
          </g>
        </svg>
      </div>

      {/* ── DemoCard: z=10 — 3장 항상 DOM에, 동시 crossfade ── */}
      <div style={{ position: "absolute", right: -20, top: 180, zIndex: 10 }}>
        <div style={{ position: "relative", width: 400, height: 560 }}>

          {/* Card 0: BabyBlue */}
          <div style={{ position: "absolute", right: 0, top: 0, perspective: "1200px" }}>
            <div ref={wrap0} style={{ opacity: 0, transformStyle: "preserve-3d" }}>
              <div ref={card0}><BabyBlueCard ak={rowAnimKeys[0]} /></div>
            </div>
          </div>

          {/* Card 1: Lakers */}
          <div style={{ position: "absolute", right: 0, top: 0, perspective: "1200px" }}>
            <div ref={wrap1} style={{ opacity: 0, transformStyle: "preserve-3d" }}>
              <div ref={card1}><LakersCard ak={rowAnimKeys[1]} /></div>
            </div>
          </div>

          {/* Card 2: Tron */}
          <div style={{ position: "absolute", right: 0, top: 0, perspective: "1200px" }}>
            <div ref={wrap2} style={{ opacity: 0, transformStyle: "preserve-3d" }}>
              <div ref={card2}><TronCard ak={rowAnimKeys[2]} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   히어로 메인
   ───────────────────────────────────────────────────────────────────────────── */
export default function VariantH() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full bg-transparent"
      style={{ color: INK }}
    >
      <GradientCanvas />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[7] w-full bg-white/90 lg:w-[58%] lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:to-transparent"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 90%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1140px] items-start gap-8 px-6 pt-[100px] pb-16 lg:gap-16">
        {/* 좌측 텍스트 */}
        <div className="relative z-[10] w-full flex-shrink-0 lg:w-[46%]">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND }}/>
            AI Native · Full-Stack Engineer
          </p>
          <h1 className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]" style={{ color: INK }}>
            제품을 <span style={{ color: BRAND }}>끝까지</span><br/>만드는 엔지니어
          </h1>
          <p className="mt-7 max-w-md text-[18px] leading-[1.62] break-keep" style={{ color: SLATE }}>
            화면(FE)부터 그 뒤의 LLM 시스템, 사용자를 들어오게 만드는 계측·SEO까지 —
            프론트엔드부터 AI까지{" "}
            <span className="font-semibold" style={{ color: INK }}>끝에서 끝</span>을 직접 만듭니다.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#work" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(13,148,136,0.5)] transition-transform hover:-translate-y-0.5" style={{ background: BRAND }}>
              프로젝트 보기<span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a href="https://github.com/JJleem" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold" style={{ color: INK }}>
              GitHub<span className="transition-transform group-hover:translate-x-0.5" style={{ color: BRAND }}>↗</span>
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t pt-6 text-[13px] font-medium" style={{ borderColor: "#eaecef", color: SLATE }}>
            {[["11","AI 에이전트 운영"],["24/7","자동 발행 파이프라인"],["E2E","FE → LLM → 계측"]].map(([k,v]) => (
              <div key={v} className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold tabular-nums" style={{ color: INK }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 HeroAnimation */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center overflow-visible">
          <HeroAnimation />
        </div>
      </div>
    </section>
  );
}
