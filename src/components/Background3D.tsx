import React, { useEffect, useRef } from 'react';

interface Background3DProps {
  reducedMotion: boolean;
  scrollY: number;
}

interface BgNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
}

export const Background3D: React.FC<Background3DProps> = ({ reducedMotion, scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const nodeCount = isMobile ? 14 : 32;

    const nodes: BgNode[] = Array.from({ length: nodeCount }, (_, idx) => ({
      x: ((idx * 197) % 1000) / 1000 * width,
      y: ((idx * 353) % 1000) / 1000 * height,
      z: 0.35 + ((idx * 73) % 65) / 100,
      vx: (((idx % 2 === 0 ? 1 : -1) * (12 + (idx % 9))) / 100) * (isMobile ? 0.6 : 1),
      vy: (((idx % 3 === 0 ? 1 : -1) * (10 + (idx % 7))) / 100) * (isMobile ? 0.6 : 1),
      radius: 1.1 + ((idx * 29) % 14) / 10,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (reducedMotion) {
        drawFrame();
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const maxConnectDist = isMobile ? 115 : 155;

      // Update positions if motion is permitted
      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx * n.z;
          n.y += n.vy * n.z;

          if (n.x < 0) n.x = width;
          if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          if (n.y > height) n.y = 0;
        }
      }

      // Draw thin connecting neural lines
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxConnectDist * maxConnectDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxConnectDist) * 0.08 * ((nodes[i].z + nodes[j].z) * 0.5);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw subtle depth particles
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const alpha = 0.14 + n.z * 0.18;
        ctx.fillStyle = `rgba(125, 211, 252, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * n.z, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!document.hidden) {
        drawFrame();
      }
      if (!reducedMotion) {
        animationFrameId = window.requestAnimationFrame(loop);
      }
    };

    drawFrame();
    if (!reducedMotion) {
      animationFrameId = window.requestAnimationFrame(loop);
    }

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  // Subtle scroll depth transform (capped and disabled under reducedMotion)
  const gridShiftY = reducedMotion ? 0 : Math.min(scrollY * 0.04, 60);
  const orbShiftY = reducedMotion ? 0 : Math.min(scrollY * -0.05, 80);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep Space Obsidian Base */}
      <div className="absolute inset-0 bg-[#07090E]" />

      {/* Subtle Ambient Volumetric Lighting Orbs */}
      <div
        className="absolute -top-48 left-1/4 w-[620px] h-[620px] rounded-full opacity-25 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.28) 0%, rgba(30,58,138,0.08) 60%, transparent 100%)',
          transform: `translate3d(0, ${orbShiftY}px, 0)`,
        }}
      />
      <div
        className="absolute top-[38%] -right-40 w-[540px] h-[540px] rounded-full opacity-20 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, rgba(15,23,42,0.05) 65%, transparent 100%)',
          transform: `translate3d(0, ${-orbShiftY * 0.6}px, 0)`,
        }}
      />

      {/* Very Subtle 3D Perspective Horizon Grid */}
      <div
        className="absolute inset-x-0 top-0 h-[720px] opacity-[0.11]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 25%, black 20%, transparent 80%)',
          transform: `perspective(900px) rotateX(52deg) translate3d(0, ${gridShiftY}px, -80px)`,
          transformOrigin: 'center top',
        }}
      />

      {/* Lightweight 3D Neural Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
    </div>
  );
};
