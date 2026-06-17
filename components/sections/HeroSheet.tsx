"use client";
/* eslint-disable react-hooks/immutability */
// 히어로 그라데이션 시트 — three.js 단일 캔버스 1장이 히어로 하단~피처 상단을 관통(이음매 없음).
//  · 또렷한 우상향 대각 LINE 두 줄로 잘린 band(clip-path와 동일 형상)를 셰이더가 직접 그림.
//  · 가장자리가 아주 미세하게 일렁이고(undulation), 그라데이션이 천천히 흐름 → 애플식 고급 모션.
//  · reduced-motion / 모바일 = 정적 CSS 폴백(동일 형상).
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";

const SHEET_CSS =
  "linear-gradient(101deg, #57c2d6 0%, #635bff 46%, #8f69eb 78%, #d98fc6 100%)";
const SHEET_CLIP = "polygon(0 20%, 100% 0, 100% 70%, 0 95%)";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;          // ScreenQuad: clip-space → uv (y up: 0 bottom, 1 top)
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

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
    for (int i = 0; i < 4; i++){ s += a * snoise(p); p *= 2.0; a *= 0.5; }
    return s;
  }

  void main(){
    vec2 uv = vUv;
    float x = uv.x;
    float t = uTime * 0.16;                 // 느리게(애플식)

    // 평행한 우상향 대각 두 모서리(위/아래) + 아주 미세한 일렁임
    float slope = 0.22;
    float wobbleTop = 0.018 * sin(x * 5.0 + t) + 0.011 * sin(x * 2.3 - t * 0.7);
    float wobbleBot = 0.016 * sin(x * 4.2 - t * 0.9 + 1.5) + 0.009 * sin(x * 2.0 + t * 0.5);
    float topEdge = 0.80 + slope * x + wobbleTop;
    float botEdge = 0.06 + slope * x + wobbleBot;

    float feather = 0.012;                   // 선은 또렷하게(작은 페더)
    float band = smoothstep(botEdge - feather, botEdge + feather, uv.y)
               * smoothstep(topEdge + feather, topEdge - feather, uv.y);
    if (band < 0.001) { gl_FragColor = vec4(0.0); return; }

    // 그라데이션(teal→blurple→violet→rose) + 천천히 흐르는 드리프트
    float drift = 0.07 * fbm(vec2(x * 1.4 + t * 0.5, uv.y * 1.2 - t * 0.3));
    float gg = clamp(x + drift, 0.0, 1.0);
    vec3 c1 = vec3(0.34, 0.76, 0.84);
    vec3 c2 = vec3(0.39, 0.36, 1.00);
    vec3 c3 = vec3(0.56, 0.41, 0.92);
    vec3 c4 = vec3(0.85, 0.56, 0.78);
    vec3 col = mix(c1, c2, smoothstep(0.0, 0.46, gg));
    col = mix(col, c3, smoothstep(0.46, 0.78, gg));
    col = mix(col, c4, smoothstep(0.78, 1.0, gg));

    // 사선을 가로질러 천천히 흐르는 광택(일렁) — 아주 은은하게
    float sheen = 0.05 * sin((x * 3.0 - uv.y * 1.6) * 3.1416 + t * 1.1);
    col += sheen;

    // 윗 모서리 소프트 글로우
    float glow = smoothstep(topEdge, topEdge - 0.16, uv.y) * band;
    col += glow * vec3(0.10, 0.09, 0.20);

    gl_FragColor = vec4(col, band * 0.96);
  }
`;

function SheetMaterial() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } }),
    []
  );
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  });
  return (
    <shaderMaterial
      ref={matRef}
      vertexShader={vert}
      fragmentShader={frag}
      uniforms={uniforms}
      transparent
      depthWrite={false}
    />
  );
}

export default function HeroSheet() {
  const [mode, setMode] = useState<"pending" | "canvas" | "lite">("pending");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(mq.matches || window.innerWidth < 768 ? "lite" : "canvas");
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => {
      mq.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-0"
      style={{ top: "38vh", height: "100vh" }}
    >
      {mode === "canvas" ? (
        <Canvas
          gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
          dpr={[1, 2]}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          style={{ background: "transparent" }}
        >
          <ScreenQuad>
            <SheetMaterial />
          </ScreenQuad>
        </Canvas>
      ) : mode === "lite" ? (
        <div className="absolute inset-0" style={{ background: SHEET_CSS, clipPath: SHEET_CLIP }} />
      ) : null}
    </div>
  );
}
