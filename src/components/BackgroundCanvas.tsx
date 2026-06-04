/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

// WebGL Simple Vertex Shader string
const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Simplex Noise 2D Shader function embedded in the custom fragment shader
const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
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

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    vec2 mouse = u_mouse.xy / u_resolution.xy;
    mouse.x *= u_resolution.x / u_resolution.y;
    
    float dist = distance(st, mouse);
    float force = smoothstep(0.5, 0.0, dist);
    
    vec2 q = vec2(0.0);
    q.x = snoise(st + u_time * 0.04);
    q.y = snoise(st + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.12 * u_time);
    r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.10 * u_time);
    
    r += force * 0.12;
    float f = snoise(st + r);
    
    // Deep luxurious space-black baseline with very soft golden ambient elements
    vec3 spaceDark = vec3(0.005, 0.005, 0.008);
    vec3 goldMuted = vec3(0.06, 0.05, 0.035);
    vec3 goldBright = vec3(0.18, 0.15, 0.08); // Muted gold highlights to guarantee high text contrast
    
    vec3 color = mix(spaceDark, goldMuted, clamp(f * 1.5, 0.0, 1.0));
    color = mix(color, goldBright, clamp(length(q) * force * 0.4, 0.0, 1.0));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Record client mouse coordinates globally for CSS gradient fallback interaction
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, depth: false }) || 
           canvas.getContext('experimental-webgl', { alpha: false, depth: false }) as WebGLRenderingContext;
    } catch (e) {
      console.warn('[WEBGL] Context acquisition caught exception. Falling back to CSS radial dynamic gradients.', e);
      setWebglError(true);
      return;
    }

    if (!gl) {
      console.warn('[WEBGL] Browser does not support WebGL. Falling back gracefully to CSS layout.');
      setWebglError(true);
      return;
    }

    // Helper: Compile single WebGL Shader
    function compileShader(src: string, type: number): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('[WEBGL] Shader compilation error:', gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);

    if (!vs || !fs) {
      console.error('[WEBGL] Program compilation failure. Sliding back seamlessly to safe visual layer.');
      setWebglError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglError(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[WEBGL] Linker errors:', gl.getProgramInfoLog(program));
      setWebglError(true);
      return;
    }

    gl.useProgram(program);

    // Setup coordinates mesh buffer (Full viewport screen card)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Extract locations of uniform variables
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Layout updates
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * Math.min(window.devicePixelRatio, 2);
      canvas.height = height * Math.min(window.devicePixelRatio, 2);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.useProgram(program);
      gl!.uniform2f(resolutionLoc, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      if (!gl) return;
      
      // Interpolate mouse movement for smooth inertial action
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const elapsed = (Date.now() - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform1f(timeLoc, elapsed);
      // Pass coordinates resolved into HD DPI space
      gl.uniform2f(mouseLoc, mouseX * Math.min(window.devicePixelRatio, 2), mouseY * Math.min(window.devicePixelRatio, 2));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      try {
        gl!.deleteProgram(program);
        gl!.deleteShader(vs);
        gl!.deleteShader(fs);
        gl!.deleteBuffer(positionBuffer);
      } catch (err) {
        // Suppress cleanup exceptions
      }
    };
  }, [webglError]);

  if (webglError) {
    // Elegant, premium backup radial CSS animation fallback
    const gradientX = (coords.x / window.innerWidth) * 100;
    const gradientY = (coords.y / window.innerHeight) * 100;

    return (
      <div 
        id="css-fluid-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          backgroundColor: '#030305',
          background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(201, 168, 76, 0.04) 0%, rgba(3, 3, 5, 1) 75%)`,
          transition: 'background 0.15s ease-out',
        }}
      />
    );
  }

  return (
    <canvas
      id="webgl-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
}
