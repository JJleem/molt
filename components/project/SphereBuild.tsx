"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// 3D print loop: build → hold → fade → repeat
// Restore: copy SphereBuild.backup.tsx → SphereBuild.tsx

const SPHERE_R = 0.9;
const BUILD_SEC  = 4.0;
const HOLD_SEC   = 1.8;
const FADE_SEC   = 1.6;
const WAIT_SEC   = 0.8;

const BASE_EDGE_OPACITY     = 0.42;
const BASE_DOT_OPACITY      = 0.55;
const BASE_PARTICLE_OPACITY = 0.32;

type Phase = "building" | "holding" | "fading" | "waiting";

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const edgeVert = /* glsl */ `
  uniform float uFrontierY;
  varying float vAlpha;
  varying float vBright;
  void main() {
    float distBelow = uFrontierY - position.y;
    vAlpha  = smoothstep(0.0, 0.1, distBelow);
    vBright = (1.0 - smoothstep(0.0, 0.22, distBelow)) * vAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const edgeFrag = /* glsl */ `
  uniform vec3  uColor;
  uniform vec3  uFreshColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBright;
  void main() {
    if (vAlpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uFreshColor, vBright), vAlpha * uOpacity);
  }
`;

class PrinterSphere {
  private scene:         THREE.Scene;
  private camera:        THREE.PerspectiveCamera;
  private renderer:      THREE.WebGLRenderer;
  private group:         THREE.Group;
  private particleGroup: THREE.Group;
  private edgeMat:       THREE.ShaderMaterial;
  private scanMat:       THREE.LineBasicMaterial;
  private scanCircle:    THREE.Line;
  private particleMat:   THREE.PointsMaterial;
  private dots:          Array<{ mat: THREE.MeshBasicMaterial; y: number }> = [];
  private innerLight:    THREE.PointLight;

  private phase:       Phase   = "building";
  private phaseTimer:  number  = 0;
  private frontierY:   number  = -SPHERE_R - 0.05;
  private globalAlpha: number  = 0;

  public shouldRender = true;
  public paused       = true;
  public forceRender  = true;
  private lastTime    = Date.now();

  constructor(container: HTMLElement) {
    const size = container.offsetWidth;

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 2.25;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(size, size);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.group         = new THREE.Group();
    this.particleGroup = new THREE.Group();
    this.scene.add(this.group, this.particleGroup);

    this.edgeMat                    = this.buildEdges();
    [this.scanCircle, this.scanMat] = this.buildScanLine();
    this.group.add(this.scanCircle);
    this.buildDots();
    this.particleMat = this.buildParticles();

    this.innerLight = new THREE.PointLight(new THREE.Color("#10b981"), 0);
    this.scene.add(this.innerLight);
    const key = new THREE.PointLight(new THREE.Color("#cffafe"), 0.9);
    key.position.set(-2, 3, 3);
    this.scene.add(key);

    this.tick = this.tick.bind(this);
    this.tick();
  }

  private buildEdges(): THREE.ShaderMaterial {
    const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(SPHERE_R, 2));
    const mat   = new THREE.ShaderMaterial({
      vertexShader:   edgeVert,
      fragmentShader: edgeFrag,
      uniforms: {
        uFrontierY:  { value: this.frontierY },
        uColor:      { value: new THREE.Color("#2dd4bf") },
        uFreshColor: { value: new THREE.Color("#a5f3fc") },
        uOpacity:    { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
    });
    this.group.add(new THREE.LineSegments(edges, mat));
    return mat;
  }

  private buildScanLine(): [THREE.Line, THREE.LineBasicMaterial] {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#67e8f9"),
      transparent: true,
      opacity: 0,
    });
    return [new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat), mat];
  }

  private buildDots() {
    const geo  = new THREE.IcosahedronGeometry(SPHERE_R, 2);
    const pos  = geo.attributes.position;
    const dGeo = new THREE.IcosahedronGeometry(0.011, 0);
    const seen = new Set<string>();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const mat  = new THREE.MeshBasicMaterial({ color: new THREE.Color("#67e8f9"), transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(dGeo, mat);
      mesh.position.set(x, y, z);
      this.group.add(mesh);
      this.dots.push({ mat, y });
    }
  }

  private buildParticles(): THREE.PointsMaterial {
    const count     = 110;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = SPHERE_R * 1.15 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#67e8f9"),
      size: 0.02,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    this.particleGroup.add(new THREE.Points(geo, mat));
    return mat;
  }

  tick() {
    const now   = Date.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (!this.paused || this.forceRender) {
      this.forceRender = false;

      // ── 페이즈 머신 ──────────────────────────────────
      this.phaseTimer += delta;

      switch (this.phase) {
        case "building": {
          const t       = Math.min(this.phaseTimer / BUILD_SEC, 1);
          this.frontierY  = THREE.MathUtils.lerp(-SPHERE_R - 0.05, SPHERE_R + 0.08, easeInOut(t));
          this.globalAlpha = Math.min(1, this.phaseTimer / 0.5); // 0.5s fade in
          if (t >= 1) { this.phase = "holding"; this.phaseTimer = 0; }
          break;
        }
        case "holding": {
          this.globalAlpha = 1;
          if (this.phaseTimer >= HOLD_SEC) { this.phase = "fading"; this.phaseTimer = 0; }
          break;
        }
        case "fading": {
          this.globalAlpha = 1 - Math.min(this.phaseTimer / FADE_SEC, 1);
          if (this.phaseTimer >= FADE_SEC) { this.phase = "waiting"; this.phaseTimer = 0; }
          break;
        }
        case "waiting": {
          this.globalAlpha = 0;
          this.frontierY   = -SPHERE_R - 0.05; // 보이지 않는 동안 리셋
          if (this.phaseTimer >= WAIT_SEC) { this.phase = "building"; this.phaseTimer = 0; }
          break;
        }
      }

      const isBuilding = this.phase === "building";

      // ── 구체 회전 ──
      this.group.rotation.y         += 0.003;
      this.particleGroup.rotation.y -= 0.0008;
      this.particleGroup.rotation.x += 0.0004;

      // ── edge shader ──
      this.edgeMat.uniforms.uFrontierY.value = this.frontierY;
      this.edgeMat.uniforms.uOpacity.value   = BASE_EDGE_OPACITY * this.globalAlpha;

      // ── scan line: 빌드 중일 때만 ──
      if (isBuilding && this.frontierY > -SPHERE_R + 0.01 && this.frontierY < SPHERE_R - 0.01) {
        const r    = Math.sqrt(Math.max(0, SPHERE_R * SPHERE_R - this.frontierY * this.frontierY));
        const edge = Math.min((this.frontierY + SPHERE_R) / 0.25, (SPHERE_R - this.frontierY) / 0.25, 1);
        this.scanCircle.position.y = this.frontierY;
        this.scanCircle.scale.set(r, 1, r);
        this.scanMat.opacity = edge * 0.25 * this.globalAlpha;
      } else {
        this.scanMat.opacity = 0;
      }

      // ── dots ──
      for (const { mat, y } of this.dots) {
        const reveal = THREE.MathUtils.clamp((this.frontierY - y) / 0.06, 0, 1);
        mat.opacity  = reveal * BASE_DOT_OPACITY * this.globalAlpha;
      }

      // ── 파티클 ──
      this.particleMat.opacity = BASE_PARTICLE_OPACITY * this.globalAlpha;

      // ── 내부 광원 ──
      const built = THREE.MathUtils.clamp((this.frontierY + SPHERE_R) / (SPHERE_R * 2), 0, 1);
      this.innerLight.intensity = built * 1.6 * this.globalAlpha + Math.sin(now * 0.0018) * 0.2 * this.globalAlpha;

      this.renderer.render(this.scene, this.camera);
    }

    if (this.shouldRender) requestAnimationFrame(this.tick);
  }

  resize(size: number) { this.renderer.setSize(size, size); }
  stop()               { this.shouldRender = false; }
  dispose()            { this.stop(); this.renderer.dispose(); }
}

export default function SphereBuild({
  className = "",
  sectionRef: _sectionRef,
}: {
  className?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sphereRef    = useRef<PrinterSphere | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sphere = new PrinterSphere(container);
    sphereRef.current = sphere;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { sphere.paused = false; sphere.forceRender = true; }
      else                      { sphere.paused = true; }
    }, { threshold: 0.01 });
    io.observe(container);

    const onResize = () => { if (container) sphere.resize(container.offsetWidth); };
    window.addEventListener("resize", onResize);

    return () => {
      sphere.dispose();
      sphereRef.current = null;
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`${className} relative`} aria-hidden>
      <div ref={containerRef} style={{ width: "100%", aspectRatio: "1 / 1" }} />
    </div>
  );
}
