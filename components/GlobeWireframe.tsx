"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLOBE_DOTS } from "@/components/globe-dots";

const PRIMARY = 0x0d9488;
const KOREA = { lat: 36.5, lon: 127.8 };

// lat/lon(deg) → 단위구 xyz (정면 = +z 부근). 데이터와 동일 컨벤션.
function toVec(lat: number, lon: number, r = 1): THREE.Vector3 {
  const a = (lat * Math.PI) / 180;
  const o = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(a) * Math.cos(o), Math.sin(a), Math.cos(a) * Math.sin(o)).multiplyScalar(r);
}

// 앞면 진하게 / 뒷면 페이드 — 점·선 공용
const FRONT_FADE_VERT = `
  varying float vAlpha;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * wp;
    vAlpha = smoothstep(-0.25, 0.5, wp.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const GlobeWireframe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth || 560;
    const h = canvas.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.z = 2.75;

    const group = new THREE.Group();
    group.rotation.x = 0.34;

    // ── 대륙 점 ──
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(GLOBE_DOTS, 3));
    const dotMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uSize: { value: 2.7 * dpr }, uColor: { value: new THREE.Color(PRIMARY) } },
      vertexShader: `
        uniform float uSize;
        varying float vAlpha;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec4 mv = viewMatrix * wp;
          vAlpha = smoothstep(-0.25, 0.5, wp.z);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (2.9 / -mv.z);
        }`,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          if (dot(c, c) > 0.25) discard;
          if (vAlpha < 0.04) discard;
          gl_FragColor = vec4(uColor, vAlpha);
        }`,
    });
    group.add(new THREE.Points(dotGeo, dotMat));

    // ── 위경도 선 (graticule) — 빈 공간 채우기 ──
    const lineVerts: number[] = [];
    const pushArc = (fn: (t: number) => THREE.Vector3, n: number) => {
      let prev = fn(0);
      for (let i = 1; i <= n; i++) {
        const cur = fn(i / n);
        lineVerts.push(prev.x, prev.y, prev.z, cur.x, cur.y, cur.z);
        prev = cur;
      }
    };
    for (let lon = 0; lon < 360; lon += 15) pushArc((t) => toVec(-85 + 170 * t, lon, 0.997), 56);  // 경선 (15°)
    for (let lat = -75; lat <= 75; lat += 15) pushArc((t) => toVec(lat, 360 * t, 0.997), 120);     // 위선 (15°)
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3));
    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color(PRIMARY) } },
      vertexShader: FRONT_FADE_VERT,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() { gl_FragColor = vec4(uColor, vAlpha * 0.13); }`,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── 대한민국 — primary 면(disc) + 외곽 + 펄스 링 (group 자식, 후면 컬링으로 뒤로 가면 숨김) ──
    const kDir = toVec(KOREA.lat, KOREA.lon, 1);
    const kQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), kDir.clone().normalize());
    const kHub = new THREE.Group();
    kHub.position.copy(kDir.clone().multiplyScalar(1.004));
    kHub.quaternion.copy(kQuat);

    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 36),
      new THREE.MeshBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.9 })
    );
    kHub.add(disc);
    const rim = new THREE.Mesh(
      new THREE.RingGeometry(0.07, 0.085, 36),
      new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.95 })
    );
    kHub.add(rim);
    const pulse = new THREE.Mesh(
      new THREE.RingGeometry(0.085, 0.1, 36),
      new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.6 })
    );
    kHub.add(pulse);
    group.add(kHub);

    // ── 실루엣 링 (지구 윤곽) ──
    const silhouette = new THREE.Mesh(
      new THREE.RingGeometry(1.0, 1.006, 120),
      new THREE.MeshBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    scene.add(silhouette);

    scene.add(group);

    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y += 0.0022;
      // 대한민국 펄스 링
      const p = (t % 2.6) / 2.6;
      const s = 1 + p * 1.8;
      pulse.scale.set(s, s, s);
      (pulse.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - p);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w2 = canvas.clientWidth, h2 = canvas.clientHeight;
      if (!w2 || !h2) return;
      renderer.setSize(w2, h2, false);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default GlobeWireframe;
