"use client";
/* eslint-disable react-hooks/immutability */
// (프로토타입: useFrame에서 ShaderMaterial uniform.value를 직접 갱신하는 게 r3f 정석 →
//  React Compiler 불변성 규칙과 충돌하므로 이 파일 한정 비활성화)

// PROTOTYPE — wipe me. VariantF = Stripe Sessions 기법 이식(three.js 단일 셰이더).
// 스크럽 비디오/이미지 갈아끼우기 ❌ → 한 장의 면을 셰이더로 "탈피"시킴.
//  · 스크롤 = 탈피 진행도(uProgress, 0=멀쩡 1=다 벗겨짐)
//  · 절차적 simplex 노이즈로 낡은 허물을 불규칙 톱니 dissolve
//  · 그 아래 하늘색 이리데센트 비늘(절차 생성) 드러남, 경계엔 가루/광택 rim
//  · 텍스처 없으면 절차 폴백, /assets/hero/molt-old|fresh.png 있으면 자동 사용
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const OLD_IDENTITY = "프론트엔드 개발자";
const NEW_IDENTITY = "AI를 부려 제품을 끝까지 만드는 엔지니어";
const BG = "#f7f4ef"; // 따뜻한 라이트 캔버스

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform vec3  uBg;
  uniform sampler2D uOld;
  uniform sampler2D uFresh;
  uniform float uHasOld;
  uniform float uHasFresh;

  // --- Ashima simplex noise 2D ---
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

  // 비늘 돔 높이 + 셀-로컬 좌표(가짜 노멀용)
  float scaleHeight(vec2 uv, out vec2 local){
    vec2 g = uv * vec2(11.0, 16.0);
    float row = floor(g.y);
    g.x += mod(row, 2.0) * 0.5;
    vec2 f = fract(g) - 0.5;
    local = f;
    float d = length(f * vec2(1.0, 1.18));
    return smoothstep(0.62, 0.0, d);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 auv = (uv - 0.5) * vec2(aspect, 1.0); // aspect 보정 좌표

    // --- 탈피 필드: 위가 먼저 벗겨지고, 노이즈로 톱니 경계 ---
    float n = fbm(uv * 3.2 + vec2(0.0, uTime * 0.025));
    float vert = 1.0 - uv.y;                 // 위쪽=1
    float thr = vert * 0.85 + n * 0.5;       // 벗겨지는 임계값
    float edge = uProgress * 1.7 - 0.35 - thr;
    float reveal = smoothstep(0.0, 0.05, edge);                       // 0 허물 / 1 비늘
    float rim = smoothstep(0.0, 0.035, edge) * (1.0 - smoothstep(0.035, 0.13, edge));

    // --- 싱싱한 하늘색 이리데센트 비늘 ---
    vec2 local;
    float h = scaleHeight(uv * vec2(aspect, 1.0) * 1.0, local);
    vec3 nrm = normalize(vec3(local * -2.2 * h, 1.0));
    float diff = clamp(dot(nrm, normalize(vec3(0.4, 0.6, 0.85))), 0.0, 1.0);
    float fres = pow(1.0 - max(nrm.z, 0.0), 2.0);
    vec3 sky = vec3(0.42, 0.72, 0.96);                                 // 하늘색 주도
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 0.6 + vec3(0.0, 0.33, 0.66)) + uTime * 0.15);
    vec3 freshCol = sky * (0.35 + 0.78 * diff) + irid * (0.16 + 0.22 * fres);
    freshCol += vec3(0.0, 0.05, 0.02) * h;                             // 초록 살짝(부가)
    if (uHasFresh > 0.5) freshCol = mix(freshCol, texture2D(uFresh, uv).rgb, 0.75);

    // --- 낡은 마른 허물 ---
    float crack = fbm(uv * 7.0) * 0.5 + 0.5;
    vec3 oldCol = mix(vec3(0.82, 0.80, 0.76), vec3(0.63, 0.61, 0.58), crack);
    oldCol *= 0.92 + 0.08 * fbm(uv * 24.0);
    if (uHasOld > 0.5) oldCol = texture2D(uOld, uv).rgb;

    vec3 col = mix(oldCol, freshCol, reveal);
    col += rim * vec3(1.0, 0.95, 0.88) * 0.85;                         // 경계 가루/광택

    // 가장자리는 배경색으로 페이드(중앙에 형체가 모이게)
    float vig = smoothstep(1.15, 0.4, length(auv));
    col = mix(uBg, col, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function MoltMaterial({ progress }: { progress: { current: number } }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBg: { value: new THREE.Color(BG) },
      uOld: { value: null as THREE.Texture | null },
      uFresh: { value: null as THREE.Texture | null },
      uHasOld: { value: 0 },
      uHasFresh: { value: 0 },
    }),
    []
  );

  // 실제 텍스처 있으면 자동 사용(없으면 절차 폴백 유지)
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
        () => {} // 404 → 폴백 유지
      );
    };
    tryLoad("/assets/hero/molt-old.png", "uHasOld", "uOld");
    tryLoad("/assets/hero/molt-fresh.png", "uHasFresh", "uFresh");
  }, [uniforms]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uProgress.value += (progress.current - uniforms.uProgress.value) * 0.08; // 부드럽게 추종
    uniforms.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  });

  return (
    <shaderMaterial
      ref={matRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  );
}

export default function VariantF() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  const oldOpacity = useTransform(scrollYProgress, [0, 0.28, 0.5], [1, 1, 0]);
  const newOpacity = useTransform(scrollYProgress, [0.52, 0.8, 1], [0, 0.7, 1]);
  const newY = useTransform(scrollYProgress, [0.52, 1], [16, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);

  if (reduced) {
    return (
      <section className="relative flex h-screen w-full items-center justify-center" style={{ background: BG }}>
        <span className="absolute left-6 top-6 text-sm font-medium tracking-tight text-[#1c1917]/80">molt</span>
        <div className="max-w-4xl px-6 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#1c1917] sm:text-5xl md:text-6xl">{NEW_IDENTITY}</h1>
          <p className="mt-8 text-sm tracking-widest text-[#1c1917]/45">임재준</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: "280vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: BG }}>
        <span className="absolute left-6 top-6 z-40 text-sm font-medium tracking-tight text-[#1c1917]/80">molt</span>

        <div className="absolute inset-0 z-10">
          {mounted && (
            <Canvas gl={{ antialias: true }} dpr={[1, 2]} style={{ background: BG }}>
              <ScreenQuad>
                <MoltMaterial progress={progress} />
              </ScreenQuad>
            </Canvas>
          )}
        </div>

        {/* 옛 정체성 — 허물이 벗겨지며 사라짐 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{ opacity: oldOpacity }}
        >
          <h2
            className="text-center text-5xl font-semibold tracking-tight text-[#1c1917] sm:text-7xl md:text-8xl"
            style={{ textShadow: "0 2px 24px rgba(247,244,239,0.7)" }}
          >
            {OLD_IDENTITY}
          </h2>
        </motion.div>

        {/* 현재 정체성 — 드러남 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          style={{ opacity: newOpacity, y: newY }}
        >
          <h1
            className="max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-[#1c1917] sm:text-5xl md:text-6xl"
            style={{ textShadow: "0 2px 24px rgba(247,244,239,0.7)" }}
          >
            {NEW_IDENTITY}
          </h1>
          <motion.p className="mt-8 text-sm tracking-widest text-[#1c1917]/45" style={{ opacity: nameOpacity }}>
            임재준
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
