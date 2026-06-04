/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  spin: number;
  spinSpeed: number;
}

export default function SparkCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isMobile = useRef(false);

  useEffect(() => {
    // Detect mobile touch devices to prevent cursor spark overflow
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android|ipad|iphone|ipod/i.test(userAgent) || window.matchMedia("(max-width: 768px)").matches) {
      isMobile.current = true;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse move and generate sparks
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      const dx = mx - lastMousePos.current.x;
      const dy = my - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn when mouse is moving
      if (distance > 2) {
        // Spawn 1 to 3 golden particles depending on distance
        const count = Math.min(Math.floor(distance / 6) + 1, 3);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.3;
          
          sparksRef.current.push({
            x: mx,
            y: my,
            vx: Math.cos(angle) * speed + (dx * 0.1), // inherit some mouse velocity
            vy: Math.sin(angle) * speed + (dy * 0.1) - 0.2, // float upwards slightly
            alpha: 1,
            size: Math.random() * 2.5 + 1.2,
            color: Math.random() > 0.3 ? '#e2c06a' : '#c9a84c',
            spin: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.1
          });
        }
      }

      lastMousePos.current = { x: mx, y: my };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Continuous physics drawing loop
    let animId: number;
    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;
        
        // Decelerate and fade out
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy += 0.02; // slight gravity pull
        p.alpha -= 0.025; // fade rate
        p.spin += p.spinSpeed;

        if (p.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Draw diamond-shaped glowing spark
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = p.alpha;
        
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#e2c06a';

        // Draw elegant diamond vector
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.7, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isMobile.current) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  );
}
