"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// IcosahedronGeometry sphere — base ported from Stripe SphereLayout,
// customized: bottom-up stagger build + teal scan ring (3D-print theme)

const LERP_SPEED = 0.07;
const SOME_EXPAND = 0.18;
const ZDIV = 24;
const STAGGER_WINDOW = 0.55; // fraction of progress each face uses (rest is offset)
const SPHERE_R = 0.9;

function easeCustom(d: number) {
  return (d + Math.sin((d * Math.PI) / 2)) / 2;
}
function easeOut(d: number) {
  return 1 - (1 - d) * (1 - d);
}

type FaceInfo = {
  expandedPos: THREE.Vector3[];
  flushPos: THREE.Vector3[];
  someExpandedPos: (THREE.Vector3 | undefined)[];
  dist: number;
  staggerOffset: number; // 0=bottom(first), 1=top(last) — bottom-up build order
};

class IcoSphere {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private rotateGroup: THREE.Group;
  private wireframeGroup: THREE.Group;
  private faceGeo: THREE.IcosahedronGeometry;
  private faceMat: THREE.MeshPhongMaterial;
  private dotMat: THREE.MeshPhongMaterial;
  private innerPointLight: THREE.PointLight;
  private shadow: HTMLElement;
  private count: number;
  private faceInfo: FaceInfo[];
  private dots: Record<string, boolean> = {};

  // Scan ring — teal "build frontier" indicator
  private scanRing!: THREE.Mesh;
  private scanGlow!: THREE.Mesh;
  private scanRingMat!: THREE.MeshBasicMaterial;
  private scanGlowMat!: THREE.MeshBasicMaterial;

  private innerInfo = {
    startColor: new THREE.Color(0x10b981), // emerald-500
    endColor: new THREE.Color(0x6ee7b7),   // emerald-300 (brighter)
    startIntensity: 1.8,
    endIntensity: 1.2,
  };

  public targetProgress = 0;
  public currProgress = 0;
  public direction = 1;
  public paused = true;
  public shouldRender = true;
  public forceRender = true;
  private lastTime = Date.now();
  private rafId: number | null = null;

  constructor(container: HTMLElement, shadow: HTMLElement) {
    this.shadow = shadow;
    const size = container.offsetWidth;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 2.25;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(size, size);
    this.renderer.setClearColor(0xffffff, 0);
    container.appendChild(this.renderer.domElement);

    this.rotateGroup = new THREE.Group();
    this.wireframeGroup = new THREE.Group();

    this.faceGeo = new THREE.IcosahedronGeometry(SPHERE_R, 2);
    this.count = this.faceGeo.attributes.position.count;

    this.faceGeo.setAttribute("color",     new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));
    this.faceGeo.setAttribute("initColor", new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));
    this.faceGeo.setAttribute("endColor",  new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));

    const dotGeo = new THREE.IcosahedronGeometry(0.01, 1);
    this.dotMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#2dd4bf"),
      side: THREE.FrontSide,
      flatShading: true,
      transparent: true,
    });

    this.faceInfo = Array.from({ length: this.count / 3 }, () => ({
      expandedPos: new Array(3),
      flushPos: new Array(3),
      someExpandedPos: new Array(3),
      dist: 0,
      staggerOffset: 0,
    }));

    this.buildFaceInfo(dotGeo);

    this.faceMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.FrontSide, // Stripe 원본과 동일 — 뒤집힌 면 투명 → 내부 광원 새어나옴
      flatShading: true,
      transparent: true,
      opacity: 0,
      shininess: 100,
      specular: new THREE.Color("#99f6e4"), // teal specular
      emissive: new THREE.Color("#040c14"),
      emissiveIntensity: 1,
    });

    // Double wireframe to avoid z-fighting
    const wireGeo = this.faceGeo.clone();
    const wm1 = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.FrontSide, wireframe: true });
    const wm2 = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.BackSide, wireframe: true });
    const wMesh2 = new THREE.Mesh(wireGeo, wm2);
    wMesh2.scale.set(0.9999, 0.9999, 0.9999);
    this.wireframeGroup.add(new THREE.Mesh(wireGeo, wm1), wMesh2);

    this.rotateGroup.add(this.wireframeGroup, new THREE.Mesh(this.faceGeo, this.faceMat));
    this.rotateGroup.renderOrder = 1;
    this.scene.add(this.rotateGroup);

    this.buildScanRing();

    // ambient 최소화 — 측면 키라이트가 면마다 극적 명암 만들게
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    // 키라이트: 정면(z축) 아닌 측면 상단 → 회전 시 각 면 밝기가 극적으로 달라짐
    const keyLight = new THREE.PointLight(0xe0f2fe, 3.5);
    keyLight.position.set(-3, 3, 2);
    this.scene.add(keyLight);
    // 반대편 림라이트 → 어두운 면에 에메랄드 테두리
    const rimLight = new THREE.PointLight(0x10b981, 2.0);
    rimLight.position.set(3, -2, -2);
    this.scene.add(rimLight);
    this.innerPointLight = new THREE.PointLight(this.innerInfo.startColor.clone(), this.innerInfo.startIntensity);
    this.scene.add(this.innerPointLight);

    this.tick = this.tick.bind(this);
    this.tick();
  }

  private buildScanRing() {
    // Thin teal ring at the "build frontier" — additive blending for glow effect
    this.scanRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#2dd4bf"),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.scanGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#67e8f9"),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    // rotation.x = PI/2 makes torus horizontal (XZ plane)
    const ringGeo = new THREE.TorusGeometry(SPHERE_R, 0.007, 8, 128);
    const glowGeo = new THREE.TorusGeometry(SPHERE_R, 0.035, 8, 128);

    this.scanRing = new THREE.Mesh(ringGeo, this.scanRingMat);
    this.scanGlow = new THREE.Mesh(glowGeo, this.scanGlowMat);
    this.scanRing.rotation.x = Math.PI / 2;
    this.scanGlow.rotation.x = Math.PI / 2;

    // Add to rotateGroup so ring rotates with sphere
    this.rotateGroup.add(this.scanRing, this.scanGlow);
  }

  private buildFaceInfo(dotGeo: THREE.IcosahedronGeometry) {
    const top = new THREE.Color("#cffafe"); // cyan-100
    const bot = new THREE.Color("#083344"); // cyan-950
    const popColor = new THREE.Color("#059669"); // emerald-600 — 진한 primary emerald
    const pos = this.faceGeo.attributes.position.array as Float32Array;

    for (let e = 0; e < this.count; e++) {
      const y = pos[e * 3 + 1];
      const s = 1 - (y + 1) / 2;
      const color = new THREE.Color().lerpColors(top, bot, easeCustom(s));

      (this.faceGeo.attributes.color as THREE.BufferAttribute).setXYZ(e, color.r, color.g, color.b);
      (this.faceGeo.attributes as any).initColor.setXYZ(e, color.r, color.g, color.b);
      (this.faceGeo.attributes as any).endColor.setXYZ(e, color.r, color.g, color.b);

      const fi = Math.floor(e / 3);
      const vi = e % 3;
      const vx = pos[e * 3], vy = pos[e * 3 + 1], vz = pos[e * 3 + 2];
      const v = new THREE.Vector3(vx, vy, vz);
      const norm = v.clone().normalize();

      if (!this.faceInfo[fi].dist) {
        this.faceInfo[fi].dist = 0.1 + Math.random() * 0.4;
      }

      this.faceInfo[fi].flushPos[vi] = v.clone();
      this.faceInfo[fi].expandedPos[vi] = v.clone().addScaledVector(norm, this.faceInfo[fi].dist);

      if (vi === 2) {
        const avgY = (this.faceInfo[fi].flushPos[0].y +
                      this.faceInfo[fi].flushPos[1].y +
                      this.faceInfo[fi].flushPos[2].y) / 3;
        this.faceInfo[fi].staggerOffset = (avgY + SPHERE_R) / (SPHERE_R * 2);
      }

      const key = `${vx.toFixed(5)}_${vy.toFixed(5)}_${vz.toFixed(5)}`;
      if (!this.dots[key]) {
        const dot = new THREE.Mesh(dotGeo, this.dotMat);
        dot.position.set(vx, vy, vz);
        this.wireframeGroup.add(dot);
        this.dots[key] = true;
      }

      const cycle = e % ZDIV;
      if (cycle < 3) {
        this.faceInfo[fi].someExpandedPos[vi] = v.clone().addScaledVector(norm, SOME_EXPAND);
        (this.faceGeo.attributes as any).endColor.setXYZ(e, popColor.r, popColor.g, popColor.b);
      } else {
        const colorArr = (this.faceGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
        (this.faceGeo.attributes as any).endColor.setXYZ(e,
          colorArr[e * 3]     * 0.65,
          colorArr[e * 3 + 1] * 0.65,
          colorArr[e * 3 + 2] * 0.65
        );
      }
    }
  }

  // 면 centroid 수축 — 렌더 시점에 적용해서 animation은 그대로 유지
  private shrinkFace(verts: THREE.Vector3[]): void {
    const c = new THREE.Vector3()
      .add(verts[0]).add(verts[1]).add(verts[2]).divideScalar(3);
    const GAP = 0.13;
    for (const v of verts) v.lerp(c, GAP);
  }

  tick() {
    const now = Date.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    if (!this.paused || this.forceRender) {
      this.forceRender = false;
      this.rotateGroup.rotation.y += 0.003;

      const diff = this.targetProgress - this.currProgress;
      if (Math.abs(diff) < 0.01) {
        this.currProgress = this.targetProgress;
      } else {
        this.currProgress += diff * LERP_SPEED * (delta * 0.0625);
      }

      if (this.currProgress <= 1) {
        this.phase1(this.currProgress);
      } else if (this.currProgress < 2) {
        this.phase2(this.currProgress - 1);
      }

      this.renderer.render(this.scene, this.camera);
    }

    if (this.shouldRender) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private phase1(e: number) {
    const posArr = this.faceGeo.attributes.position;

    for (let fi = 0; fi < this.count / 3; fi++) {
      const info = this.faceInfo[fi];
      const faceStart = info.staggerOffset * (1 - STAGGER_WINDOW);
      const localE = THREE.MathUtils.clamp((e - faceStart) / STAGGER_WINDOW, 0, 1);

      const verts = [0, 1, 2].map(vi => {
        if (!info.expandedPos[vi] || !info.flushPos[vi]) return new THREE.Vector3();
        return new THREE.Vector3().lerpVectors(info.expandedPos[vi], info.flushPos[vi], localE);
      });

      this.shrinkFace(verts);

      for (let vi = 0; vi < 3; vi++) {
        posArr.setXYZ(fi * 3 + vi, verts[vi].x, verts[vi].y, verts[vi].z);
      }
    }
    posArr.needsUpdate = true;

    const t = easeOut(e);
    this.rotateGroup.renderOrder = t > 0.95 ? 0 : 1;
    this.faceMat.opacity = t;
    this.dotMat.opacity = 1 - t;

    // Scan ring: follows the build frontier from bottom to top
    const currentY = THREE.MathUtils.lerp(-SPHERE_R, SPHERE_R, e);
    const ringR = Math.sqrt(Math.max(0.001, SPHERE_R * SPHERE_R - currentY * currentY));
    const scaleXZ = ringR / SPHERE_R;
    this.scanRing.position.y = currentY;
    this.scanGlow.position.y = currentY;
    // scale.set(x, y, 1): x=XZ ring size, y=XZ ring size, z=1 (tube stays round after rot.x)
    this.scanRing.scale.set(scaleXZ, scaleXZ, 1);
    this.scanGlow.scale.set(scaleXZ, scaleXZ, 1);

    const active = e > 0.02 && e < 0.96;
    const fade = active ? Math.min(1, Math.min(e, 1 - e) * 10) : 0;
    this.scanRingMat.opacity = fade;
    this.scanGlowMat.opacity = fade * 0.45;

    if (this.direction === 1 && e > 0.5) this.shadow.style.opacity = "1";
    else if (this.direction === -1 && e < 1) this.shadow.style.opacity = "0";

    const blend = Math.min((this.direction === 1 ? e : 1 - e) * 20, 1);
    this.innerPointLight.color.lerpColors(
      this.direction === 1 ? this.innerInfo.startColor : this.innerInfo.endColor,
      this.direction === 1 ? this.innerInfo.endColor : this.innerInfo.startColor,
      blend
    );
  }

  private phase2(e: number) {
    this.scanRingMat.opacity = 0;
    this.scanGlowMat.opacity = 0;

    const posArr   = this.faceGeo.attributes.position;
    const colorArr = this.faceGeo.attributes.color as THREE.BufferAttribute;
    const initArr  = (this.faceGeo.attributes as any).initColor.array as Float32Array;
    const endArr   = (this.faceGeo.attributes as any).endColor.array as Float32Array;

    for (let fi = 0; fi < this.count / 3; fi++) {
      const info = this.faceInfo[fi];
      const isPop = (fi * 3) % ZDIV < 3;

      for (let vi = 0; vi < 3; vi++) {
        const t = fi * 3 + vi;

        if (isPop) {
          const se = info.someExpandedPos[vi];
          const fl = info.flushPos[vi];
          if (se && fl) {
            const p = new THREE.Vector3().lerpVectors(fl, se, easeOut(e));
            posArr.setXYZ(t, p.x, p.y, p.z);
          }
        }
        // 비팝핑은 position 그대로 (phase1 끝 상태 = shrunk flushPos)

        colorArr.setXYZ(t,
          initArr[t * 3]     + (endArr[t * 3]     - initArr[t * 3])     * e,
          initArr[t * 3 + 1] + (endArr[t * 3 + 1] - initArr[t * 3 + 1]) * e,
          initArr[t * 3 + 2] + (endArr[t * 3 + 2] - initArr[t * 3 + 2]) * e
        );
      }
    }
    posArr.needsUpdate = true;
    colorArr.needsUpdate = true;

    // 내부 광원 강화
    this.innerPointLight.intensity = THREE.MathUtils.lerp(
      this.innerInfo.endIntensity,
      this.innerInfo.endIntensity * 2.5,
      easeOut(e)
    );
  }

  resize(size: number) {
    this.renderer.setSize(size, size);
  }

  start() {
    if (!this.shouldRender) {
      this.shouldRender = true;
      this.lastTime = Date.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  stop() { this.shouldRender = false; }

  dispose() {
    this.stop();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}

export default function SphereBuild({
  className = "",
  sectionRef,
}: {
  className?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef    = useRef<HTMLDivElement>(null);
  const sphereRef    = useRef<IcoSphere | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const shadow    = shadowRef.current;
    if (!container || !shadow) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sphere  = new IcoSphere(container, shadow);
    sphereRef.current = sphere;

    if (reduced) {
      sphere.targetProgress = 1;
      sphere.currProgress   = 1;
      sphere.forceRender    = true;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { sphere.paused = false; sphere.start(); }
      else { sphere.paused = true; }
    }, { threshold: 0.01 });
    io.observe(container);

    function onScroll() {
      const el = sectionRef?.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw   = Math.max(0, Math.min(1, -rect.top / Math.max(total, 1)));
      const newTarget = raw * 2;
      sphere.direction     = newTarget >= sphere.targetProgress ? 1 : -1;
      sphere.targetProgress = newTarget;
    }

    function onResize() {
      if (container) sphere.resize(container.offsetWidth);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      sphere.dispose();
      sphereRef.current = null;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`${className} relative`} aria-hidden>
      <div
        ref={shadowRef}
        style={{
          position: "absolute",
          bottom: "-8%", left: "10%", right: "10%",
          height: "20%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(45,212,191,0.35) 0%, rgba(14,116,144,0.15) 50%, transparent 75%)",
          opacity: 0,
          willChange: "opacity",
          transition: "opacity 1s ease-out",
          pointerEvents: "none",
          filter: "blur(12px)",
        }}
      />
      <div
        ref={containerRef}
        style={{ width: "100%", aspectRatio: "1 / 1", position: "relative" }}
      />
    </div>
  );
}
