"use client";
/* eslint-disable react-hooks/immutability */
// (useFrame에서 ShaderMaterial uniform.value 직접 갱신 — r3f 정석이라 이 파일 한정 비활성화)

// PROTOTYPE — VariantG = Stripe 홈페이지의 "가로지르는 리본"을, 그 리본 자체가
// 나의 탈피(molt)인 three.js로. 풀블리드 캔버스에 대각선으로 흐르는 리본 1~2가닥:
//  · 리본 안에서 허물(어두운 husk) → cyan/이리데센트 비늘로 탈피 전선이 흐름
//  · 리본 바깥은 투명 → 흰 페이지가 비침 (Stripe식 화이트 + 컬러 리본)
//  · 가장자리는 cyan→violet 컬러 글로우, 좌측 카피는 화이트 스크림 위에서 가독
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";

const INK = "#0a2540"; // Stripe navy ink
const SLATE = "#425466"; // Stripe body slate
const BLURPLE = "#635bff"; // Stripe signature accent

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // ScreenQuad는 uv 어트리뷰트를 안 넘김 → clip-space position에서 직접 유도.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform sampler2D uOld;
  uniform sampler2D uFresh;
  uniform float uHasOld;
  uniform float uHasFresh;

  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                              + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p){
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ s += a * snoise(p); p *= 2.0; a *= 0.5; }
    return s;
  }
  float scaleHeight(vec2 uv, out vec2 local){
    vec2 g = uv * vec2(13.0, 7.0);          // 리본 길이 방향으로 비늘 더 촘촘
    float row = floor(g.y);
    g.x += mod(row, 2.0) * 0.5;
    vec2 f = fract(g) - 0.5;
    local = f;
    float d = length(f * vec2(1.0, 1.12));
    return smoothstep(0.6, 0.0, d);
  }

  // 한 가닥 리본을 합성해 (color, alpha)를 누적
  void ribbon(vec2 uv, float aspect, float t,
              float yBase, float freq, float phase, float widthBase, float seed,
              inout vec3 col, inout float alpha)
  {
    float x = uv.x;
    // 흐르는 대각선 중심선
    float center = yBase
                 + 0.12 * sin(x * freq + t * 0.22 + phase)
                 + 0.06 * sin(x * (freq*0.45) - t * 0.16 + phase)
                 - (x - 0.5) * 0.10;
    float halfW = widthBase + 0.035 * sin(x * 2.4 - t * 0.2 + phase);
    float edgeN = fbm(vec2(x * 3.0 + seed, t * 0.12 + seed)) * 0.045;
    float d = abs(uv.y - center) - edgeN;
    float rib = smoothstep(halfW, halfW - 0.045, d);
    if (rib <= 0.001 && d > halfW + 0.10) return; // 멀면 스킵

    float across = clamp((uv.y - center) / max(halfW, 1e-3), -1.0, 1.0);
    float along  = x;

    // 탈피 전선: 숨쉬듯 좌우로 스윕
    float front = 0.5 - 0.62 * cos(t * 0.16 + seed);     // -0.12 .. 1.12
    float rn = fbm(vec2(x * 4.5 + seed, across * 2.2 + t * 0.05)) * 0.14;
    float sd = (along - front) + rn;
    float reveal = smoothstep(0.0, 0.14, sd);            // 0 husk → 1 비늘
    float rim = smoothstep(0.0, 0.10, sd) * (1.0 - smoothstep(0.10, 0.30, sd));

    // 비늘 relief
    vec2 sc;
    float hgt = scaleHeight(vec2(along * aspect * 1.4 + seed, across * 0.5 + 0.5), sc);
    vec3 nrm = normalize(vec3(sc * -3.0 * hgt, 1.0));
    vec3 L = normalize(vec3(0.25, 0.55, 0.8));
    float diff = clamp(dot(nrm, L), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-L, nrm), vec3(0.0,0.0,1.0)), 0.0, 1.0), 24.0);
    float fres = pow(1.0 - max(nrm.z, 0.0), 2.5);

    // 리본 따라 흐르는 hue (cyan → blurple → violet) = Stripe식 컬러
    vec3 hueA = vec3(0.20, 0.74, 0.99);
    vec3 hueB = vec3(0.39, 0.36, 1.00);
    vec3 hueC = vec3(0.69, 0.39, 0.97);
    vec3 hue = mix(hueA, hueB, smoothstep(0.0, 0.55, along));
    hue = mix(hue, hueC, smoothstep(0.55, 1.0, along));
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 0.8 + vec3(0.0,0.33,0.66)) + t * 0.2);
    vec3 scales = hue * (0.42 + 0.85 * diff) + irid * (0.16 + 0.30 * fres) + spec * 0.6;
    scales += hue * 0.18 * hgt;
    if (uHasFresh > 0.5) scales = mix(scales, texture2D(uFresh, vec2(along, across*0.5+0.5)).rgb, 0.7);

    // 어두운 마른 허물
    float crack = fbm(vec2(along * 8.0 + seed, across * 3.0)) * 0.5 + 0.5;
    vec3 husk = mix(vec3(0.17, 0.16, 0.19), vec3(0.34, 0.30, 0.29), crack);
    float veins = smoothstep(0.42, 0.52, fbm(vec2(along * 10.0, across * 4.0 + seed)));
    husk = mix(husk, vec3(0.07, 0.07, 0.10), veins * 0.55);
    if (uHasOld > 0.5) husk = texture2D(uOld, vec2(along, across*0.5+0.5)).rgb;

    vec3 body = mix(husk, scales, reveal);
    body += rim * vec3(0.6, 0.85, 1.0) * 0.7;            // 탈피 경계 글로우

    // 컬러 외곽 글로우(리본 밖 halo)
    float glow = (1.0 - smoothstep(halfW, halfW + 0.075, d)) * (1.0 - rib);
    vec3 edgeHue = mix(hueA, hueC, along);

    // 합성: 안쪽은 body, 가장자리는 컬러 halo
    float a = max(rib, glow * 0.45);
    vec3 c = mix(edgeHue, body, rib);
    // over 합성
    col = mix(col, c, a);
    alpha = max(alpha, a);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    float t = uTime;

    vec3 col = vec3(1.0);
    float alpha = 0.0;

    // 뒤(얇고 은은) → 앞(굵고 선명) 순서로 합성
    ribbon(uv, aspect, t, 0.62, 4.6, 2.4, 0.085, 11.0, col, alpha); // 보조 가닥
    ribbon(uv, aspect, t, 0.44, 3.6, 0.0, 0.150, 0.0,  col, alpha); // 메인 가닥

    gl_FragColor = vec4(col, alpha);
  }
`;

function RibbonMaterial() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uOld: { value: null as THREE.Texture | null },
      uFresh: { value: null as THREE.Texture | null },
      uHasOld: { value: 0 },
      uHasFresh: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const tryLoad = (url: string, has: "uHasOld" | "uHasFresh", slot: "uOld" | "uFresh") => {
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          uniforms[slot].value = tex;
          uniforms[has].value = 1;
        },
        undefined,
        () => {}
      );
    };
    tryLoad("/assets/hero/molt-old.png", "uHasOld", "uOld");
    tryLoad("/assets/hero/molt-fresh.png", "uHasFresh", "uFresh");
  }, [uniforms]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  });

  return (
    <shaderMaterial
      ref={matRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      depthWrite={false}
    />
  );
}

function MoltRibbon() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!mounted) return null;
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
      dpr={[1, 2]}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ background: "transparent" }}
    >
      <ScreenQuad>
        <RibbonMaterial />
      </ScreenQuad>
    </Canvas>
  );
}

export default function VariantG() {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  const rise = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 18 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-white" style={{ color: INK }}>
      {/* ── molt 리본: 화면을 가로지르는 three.js (풀블리드) ── */}
      <div className="absolute inset-0 z-0">
        <MoltRibbon />
      </div>

      {/* 좌측 카피 가독용 화이트 스크림 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[52%] bg-gradient-to-r from-white via-white/85 to-transparent" />

      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── 히어로 카피 (리본 위 좌측) ── */}
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1140px] flex-col justify-center px-6 pb-24">
        <div className="max-w-xl">
          <motion.p
            {...rise(0.05)}
            className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: BLURPLE }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLURPLE }} />
            AI Native · Full-Stack Engineer
          </motion.p>

          <motion.div {...rise(0.12)} className="mt-6 flex items-center gap-2.5">
            <span className="text-[15px] font-medium text-[#8a93a6] line-through decoration-[#c7ccd6] decoration-2">
              프론트엔드 개발자
            </span>
            <span className="text-[12px] font-medium text-[#8a93a6]">에서 탈피</span>
          </motion.div>

          <motion.h1
            {...rise(0.18)}
            className="mt-3 text-[42px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]"
            style={{ color: INK }}
          >
            제품을 <span style={{ color: BLURPLE }}>끝까지</span>
            <br />
            만드는 엔지니어
          </motion.h1>

          <motion.p
            {...rise(0.26)}
            className="mt-7 max-w-md text-[18px] leading-[1.62]"
            style={{ color: SLATE }}
          >
            화면(FE)부터 그 뒤의 LLM 시스템, 사용자를 들어오게 만드는 계측·SEO까지 —
            프론트엔드부터 AI까지 <span className="font-semibold text-[#0a2540]">끝에서 끝</span>을 직접 만듭니다.
          </motion.p>

          <motion.div {...rise(0.34)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(99,91,255,0.6)] transition-transform hover:-translate-y-0.5"
              style={{ background: BLURPLE }}
            >
              프로젝트 보기
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="https://github.com/JJleem"
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold"
              style={{ color: INK }}
            >
              GitHub
              <span className="transition-transform group-hover:translate-x-0.5" style={{ color: BLURPLE }}>↗</span>
            </a>
          </motion.div>

          <motion.div
            {...rise(0.44)}
            className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#eaecef] pt-6 text-[13px] font-medium"
            style={{ color: SLATE }}
          >
            {[
              ["11", "AI 에이전트 운영"],
              ["24/7", "자동 발행 파이프라인"],
              ["E2E", "FE → LLM → 계측"],
            ].map(([k, v]) => (
              <div key={v} className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold tabular-nums" style={{ color: INK }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
