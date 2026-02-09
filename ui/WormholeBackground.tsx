"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 이력서 secondary 컬러 (선 색상) - 나중에 fog랑 섞이면서 은은해짐
const LINE_COLOR = "#6d70f2";
// 배경색과 동일한 fog 색상 (필수! 이것 때문에 은은해 보임)
const FOG_COLOR = "#f7f7f7";

const WormholeMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // 1. 튜브 경로 생성: 오른쪽 하단에서 시작해서 뒤쪽 대각선으로 휘어지는 곡선
  const path = useMemo(() => {
    // CatmullRomCurve3로 부드러운 곡선 생성
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(8, -8, 0), // 시작점 (화면 오른쪽 아래)
      new THREE.Vector3(15, -15, -50), // 중간 경유점 (더 오른쪽 아래 뒤쪽)
      new THREE.Vector3(30, -30, -150), // 끝점 (아주 멀리 대각선 뒤쪽)
    ]);
  }, []);

  // 2. 그리드 텍스처 생성 (이전과 동일하지만 선을 더 얇게 조정)
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");

    if (context) {
      context.clearRect(0, 0, 1024, 1024);
      context.strokeStyle = LINE_COLOR;
      // ⭐ 수정 1: 선을 조금 더 두껍게 (개수를 줄일 거라 잘 보이게)
      context.lineWidth = 5;
      context.lineCap = "round";
      context.beginPath();

      // ⭐ 수정 2: 간격을 256px로 아주 넓게 (뭉침 방지 핵심!)
      const step = 256;

      for (let i = 0; i <= 1024; i += step) {
        context.moveTo(0, i);
        context.lineTo(1024, i);
        context.moveTo(i, 0);
        context.lineTo(i, 1024);
      }
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 깊이 방향 반복 횟수 조절
    texture.repeat.set(50, 1);
    return texture;
  }, []);

  // 3. 애니메이션: 천천히 빨려 들어가는 느낌
  useFrame((state, delta) => {
    if (
      meshRef.current?.material instanceof THREE.MeshBasicMaterial &&
      meshRef.current.material.map
    ) {
      // 속도를 아주 느리게 줄여서 은은한 움직임 연출
      meshRef.current.material.map.offset.x -= delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* 튜브 반지름을 키워서 완만한 곡면을 만듦 */}
      <tubeGeometry args={[path, 200, 50, 32, false]} />

      {/* 재질 설정: 아주 투명하고 은은하게 */}
      <meshBasicMaterial
        map={gridTexture}
        side={THREE.BackSide} // 튜브 안쪽 면 렌더링
        transparent
        opacity={0.6} // 투명도를 아주 낮춤 (핵심!)
        depthWrite={false}
        // blending={THREE.AdditiveBlending} // 너무 밝으면 이 줄을 주석 처리하세요
      />
    </mesh>
  );
};

const WormholeBackground = () => {
  return (
    // fixed로 변경하여 스크롤과 상관없이 화면에 고정
    <div className="fixed inset-0 bg-resume-bg overflow-hidden pointer-events-none ">
      {/* 카메라를 왼쪽 위로 옮겨서 오른쪽 아래를 바라보게 설정 */}
      <Canvas
        camera={{ position: [-10, 10, 20], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* ⭐ 핵심: 안개(Fog) 효과 추가 ⭐ */}
        {/* 멀리 있는 부분은 배경색(FOG_COLOR)으로 서서히 사라지게 만듦 */}
        {/* near(20)부터 far(180)까지 점점 흐려짐 */}
        <fog attach="fog" args={[FOG_COLOR, 20, 180]} />

        {/* 배경색을 fog 색상과 맞춰줘야 자연스럽게 섞임 */}
        <color attach="background" args={[FOG_COLOR]} />

        <WormholeMesh />
      </Canvas>
    </div>
  );
};

export default WormholeBackground;
