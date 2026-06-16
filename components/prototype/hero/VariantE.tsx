"use client";
/* eslint-disable react-hooks/immutability */
// (프로토타입: r3f는 useFrame에서 지오메트리 attribute를 직접 변형하는 게 정석이라
//  React Compiler 불변성 규칙과 충돌 → 이 파일 한정 비활성화)

// PROTOTYPE — wipe me. VariantE r2 = 단 하나의 "비늘 가죽"이 3D로 말려 벗겨짐(허물).
// 가닥 3개(DNA) ❌ → 비늘 가죽 한 장 ⭕. 비늘 범프맵 + 이리데센스(하늘·초록·파랑 자연 혼합).
// 다크 스테이지(이리데센스 광택은 어두운 배경에서 산다).
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const OLD_IDENTITY = "프론트엔드 개발자";
const NEW_IDENTITY = "AI를 부려 제품을 끝까지 만드는 엔지니어";
const BG = "#0d0f13"; // 다크 스테이지

// 뱀 비늘 범프 텍스처 — 캔버스에 겹친 둥근 비늘을 그려 relief로 사용
function makeScaleTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const x = c.getContext("2d");
  if (!x) return null;
  x.fillStyle = "#6a6a6a";
  x.fillRect(0, 0, 512, 512);
  const cols = 14;
  const rows = 18;
  const cw = 512 / cols;
  const rh = 512 / rows;
  for (let r = -1; r <= rows; r++) {
    for (let i = -1; i <= cols; i++) {
      const ox = i * cw + (r % 2 ? cw / 2 : 0);
      const oy = r * rh + rh / 2;
      const g = x.createRadialGradient(ox, oy - rh * 0.15, 1, ox, oy, cw * 0.75);
      g.addColorStop(0, "#f0f0f0");
      g.addColorStop(0.7, "#9a9a9a");
      g.addColorStop(1, "#3c3c3c");
      x.fillStyle = g;
      x.beginPath();
      x.ellipse(ox, oy, cw * 0.62, rh * 0.72, 0, 0, Math.PI * 2);
      x.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.4, 3);
  return tex;
}

// 한 장의 비늘 가죽 — 위에서부터 원통으로 말려 벗겨진다.
function Skin({ progress }: { progress: { current: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const W = 18;
  const H = 11;
  const SX = 70;
  const SY = 90;

  const geom = useMemo(() => new THREE.PlaneGeometry(W, H, SX, SY), []);
  const base = useMemo(() => Float32Array.from(geom.attributes.position.array), [geom]);
  const scaleTex = useMemo(() => makeScaleTexture(), []);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const p = progress.current;
    const pos = geom.attributes.position.array as Float32Array;
    const top = H / 2;
    const front = top - p * (H * 1.25); // 말림 경계: 위→아래로 내려감
    const R = 0.9; // 말리는 반지름

    for (let i = 0; i < pos.length; i += 3) {
      const ox = base[i];
      const oy = base[i + 1];
      const oz = base[i + 2];
      if (oy > front) {
        const d = oy - front; // 경계 위로의 거리
        const ang = d / R;
        pos[i] = ox;
        pos[i + 1] = front + R * Math.sin(ang);
        pos[i + 2] = oz + R * (1 - Math.cos(ang));
      } else {
        pos[i] = ox;
        pos[i + 1] = oy;
        pos[i + 2] = oz;
      }
    }
    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    // 다 벗겨질수록 살짝 뒤로/위로 빠짐
    m.position.y = p * 1.2;
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-0.12, 0, 0]}>
      <meshPhysicalMaterial
        color={"#7fb0c4"}
        metalness={0.35}
        roughness={0.32}
        bumpMap={scaleTex ?? undefined}
        bumpScale={0.55}
        iridescence={1}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[120, 520]}
        clearcoat={1}
        clearcoatRoughness={0.18}
        envMapIntensity={1.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene({ progress }: { progress: { current: number } }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 6]} intensity={1.2} />
      <Skin progress={progress} />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, 5]} scale={[10, 5, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-6, -2, 3]} scale={[6, 6, 1]} color="#9fd6ff" />
        <Lightformer intensity={1.8} position={[6, 0, 3]} scale={[6, 6, 1]} color="#a9f0c8" />
      </Environment>
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function VariantE() {
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

  const oldOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0]);
  const newOpacity = useTransform(scrollYProgress, [0.55, 0.82, 1], [0, 0.6, 1]);
  const newY = useTransform(scrollYProgress, [0.55, 1], [18, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);

  if (reduced) {
    return (
      <section className="relative flex h-screen w-full items-center justify-center" style={{ background: BG }}>
        <span className="absolute left-6 top-6 text-sm font-medium tracking-tight text-white/90">molt</span>
        <div className="max-w-4xl px-6 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">{NEW_IDENTITY}</h1>
          <p className="mt-8 text-sm tracking-widest text-white/50">임재준</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: "260vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: BG }}>
        <span className="absolute left-6 top-6 z-40 text-sm font-medium tracking-tight text-white/90">molt</span>

        <div className="absolute inset-0 z-10">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 11], fov: 45 }} gl={{ antialias: true }} dpr={[1, 2]}>
              <color attach="background" args={[BG]} />
              <Scene progress={progress} />
            </Canvas>
          )}
        </div>

        {/* 옛 정체성 — 가죽이 벗겨지며 사라짐 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{ opacity: oldOpacity }}
        >
          <h2 className="text-center text-5xl font-semibold tracking-tight text-white/95 sm:text-7xl md:text-8xl">{OLD_IDENTITY}</h2>
        </motion.div>

        {/* 현재 정체성 — 드러남 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          style={{ opacity: newOpacity, y: newY }}
        >
          <h1 className="max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">{NEW_IDENTITY}</h1>
          <motion.p className="mt-8 text-sm tracking-widest text-white/50" style={{ opacity: nameOpacity }}>임재준</motion.p>
        </motion.div>
      </div>
    </section>
  );
}
