"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { useScroll, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

/* 산업용 3D 프린팅 — "얽히고설킨 빈 구(토러스 노트)"가 공중에 떠서,
   스크롤을 내릴수록 한 층씩 적층되며 빌드되는 연출.
   · 클리핑 플레인을 스크롤 진행도(0→1)에 연결 + 매 프레임 damp로 부드럽게
   · 현재 빌드 높이엔 teal 스캔 링(가산혼합 글로우)이 떠오름
   · 포스트프로세싱 없이 투명 캔버스 → 뒤 섹션 배경과 자연스럽게 합쳐짐
   · 바닥/플레이트 없이 Float로 은은히 떠다님(공중 부유) + 느린 자전
   뷰포트 진입 시에만 Canvas를 마운트해 WebGL 컨텍스트 비용을 아낀다. */

const TEAL = "#2dd4bf";
const STEEL = "#aeb9c7"; // 머시닝된 금속 톤(다크 네이비 위에서 또렷하게)

function TangledOrb({ progressRef, reduced }: { progressRef: React.MutableRefObject<number>; reduced: boolean }) {
  const knotRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  const { gl } = useThree();

  // 적층 리빌용 수평 클리핑 플레인 — p.y <= constant 영역만 남는다(아래부터 차오름).
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);

  const { geometry, minY, maxY, ringR } = useMemo(() => {
    // 가는 튜브 + 높은 q → 얽히고설킨 빈 구.
    const geo = new THREE.TorusKnotGeometry(1.0, 0.08, 400, 16, 3, 7);
    geo.computeBoundingBox();
    const b = geo.boundingBox!;
    const horiz = Math.max(b.max.x, -b.min.x, b.max.z, -b.min.z);
    return { geometry: geo, minY: b.min.y, maxY: b.max.y, ringR: horiz * 1.05 };
  }, []);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // 스캔 링 — 가산혼합으로 투명 배경 위에서 자연스럽게 발광(블룸 없이).
  const coreMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(TEAL).multiplyScalar(1.6),
        toneMapped: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: TEAL,
        toneMapped: false,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    if (knotRef.current && !reduced) knotRef.current.rotation.y += delta * 0.16;

    // 스크롤 진행도(0→1)를 damp로 감쇠 → 적층이 부드럽게 따라온다.
    const target = reduced ? 1 : THREE.MathUtils.clamp(progressRef.current * 1.06, 0, 1);
    smooth.current = reduced ? 1 : THREE.MathUtils.damp(smooth.current, target, 4, delta);
    const p = smooth.current;

    const yCut = THREE.MathUtils.lerp(minY - 0.06, maxY + 0.06, p);
    plane.constant = yCut;

    // 비었거나 완성이면 링 숨김 + 양끝에서 페이드인/아웃.
    const active = p > 0.002 && p < 0.998;
    const fade = Math.min(1, Math.min(p, 1 - p) * 8);
    for (const r of [coreRef, glowRef]) {
      if (r.current) {
        r.current.position.y = yCut;
        r.current.visible = active;
      }
    }
    if (coreRef.current) (coreRef.current.material as THREE.MeshBasicMaterial).opacity = fade;
    if (glowRef.current) (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * fade;
  });

  return (
    <group>
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.45}>
        <mesh ref={knotRef} geometry={geometry}>
          <meshStandardMaterial color={STEEL} metalness={0.78} roughness={0.22} envMapIntensity={1.15} clippingPlanes={[plane]} />
        </mesh>
      </Float>

      {/* 현재 빌드 높이의 스캔 링 — 코어(밝은 선) + 글로우(소프트 헤일로) */}
      <mesh ref={coreRef} material={coreMat} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringR, 0.012, 12, 128]} />
      </mesh>
      <mesh ref={glowRef} material={glowMat} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringR, 0.06, 12, 128]} />
      </mesh>
    </group>
  );
}

export default function PrinterBuild({
  className = "",
  sectionRef,
}: {
  className?: string;
  /** 빌드 진행도를 측정할 대상(실무 섹션 전체). 없으면 자신 기준. */
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);

  // 실무 섹션을 스크롤하는 동안 0→1: 위가 뷰포트 상단에 닿을 때 시작, 중앙이 중앙에 올 때 완성.
  const { scrollYProgress } = useScroll({
    target: sectionRef ?? ref,
    offset: sectionRef ? ["start start", "center center"] : ["start end", "center center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // 뷰포트 진입 시에만 마운트(벗어나면 언마운트 → 컨텍스트 해제).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden>
      {show && (
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [1.4, 0.8, 4.3], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 3]} intensity={1.1} />
          <directionalLight position={[-3, 1, -4]} intensity={0.4} color={TEAL} />

          <TangledOrb progressRef={progressRef} reduced={reduced} />

          {/* HDR 없이 Lightformer만으로 스튜디오 반사를 생성(외부 CDN 의존 X) */}
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 2]} scale={[6, 6, 1]} />
            <Lightformer intensity={1.3} color={TEAL} position={[-4, 1, -3]} scale={[4, 4, 1]} />
            <Lightformer intensity={1} position={[4, 2, 2]} scale={[3, 3, 1]} />
          </Environment>
        </Canvas>
      )}
    </div>
  );
}
