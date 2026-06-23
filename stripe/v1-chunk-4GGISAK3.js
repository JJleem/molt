import{a as M}from"./v1-chunk-423M6RNU.js";import{d as F}from"./v1-chunk-GOKFJGIT.js";import{a as U}from"./v1-chunk-HMRIQCRQ.js";import{a as x}from"./v1-chunk-W54ZCUX6.js";import{a as D,b as _,c as A}from"./v1-chunk-PFBEA3NA.js";import{j as L}from"./v1-chunk-KWARAS4N.js";var z=`varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;

  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  vec2 st = 1. - uvNorm.xy;

  //
  // Tilting the plane
  //

  // Front-to-back tilt
  float tilt = resolution.y / 2.0 * uvNorm.y;

  // Left-to-right angle
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

  // Up-down shift to offset incline
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  //
  // Vertex noise
  //

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  // Fade noise to zero at edges
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

  // Clamp to 0
  noise = max(0.0, noise);

  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  //
  // Vertex color, to be passed to fragment shader
  //

  if (u_active_colors[0] == 1.) {
    v_color = u_baseColor;
  }

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];

      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );

      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
    }
  }

  //
  // Finish
  //

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;var E=`//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}`;var R=`//
// https://github.com/jamieowen/glsl-blend
//

// Normal

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

// Screen

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// Multiply

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// Hard light

vec3 blendHardLight(vec3 base, vec3 blend) {
	return blendOverlay(blend,base);
}

vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Soft light

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Color dodge

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Color burn

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Vivid Light

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Lighten

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear burn

float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear dodge

float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear light

float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}`;var O=`varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`;var y=class{constructor(c,i,d,u=!1){let r=this,q=document.location.search.toLowerCase().indexOf("debug=webgl")!==-1;r.canvas=c,r.gl=r.canvas.getContext("webgl",{antialias:!0}),r.meshes=[];let s=r.gl;i&&d&&this.setSize(i,d),r.lastDebugMsg,r.debug=u&&q?function(g){let n=new Date;n-r.lastDebugMsg>1e3&&console.log("---"),console.log(n.toLocaleTimeString()+Array(Math.max(0,32-g.length)).join(" ")+g+": ",...Array.from(arguments).slice(1)),r.lastDebugMsg=n}:()=>{},Object.defineProperties(r,{Material:{enumerable:!1,value:class{constructor(n,o,e={}){let t=this;t.uniforms=e,t.uniformInstances=[];function a(p,b){let v=s.createShader(p);return s.shaderSource(v,b),s.compileShader(v),s.getShaderParameter(v,s.COMPILE_STATUS)||console.error(s.getShaderInfoLog(v)),r.debug("Material.compileShaderSource",{source:b}),v}function l(p,b){return Object.entries(p).map(([v,f])=>f.getDeclaration(v,b)).join(`
`)}let h=`
              precision highp float;
            `;t.vertexSource=`
              ${h}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${l(r.commonUniforms,"vertex")}
              ${l(e,"vertex")}
              ${n}
            `,t.fragmentSource=`
              ${h}
              ${l(r.commonUniforms,"fragment")}
              ${l(e,"fragment")}
              ${o}
            `,t.vertexShader=a(s.VERTEX_SHADER,t.vertexSource),t.fragmentShader=a(s.FRAGMENT_SHADER,t.fragmentSource),t.program=s.createProgram(),s.attachShader(t.program,t.vertexShader),s.attachShader(t.program,t.fragmentShader),s.linkProgram(t.program),s.getProgramParameter(t.program,s.LINK_STATUS)||console.error(s.getProgramInfoLog(t.program)),s.useProgram(t.program),t.attachUniforms(void 0,r.commonUniforms),t.attachUniforms(void 0,t.uniforms)}attachUniforms(n,o){let e=this;n===void 0?Object.entries(o).forEach(([t,a])=>{e.attachUniforms(t,a)}):o.type=="array"?o.value.forEach((t,a)=>e.attachUniforms(`${n}[${a}]`,t)):o.type=="struct"?Object.entries(o.value).forEach(([t,a])=>e.attachUniforms(`${n}.${t}`,a)):(r.debug("Material.attachUniforms",{name:n,uniform:o}),e.uniformInstances.push({uniform:o,location:s.getUniformLocation(e.program,n)}))}}},Uniform:{enumerable:!1,value:class{constructor(n){this.type="float",Object.assign(this,n);let o={float:"1f",int:"1i",vec2:"2fv",vec3:"3fv",vec4:"4fv",mat4:"Matrix4fv"};this.typeFn=o[this.type]||"1f",this.update()}update(n){this.value!==void 0&&s[`uniform${this.typeFn}`](n,this.typeFn.indexOf("Matrix")===0?this.transpose:this.value,this.typeFn.indexOf("Matrix")===0?this.value:null)}getDeclaration(n,o,e){let t=this;if(t.excludeFrom!==o){if(t.type==="array")return t.value[0].getDeclaration(n,o,t.value.length)+`
const int ${n}_length = ${t.value.length};`;if(t.type==="struct"){let a=n.replace("u_","");return a=a.charAt(0).toUpperCase()+a.slice(1),`uniform struct ${a} {
`+Object.entries(t.value).map(([l,h])=>h.getDeclaration(l,o).replace(/^uniform/,"")).join("")+`
} ${n}${e>0?`[${e}]`:""};`}else return`uniform ${t.type} ${n}${e>0?`[${e}]`:""};`}}}},PlaneGeometry:{enumerable:!1,value:class{constructor(n,o,e,t,a){let l=this;s.createBuffer(),l.attributes={position:new r.Attribute({target:s.ARRAY_BUFFER,size:3}),uv:new r.Attribute({target:s.ARRAY_BUFFER,size:2}),uvNorm:new r.Attribute({target:s.ARRAY_BUFFER,size:2}),index:new r.Attribute({target:s.ELEMENT_ARRAY_BUFFER,size:3,type:s.UNSIGNED_SHORT})},this.setTopology(e,t),this.setSize(n,o,a)}setTopology(n=1,o=1){let e=this;e.xSegCount=n,e.ySegCount=o,e.vertexCount=(e.xSegCount+1)*(e.ySegCount+1),e.quadCount=e.xSegCount*e.ySegCount*2,e.attributes.uv.values=new Float32Array(e.vertexCount*2),e.attributes.uvNorm.values=new Float32Array(e.vertexCount*2),e.attributes.index.values=new Uint16Array(e.quadCount*3);for(let t=0;t<=e.ySegCount;t++)for(let a=0;a<=e.xSegCount;a++){let l=t*(e.xSegCount+1)+a;if(e.attributes.uv.values[l*2]=a/e.xSegCount,e.attributes.uv.values[l*2+1]=1-t/e.ySegCount,e.attributes.uvNorm.values[l*2]=-1+a/e.xSegCount*2,e.attributes.uvNorm.values[l*2+1]=1-t/e.ySegCount*2,a<e.xSegCount&&t<e.ySegCount){let h=t*e.xSegCount+a;e.attributes.index.values[h*6]=l,e.attributes.index.values[h*6+1]=l+1+e.xSegCount,e.attributes.index.values[h*6+2]=l+1,e.attributes.index.values[h*6+3]=l+1,e.attributes.index.values[h*6+4]=l+1+e.xSegCount,e.attributes.index.values[h*6+5]=l+2+e.xSegCount}}e.attributes.uv.update(),e.attributes.uvNorm.update(),e.attributes.index.update(),r.debug("Geometry.setTopology",{uv:e.attributes.uv,uvNorm:e.attributes.uvNorm,index:e.attributes.index})}setSize(n=1,o=1,e="xz"){let t=this;t.width=n,t.height=o,t.orientation=e,(!t.attributes.position.values||t.attributes.position.values.length!==t.vertexCount*3)&&(t.attributes.position.values=new Float32Array(t.vertexCount*3));let a=n/-2,l=o/-2,h=n/t.xSegCount,p=o/t.ySegCount;for(let b=0;b<=t.ySegCount;b++){let v=l+b*p;for(let f=0;f<=t.xSegCount;f++){let N=a+f*h,C=b*(t.xSegCount+1)+f;t.attributes.position.values[C*3+"xyz".indexOf(e[0])]=N,t.attributes.position.values[C*3+"xyz".indexOf(e[1])]=-v}}t.attributes.position.update(),r.debug("Geometry.setSize",{position:t.attributes.position})}}},Mesh:{enumerable:!1,value:class{constructor(n,o){let e=this;e.geometry=n,e.material=o,e.wireframe=!1,e.attributeInstances=[],Object.entries(e.geometry.attributes).forEach(([t,a])=>{e.attributeInstances.push({attribute:a,location:a.attach(t,e.material.program)})}),r.meshes.push(e),r.debug("Mesh.constructor",{mesh:e})}draw(){let n=this;s.useProgram(n.material.program),n.material.uniformInstances.forEach(({uniform:o,location:e})=>o.update(e)),n.attributeInstances.forEach(({attribute:o,location:e})=>o.use(e)),s.drawElements(n.wireframe?s.LINES:s.TRIANGLES,n.geometry.attributes.index.values.length,s.UNSIGNED_SHORT,0)}remove(){r.meshes=r.meshes.filter(n=>n!=this)}}},Attribute:{enumerable:!1,value:class{constructor(n){this.type=s.FLOAT,this.normalized=!1,this.buffer=s.createBuffer(),Object.assign(this,n),this.update()}update(){this.values!==void 0&&(s.bindBuffer(this.target,this.buffer),s.bufferData(this.target,this.values,s.STATIC_DRAW))}attach(n,o){let e=s.getAttribLocation(o,n);return this.target===s.ARRAY_BUFFER&&(s.enableVertexAttribArray(e),s.vertexAttribPointer(e,this.size,this.type,this.normalized,0,0)),e}use(n){s.bindBuffer(this.target,this.buffer),this.target===s.ARRAY_BUFFER&&(s.enableVertexAttribArray(n),s.vertexAttribPointer(n,this.size,this.type,this.normalized,0,0))}}}});let S=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];r.commonUniforms={projectionMatrix:new r.Uniform({type:"mat4",value:S}),modelViewMatrix:new r.Uniform({type:"mat4",value:S}),resolution:new r.Uniform({type:"vec2",value:[1,1]}),aspectRatio:new r.Uniform({type:"float",value:1})}}setSize(c=640,i=480){this.width=c,this.height=i,this.canvas.width=c,this.canvas.height=i,this.gl.viewport(0,0,c,i),this.commonUniforms.resolution.value=[c,i],this.commonUniforms.aspectRatio.value=c/i,this.debug("MiniGL.setSize",{width:c,height:i})}setOrthographicCamera(c=0,i=0,d=0,u=-2e3,r=2e3){this.commonUniforms.projectionMatrix.value=[2/this.width,0,0,0,0,2/this.height,0,0,0,0,2/(u-r),0,c,i,d,1],this.debug("setOrthographicCamera",this.commonUniforms.projectionMatrix.value)}render(){this.gl.clearColor(0,0,0,0),this.gl.clearDepth(1),this.meshes.forEach(c=>c.draw())}};function I(m){return[(m>>16&255)/255,(m>>8&255)/255,(m&255)/255]}var Y=["SCREEN","LINEAR_LIGHT"].reduce((m,c,i)=>Object.assign(m,{[c]:i}),{});var w=class extends _{constructor(){super(...arguments);this.frame=0;this.cssVarRetries=0;this.maxCssVarRetries=200;this.angle=0;this.isLoadedClass=!1;this.isScrolling=!1;this.isStatic=x.disableAmbientAnimations();this.isGPUDisabled=x.disableGPUAnimations();this.scrollingRefreshDelay=200;this.isIntersecting=!1;this.t=1253106;this.last=0;this.minWidth=1111;this.height=600;this.amp=320;this.seed=5;this.freqX=14e-5;this.freqY=29e-5;this.freqDelta=1e-5;this.activeColors=[1,1,1,1];this.konamiCode=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];this.konamiIndex=0;this.isMetaKey=!1;this.isGradientLegendVisible=!1;this.isMouseDown=!1;this._readPixels=[];this.handleScroll=()=>{clearTimeout(this.scrollingTimeout),this.scrollingTimeout=window.setTimeout(this.handleScrollEnd,this.scrollingRefreshDelay),this.isGradientLegendVisible&&this.hideGradientLegend(),this.conf.playing&&(this.isScrolling=!0,this.pause())};this.handleScrollEnd=()=>{this.isScrolling=!1,this.isIntersecting&&this.play()};this.resize=()=>{if(this.width=window.innerWidth,this.minigl.setSize(this.width,this.height),this.minigl.setOrthographicCamera(),this.xSegCount=Math.ceil(this.width*this.conf.density[0]),this.ySegCount=Math.ceil(this.height*this.conf.density[1]),this.mesh.geometry.setTopology(this.xSegCount,this.ySegCount),this.mesh.geometry.setSize(this.width,this.height),this.mesh.material.uniforms.u_shadow_power.value=this.width<600?5:6,this.readPixels.length)for(let i of this.readPixels)i.canvasCoords=F(this.minigl.canvas,i.coords.x,i.coords.y)};this.debouncedResize=M(this.resize,250);this.handleMouseDown=i=>{!this.isGradientLegendVisible||(this.isMetaKey=i.metaKey,this.isMouseDown=!0,this.conf.playing===!1&&requestAnimationFrame(this.animate))};this.handleMouseUp=()=>{this.isMouseDown=!1};this.handleKeyDown=i=>{if(this.checkKonami(i),!!this.isGradientLegendVisible){switch(i.key){case"1":this.toggleColor(1);break;case"2":this.toggleColor(2);break;case"3":this.toggleColor(3);break;case"4":this.toggleColor(0);break;case"-":this.updateFrequency(this.freqDelta);break;case"+":this.updateFrequency(-this.freqDelta);break;case"_":this.updateFrequency(this.freqDelta);break;case"=":this.updateFrequency(-this.freqDelta);break;case"p":this.conf.playing?this.pause():this.play();break;case"ArrowUp":i.preventDefault(),this.amp+=10;break;case"ArrowDown":i.preventDefault(),this.amp-=10;break;case"ArrowLeft":this.freqX+=this.freqDelta;break;case"ArrowRight":this.freqX-=this.freqDelta;break;default:break}this.mesh.material.uniforms.u_vertDeform.value.noiseAmp.value=this.amp,this.mesh.material.uniforms.u_global.value.noiseFreq.value=[this.freqX,this.freqY],this.mesh.material.uniforms.u_active_colors.value=this.activeColors,this.minigl.render()}};this.animate=i=>{if(!this.shouldSkipFrame()||this.isMouseDown){if(this.t+=Math.min(i-this.last,1e3/15),this.last=i,this.isMouseDown){let d=160;this.isMetaKey&&(d=-160),this.t+=d}if(this.mesh.material.uniforms.u_time.value=this.t,this.minigl.render(),this.readPixels.length)for(let d=0;d<this.readPixels.length;d+=1){let u=this.readPixels[d];this.readColorAtPosition(u.canvasCoords.x,u.canvasCoords.y,u.pixels)}}if(this.last!==0&&this.isStatic){this.minigl.render(),this.disconnect();return}this.frame+=1,(this.isIntersecting&&this.conf.playing||this.isMouseDown)&&requestAnimationFrame(this.animate)};this.addIsLoadedClass=()=>{this.isIntersecting&&!this.isLoadedClass&&(this.isLoadedClass=!0,this.el.classList.add("isLoaded"),setTimeout(()=>{this.el.parentElement.classList.add("isLoaded")},3e3))};this.pause=()=>{this.conf.playing=!1};this.play=()=>{requestAnimationFrame(this.animate),this.conf.playing=!0}}connect(){return L(this,null,function*(){if(this.shaderFiles={vertex:z,noise:E,blend:R,fragment:O},this.conf={presetName:"",wireframe:!1,density:[.06,.16],zoom:1,rotation:0,playing:!0},document.querySelectorAll("canvas").length<1||this.isGPUDisabled){D.info("DID NOT LOAD HERO STRIPE CANVAS");return}this.minigl=new y(this.el,null,null,!0),requestAnimationFrame(()=>{this.el&&(this.computedCanvasStyle=getComputedStyle(this.el),this.waitForCssVars())}),this.scrollObserver=yield U.create(.1,!1),this.scrollObserver.observe(this.el),this.scrollObserver.onSeparate(()=>{window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("mousedown",this.handleMouseDown),window.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("keydown",this.handleKeyDown),this.isIntersecting=!1,this.conf.playing&&this.pause()}),this.scrollObserver.onIntersect(()=>{window.addEventListener("scroll",this.handleScroll),window.addEventListener("mousedown",this.handleMouseDown),window.addEventListener("mouseup",this.handleMouseUp),window.addEventListener("keydown",this.handleKeyDown),this.isIntersecting=!0,this.addIsLoadedClass(),this.play()})})}disconnect(){this.scrollObserver&&(window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("mousedown",this.handleMouseDown),window.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("keydown",this.handleKeyDown),this.scrollObserver.disconnect()),window.removeEventListener("resize",this.debouncedResize)}initMaterial(){this.uniforms={u_time:new this.minigl.Uniform({value:0}),u_shadow_power:new this.minigl.Uniform({value:5}),u_darken_top:new this.minigl.Uniform({value:this.el.dataset.jsDarkenTop===""?1:0}),u_active_colors:new this.minigl.Uniform({value:this.activeColors,type:"vec4"}),u_global:new this.minigl.Uniform({value:{noiseFreq:new this.minigl.Uniform({value:[this.freqX,this.freqY],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:5e-6})},type:"struct"}),u_vertDeform:new this.minigl.Uniform({value:{incline:new this.minigl.Uniform({value:Math.sin(this.angle)/Math.cos(this.angle)}),offsetTop:new this.minigl.Uniform({value:-.5}),offsetBottom:new this.minigl.Uniform({value:-.5}),noiseFreq:new this.minigl.Uniform({value:[3,4],type:"vec2"}),noiseAmp:new this.minigl.Uniform({value:this.amp}),noiseSpeed:new this.minigl.Uniform({value:10}),noiseFlow:new this.minigl.Uniform({value:3}),noiseSeed:new this.minigl.Uniform({value:this.seed})},type:"struct",excludeFrom:"fragment"}),u_baseColor:new this.minigl.Uniform({value:this.sectionColors[0],type:"vec3",excludeFrom:"fragment"}),u_waveLayers:new this.minigl.Uniform({value:[],excludeFrom:"fragment",type:"array"})};for(let i=1;i<this.sectionColors.length;i+=1)this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({value:{color:new this.minigl.Uniform({value:this.sectionColors[i],type:"vec3"}),noiseFreq:new this.minigl.Uniform({value:[2+i/this.sectionColors.length,3+i/this.sectionColors.length],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:11+i*.3}),noiseFlow:new this.minigl.Uniform({value:6.5+i*.3}),noiseSeed:new this.minigl.Uniform({value:this.seed+i*10}),noiseFloor:new this.minigl.Uniform({value:.1}),noiseCeil:new this.minigl.Uniform({value:.63+i*.07})},type:"struct"}));return this.vertexShader=[this.shaderFiles.noise,this.shaderFiles.blend,this.shaderFiles.vertex].join(`

`),new this.minigl.Material(this.vertexShader,this.shaderFiles.fragment,this.uniforms)}initMesh(){this.material=this.initMaterial(),this.geometry=new this.minigl.PlaneGeometry,this.mesh=new this.minigl.Mesh(this.geometry,this.material)}shouldSkipFrame(){if(window.document.hidden||!this.conf.playing||this.frame%2===0)return!0}checkKonami(i){i.key.toLowerCase()===this.konamiCode[this.konamiIndex]?this.konamiIndex+=1:this.konamiIndex=0,this.konamiIndex>1&&i.preventDefault(),!(this.konamiIndex<this.konamiCode.length)&&this.showGradientLegend()}updateFrequency(i){this.freqX+=i,this.freqY+=i}toggleColor(i){this.activeColors[i]=this.activeColors[i]===0?1:0}showGradientLegend(){this.width>this.minWidth&&(this.isGradientLegendVisible=!0,document.body.classList.add("isGradientLegendVisible"))}hideGradientLegend(){this.isGradientLegendVisible=!1,document.body.classList.remove("isGradientLegendVisible")}init(){this.initGradientColors(),this.initMesh(),this.resize(),requestAnimationFrame(this.animate),window.addEventListener("resize",this.debouncedResize)}waitForCssVars(){if(this.computedCanvasStyle&&this.computedCanvasStyle.getPropertyValue("--gradientColorOne").indexOf("#")!==-1)this.init(),this.addIsLoadedClass();else{if(this.cssVarRetries+=1,this.cssVarRetries>this.maxCssVarRetries){this.sectionColors=[16711680,16711680,16711935,65280,255],this.init();return}requestAnimationFrame(()=>this.waitForCssVars())}}initGradientColors(){this.sectionColors=["--gradientColorZero","--gradientColorOne","--gradientColorTwo","--gradientColorThree"].map(i=>{let d=this.computedCanvasStyle.getPropertyValue(i).trim();return d.length===4&&(d=`#${d.substr(1).split("").map(r=>r+r).join("")}`),d&&`0x${d.substr(1)}`}).filter(Boolean).map(I)}readColorAtPosition(i,d,u){this.minigl.gl.readPixels(i,d,1,1,this.minigl.gl.RGBA,this.minigl.gl.UNSIGNED_BYTE,u)}get readPixels(){return this._readPixels}set readPixels(i){this._readPixels=i}};A.register("Gradient",w);export{w as a};
