"use client";

// Stripe WebGL 그라데이션 — stripe/v1-chunk-4GGISAK3.js 에서 포팅
// Simplex Noise 버텍스 쉐이더로 평면 메시를 물결처럼 변위시키는 애니메이션.
// 색상 4개를 레이어별 노이즈 블렌딩으로 섞어 유기적인 색 흐름 생성.

import { useEffect, useRef, useState } from "react";


// molt 브랜드 팔레트 (0xRRGGBB)
const COLORS = [0x0d9488, 0x0891b2, 0x0ea5e9, 0x10b981] as const;

function hexToRgb(h: number): [number, number, number] {
  return [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];
}

// ── GLSL 쉐이더 ──────────────────────────────────────────────────────────────

const NOISE_GLSL = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const BLEND_GLSL = /* glsl */`
vec3 blendNormal(vec3 base,vec3 blend){return blend;}
vec3 blendNormal(vec3 base,vec3 blend,float opacity){
  return blendNormal(base,blend)*opacity+base*(1.-opacity);
}`;

const VERTEX_GLSL = /* glsl */`
varying vec3 v_color;
void main(){
  float time=u_time*u_global.noiseSpeed;
  vec2 noiseCoord=resolution*uvNorm*u_global.noiseFreq;
  float tilt=resolution.y/2.*uvNorm.y;
  float incline=resolution.x*uvNorm.x/2.*u_vertDeform.incline;
  float offset=resolution.x/2.*u_vertDeform.incline*mix(u_vertDeform.offsetBottom,u_vertDeform.offsetTop,uv.y);
  float noise=snoise(vec3(
    noiseCoord.x*u_vertDeform.noiseFreq.x+time*u_vertDeform.noiseFlow,
    noiseCoord.y*u_vertDeform.noiseFreq.y,
    time*u_vertDeform.noiseSpeed+u_vertDeform.noiseSeed
  ))*u_vertDeform.noiseAmp;
  noise*=1.-pow(abs(uvNorm.y),2.);
  noise=max(0.,noise);
  vec3 pos=vec3(position.x,position.y+tilt+incline+noise-offset,position.z);
  v_color=u_baseColor;
  for(int i=0;i<u_waveLayers_length;i++){
    WaveLayers layer=u_waveLayers[i];
    float n=smoothstep(layer.noiseFloor,layer.noiseCeil,
      snoise(vec3(
        noiseCoord.x*layer.noiseFreq.x+time*layer.noiseFlow,
        noiseCoord.y*layer.noiseFreq.y,
        time*layer.noiseSpeed+layer.noiseSeed
      ))/2.+.5);
    v_color=blendNormal(v_color,layer.color,pow(n,4.));
  }
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}`;

const FRAGMENT_GLSL = /* glsl */`
varying vec3 v_color;
void main(){ gl_FragColor=vec4(v_color,1.); }`;

// ── WebGL 렌더러 ──────────────────────────────────────────────────────────────

function initGradient(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) return () => {};

  // 캔버스 크기 — CSS height에서 읽어 WebGL 버퍼와 맞춤
  let width = 0, height = 0;
  const identity = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

  // 유니폼 헬퍼
  type UniformType = "float"|"int"|"vec2"|"vec3"|"vec4"|"mat4";
  const typeFnMap: Record<UniformType, string> = {
    float:"1f", int:"1i", vec2:"2fv", vec3:"3fv", vec4:"4fv", mat4:"Matrix4fv"
  };

  // 쉐이더 컴파일
  function compileShader(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
  }

  const amp = 320, seed = 5, freqX = 14e-5, freqY = 29e-5;
  const angle = 0;
  const density = [0.06, 0.16];

  const sectionColors = COLORS.map(hexToRgb);

  // 유니폼 선언 생성 헬퍼
  function uDecl(name: string, type: UniformType, arrLen = 0) {
    return arrLen > 0
      ? `uniform ${type} ${name}[${arrLen}];`
      : `uniform ${type} ${name};`;
  }

  const waveCount = sectionColors.length - 1;

  const commonDecls = `
    precision highp float;
    attribute vec4 position;
    attribute vec2 uv;
    attribute vec2 uvNorm;
    ${uDecl("projectionMatrix","mat4")}
    ${uDecl("modelViewMatrix","mat4")}
    ${uDecl("resolution","vec2")}
    ${uDecl("aspectRatio","float")}
  `;
  const vertDecls = `
    ${uDecl("u_time","float")}
    ${uDecl("u_darken_top","float")}
    ${uDecl("u_active_colors","vec4")}
    uniform struct Global { vec2 noiseFreq; float noiseSpeed; } u_global;
    uniform struct VertDeform {
      float incline; float offsetTop; float offsetBottom;
      vec2 noiseFreq; float noiseAmp; float noiseSpeed; float noiseFlow; float noiseSeed;
    } u_vertDeform;
    ${uDecl("u_baseColor","vec3")}
    uniform struct WaveLayers {
      vec3 color; vec2 noiseFreq;
      float noiseSpeed; float noiseFlow; float noiseSeed;
      float noiseFloor; float noiseCeil;
    } u_waveLayers[${waveCount}];
    const int u_waveLayers_length = ${waveCount};
  `;
  const fragDecls = `
    precision highp float;
    ${uDecl("resolution","vec2")}
    ${uDecl("u_darken_top","float")}
    ${uDecl("u_shadow_power","float")}
  `;

  const vertSrc = [commonDecls, vertDecls, NOISE_GLSL, BLEND_GLSL, VERTEX_GLSL].join("\n");
  const fragSrc = [fragDecls, FRAGMENT_GLSL].join("\n");

  const vertShader = compileShader(gl.VERTEX_SHADER, vertSrc);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // 유니폼 위치 캐시
  function uLoc(name: string) { return gl!.getUniformLocation(program, name)!; }

  // 지오메트리 (PlaneGeometry)
  let xSeg = 1, ySeg = 1;
  const posAttr = gl.createBuffer()!;
  const uvAttr  = gl.createBuffer()!;
  const uvnAttr = gl.createBuffer()!;
  const idxAttr = gl.createBuffer()!;

  function buildGeometry() {
    xSeg = Math.ceil(width  * density[0]);
    ySeg = Math.ceil(height * density[1]);
    const vCount = (xSeg+1)*(ySeg+1);
    const pos  = new Float32Array(vCount*3);
    const uvs  = new Float32Array(vCount*2);
    const uvns = new Float32Array(vCount*2);
    const idx  = new Uint16Array(xSeg*ySeg*6);

    const hw = width/2, hh = height/2;
    const sw = width/xSeg, sh = height/ySeg;

    for (let row=0; row<=ySeg; row++) {
      for (let col=0; col<=xSeg; col++) {
        const i = row*(xSeg+1)+col;
        pos[i*3]   = -hw + col*sw;
        pos[i*3+1] = 0;                   // Stripe 원본: Y=0 고정, 쉐이더가 tilt+noise로만 구동
        pos[i*3+2] = -hh + row*sh;
        uvs[i*2]   = col/xSeg;
        uvs[i*2+1] = 1-row/ySeg;
        uvns[i*2]  = -1+col/xSeg*2;
        uvns[i*2+1]= 1-row/ySeg*2;
        if (col < xSeg && row < ySeg) {
          const q = row*xSeg+col;
          idx[q*6]  = i; idx[q*6+1]=i+1+xSeg; idx[q*6+2]=i+1;
          idx[q*6+3]=i+1; idx[q*6+4]=i+1+xSeg; idx[q*6+5]=i+2+xSeg;
        }
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, posAttr);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvAttr);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvnAttr);
    gl.bufferData(gl.ARRAY_BUFFER, uvns, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxAttr);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    return idx.length;
  }

  function bindAttr(buf: WebGLBuffer, name: string, size: number) {
    const loc = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  // 직교 투영 행렬
  function setCamera() {
    const proj = [
      2/width, 0, 0, 0,
      0, 2/height, 0, 0,
      0, 0, 2/(-2000-2000), 0,
      0, 0, 0, 1,
    ];
    gl.uniformMatrix4fv(uLoc("projectionMatrix"), false, proj);
    gl.uniformMatrix4fv(uLoc("modelViewMatrix"),  false, identity);
    gl.uniform2fv(uLoc("resolution"), [width, height]);
    gl.uniform1f(uLoc("aspectRatio"), width/height);
  }

  // 파동 레이어 유니폼 설정
  function setWaveLayers() {
    for (let i = 0; i < waveCount; i++) {
      const c = sectionColors[i+1];
      gl.uniform3fv(uLoc(`u_waveLayers[${i}].color`), c);
      gl.uniform2fv(uLoc(`u_waveLayers[${i}].noiseFreq`), [2+i/sectionColors.length, 3+i/sectionColors.length]);
      gl.uniform1f(uLoc(`u_waveLayers[${i}].noiseSpeed`),  11+i*0.3);
      gl.uniform1f(uLoc(`u_waveLayers[${i}].noiseFlow`),   6.5+i*0.3);
      gl.uniform1f(uLoc(`u_waveLayers[${i}].noiseSeed`),   seed+i*10);
      gl.uniform1f(uLoc(`u_waveLayers[${i}].noiseFloor`),  0.1);
      gl.uniform1f(uLoc(`u_waveLayers[${i}].noiseCeil`),   0.63+i*0.07);
    }
  }

  function setStaticUniforms() {
    gl.uniform1f(uLoc("u_darken_top"), 0);
    gl.uniform1f(uLoc("u_shadow_power"), 5);
    gl.uniform4fv(uLoc("u_active_colors"), [1,1,1,1]);
    gl.uniform3fv(uLoc("u_baseColor"), sectionColors[0]);
    // 전역 노이즈
    gl.uniform2fv(uLoc("u_global.noiseFreq"), [freqX, freqY]);
    gl.uniform1f(uLoc("u_global.noiseSpeed"), 1.5e-5); // 색상 흐름 3x (원본 5e-6)
    // 버텍스 변형
    gl.uniform1f(uLoc("u_vertDeform.incline"),      Math.sin(angle)/Math.cos(angle || 0.0001));
    gl.uniform1f(uLoc("u_vertDeform.offsetTop"),    -0.5);
    gl.uniform1f(uLoc("u_vertDeform.offsetBottom"), -0.5);
    gl.uniform2fv(uLoc("u_vertDeform.noiseFreq"),   [3, 4]);
    gl.uniform1f(uLoc("u_vertDeform.noiseAmp"),     amp);
    gl.uniform1f(uLoc("u_vertDeform.noiseSpeed"),   10);
    gl.uniform1f(uLoc("u_vertDeform.noiseFlow"),    3);
    gl.uniform1f(uLoc("u_vertDeform.noiseSeed"),    seed);
    setWaveLayers();
  }

  let indexCount = 0;

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || 480;
    canvas.width  = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    setCamera();
    indexCount = buildGeometry();
  }

  resize();
  setStaticUniforms();

  // 렌더 루프
  let t = 1253106, last = 0, raf = 0, playing = true;

  function render(now: number) {
    if (!playing) return;
    t += Math.min(now - last, 1000/15);
    last = now;
    gl.clearColor(0, 0, 0, 0);
    gl.uniform1f(uLoc("u_time"), t);
    bindAttr(posAttr,  "position", 3);
    bindAttr(uvAttr,   "uv",       2);
    bindAttr(uvnAttr,  "uvNorm",   2);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxAttr);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);

  const onResize = () => { resize(); };
  window.addEventListener("resize", onResize);

  return () => {
    playing = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

// ── React 컴포넌트 ──────────────────────────────────────────────────────────

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initGradient(canvasRef.current);
    const t = setTimeout(() => setVisible(true), 180);
    return () => { cleanup(); clearTimeout(t); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute z-[5]"
      style={{
        bottom: "-300px",
        left: 0,
        width: "100vw",
        height: "330px",
        transformOrigin: "0 100%",
        transform: visible ? "skewY(-13deg) translateY(0px)" : "skewY(-13deg) translateY(40px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s cubic-bezier(0.22,1,0.36,1), transform 1.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    />
  );
}
