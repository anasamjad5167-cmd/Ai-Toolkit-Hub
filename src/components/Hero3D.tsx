import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Compass, Sliders, Sparkles } from 'lucide-react';
import { ToolCategory } from '../data/aiToolsData';
import { CategoryIcon3D } from './Icons3D';

interface Hero3DProps {
  reducedMotion: boolean;
  onExploreTools: () => void;
  onTryFreeTools: () => void;
  onSelectCategory: (category: ToolCategory) => void;
}

interface FloatingLabelCard {
  category: ToolCategory;
  subtitle: string;
  positionClass: string;
  depthFactor: number;
  translateZ: number;
}

const FLOATING_HERO_CARDS: FloatingLabelCard[] = [
  {
    category: 'Writing',
    subtitle: 'Long-Form & Copy',
    positionClass: 'top-2 left-2 sm:top-4 sm:left-4',
    depthFactor: 1.35,
    translateZ: 42,
  },
  {
    category: 'Coding',
    subtitle: 'Repo & IDE Agents',
    positionClass: 'top-4 right-2 sm:top-6 sm:right-4',
    depthFactor: 1.6,
    translateZ: 56,
  },
  {
    category: 'Images',
    subtitle: 'Studio & Vector',
    positionClass: 'top-[42%] -left-1 sm:left-0',
    depthFactor: 1.15,
    translateZ: 28,
  },
  {
    category: 'Video',
    subtitle: 'Temporal Cinema',
    positionClass: 'top-[44%] -right-1 sm:right-0',
    depthFactor: 1.45,
    translateZ: 48,
  },
  {
    category: 'Research',
    subtitle: 'Cited Literature',
    positionClass: 'bottom-4 left-3 sm:bottom-6 sm:left-8',
    depthFactor: 1.5,
    translateZ: 50,
  },
  {
    category: 'Productivity',
    subtitle: 'Automated Ops',
    positionClass: 'bottom-3 right-3 sm:bottom-5 sm:right-8',
    depthFactor: 1.25,
    translateZ: 34,
  },
];

interface SphereNode3D {
  bx: number;
  by: number;
  bz: number;
  size: number;
  isPrimary: boolean;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  reducedMotion,
  onExploreTools,
  onTryFreeTools,
  onSelectCategory,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const coreCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const [activeHoverCategory, setActiveHoverCategory] = useState<ToolCategory | null>(null);

  // Smoothly interpolated mouse coordinates (-1 to 1)
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 768) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    // Clamp to subtle range so movement is never aggressive
    targetMouseRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  const handlePointerLeave = () => {
    targetMouseRef.current = { x: 0, y: 0 };
  };

  // Render the 3D AI Intelligence Core on Canvas
  useEffect(() => {
    const canvas = coreCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasSupported(false);
      return;
    }

    const size = 440;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 42 : 68;
    const radius = 108;

    // Generate Fibonacci 3D Lattice Nodes for the AI Core
    const nodes: SphereNode3D[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const rAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * rAtY;
      const z = Math.sin(theta) * rAtY;
      nodes.push({
        bx: x * radius,
        by: y * radius,
        bz: z * radius,
        size: i % 6 === 0 ? 3.2 : 1.9,
        isPrimary: i % 6 === 0,
      });
    }

    let angleY = 0.4;
    let angleX = 0.22;
    let frameId = 0;
    let tick = 0;

    const renderCore = () => {
      tick += 1;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Damped mouse interpolation
      if (!reducedMotion) {
        currentMouseRef.current.x +=
          (targetMouseRef.current.x - currentMouseRef.current.x) * 0.06;
        currentMouseRef.current.y +=
          (targetMouseRef.current.y - currentMouseRef.current.y) * 0.06;

        // Update React parallax state every 2 frames for smooth DOM card motion
        if (tick % 2 === 0 && !isMobile) {
          setParallaxOffset({
            x: currentMouseRef.current.x,
            y: currentMouseRef.current.y,
          });
        }

        angleY += 0.0045 + currentMouseRef.current.x * 0.006;
        angleX = 0.22 + currentMouseRef.current.y * 0.22 + Math.sin(tick * 0.012) * 0.06;
      }

      // 1. Volumetric Outer Halo Glow
      const outerGlow = ctx.createRadialGradient(cx, cy, 18, cx, cy, 175);
      outerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.36)');
      outerGlow.addColorStop(0.45, 'rgba(37, 99, 235, 0.16)');
      outerGlow.addColorStop(0.78, 'rgba(15, 23, 42, 0.04)');
      outerGlow.addColorStop(1, 'rgba(7, 9, 14, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 175, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Orbital Telemetry Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleY * 0.35);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 146, 52, 0.35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-angleY * 0.7);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 134, 64, -0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Project 3D Core Nodes
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const fov = 340;

      const projected = nodes.map((n) => {
        // Rotate around Y
        const x1 = n.bx * cosY - n.bz * sinY;
        const z1 = n.bz * cosY + n.bx * sinY;
        // Rotate around X
        const y2 = n.by * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.by * sinX;

        const scale = fov / (fov + z2 + 140);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          z: z2,
          scale,
          size: n.size,
          isPrimary: n.isPrimary,
        };
      });

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      // 4. Inner Crystalline Energy Sphere
      const coreSphere = ctx.createRadialGradient(
        cx - 14 + currentMouseRef.current.x * 8,
        cy - 14 + currentMouseRef.current.y * 8,
        6,
        cx,
        cy,
        74
      );
      coreSphere.addColorStop(0, 'rgba(224, 242, 254, 0.92)');
      coreSphere.addColorStop(0.28, 'rgba(56, 189, 248, 0.52)');
      coreSphere.addColorStop(0.65, 'rgba(29, 78, 216, 0.24)');
      coreSphere.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = coreSphere;
      ctx.beginPath();
      ctx.arc(cx, cy, 74, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw 3D Lattice Connections
      const maxEdgeDist = isMobile ? 54 : 46;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxEdgeDist * maxEdgeDist) {
            const depthAlpha = ((a.z + b.z + 220) / 440) * 0.34;
            ctx.strokeStyle = `rgba(125, 211, 252, ${Math.max(0.05, Math.min(0.42, depthAlpha)).toFixed(3)})`;
            ctx.lineWidth = a.isPrimary && b.isPrimary ? 1.15 : 0.7;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // 6. Draw Projected 3D Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const depthNorm = (p.z + radius) / (radius * 2);
        const alpha = 0.25 + depthNorm * 0.72;
        const r = Math.max(1.1, p.size * p.scale * 1.15);

        if (p.isPrimary && depthNorm > 0.45) {
          ctx.fillStyle = `rgba(56, 189, 248, ${(alpha * 0.35).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(p.px, p.py, r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = p.isPrimary
          ? `rgba(240, 249, 255, ${alpha.toFixed(2)})`
          : `rgba(125, 211, 252, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    renderCore();

    const animate = () => {
      if (!document.hidden) {
        renderCore();
      }
      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(animate);
    } else {
      setParallaxOffset({ x: 0, y: 0 });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  const stageTiltX = reducedMotion ? 0 : -parallaxOffset.y * 5.5;
  const stageTiltY = reducedMotion ? 0 : parallaxOffset.x * 6.5;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/70"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT COLUMN: Proposition, Headline, Subheadline, Primary Actions */}
          <div className="lg:col-span-6 space-y-7 z-10">
            {/* Unboxed Clean Kicker (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-sky-400">
              <span>Spatial AI Directory & Utility Suite</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Updated October 2026</span>
            </div>

            {/* Required Headline */}
            <h1
              id="hero-heading"
              className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Discover the right AI tool for every task
            </h1>

            {/* Required Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Explore AI tools, compare your options, and use powerful free productivity utilities.
            </p>

            {/* Required CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onExploreTools}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all duration-150 shadow-[0_0_28px_-4px_rgba(56,189,248,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 whitespace-nowrap cursor-pointer"
              >
                <Compass className="w-4 h-4 transition-transform duration-150 group-hover:rotate-12" />
                <span>Explore AI Tools</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={onTryFreeTools}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-sky-400/40 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Try Free Tools</span>
              </button>
            </div>

            {/* Clean Unboxed Platform Proof & Telemetry (Strictly Verifiable Counts) */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-white tabular-nums">
                  24
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Listed AI Tools
                </div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-white tabular-nums">
                  8
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Capability Categories
                </div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-white tabular-nums">
                  6
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Free Browser Utilities
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 3D AI Intelligence Core Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div
              ref={stageRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              className="relative w-full max-w-[540px] h-[420px] sm:h-[470px] flex items-center justify-center perspective-1400 select-none"
              role="region"
              aria-label="Interactive 3D AI intelligence core and category selector"
            >
              {/* 3D Tilt Stage */}
              <div
                className="relative w-full h-full flex items-center justify-center preserve-3d"
                style={{
                  transform: `rotateX(${stageTiltX.toFixed(2)}deg) rotateY(${stageTiltY.toFixed(2)}deg)`,
                  transition: reducedMotion ? 'none' : 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Ambient Holographic Base Ring */}
                <div
                  className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-sky-400/15 pointer-events-none"
                  style={{
                    transform: 'rotateX(68deg) translateZ(-60px)',
                    boxShadow: '0 0 60px 8px rgba(14, 165, 233, 0.12) inset',
                  }}
                  aria-hidden="true"
                />

                {/* Central 3D AI Intelligence Core Canvas (with static SVG fallback) */}
                {canvasSupported ? (
                  <canvas
                    ref={coreCanvasRef}
                    className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] pointer-events-none"
                    aria-hidden="true"
                  />
                ) : (
                  /* Graceful Static Fallback if Canvas/WebGL is unavailable */
                  <div
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/30 via-blue-600/20 to-slate-900 border border-sky-400/40 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.25)]"
                    aria-hidden="true"
                  >
                    <Sparkles className="w-16 h-16 text-sky-300" />
                  </div>
                )}

                {/* Center Core Status Label */}
                <div
                  className="absolute pointer-events-none flex flex-col items-center justify-center text-center"
                  style={{
                    transform: `translate3d(${(parallaxOffset.x * 6).toFixed(1)}px, ${(parallaxOffset.y * 6).toFixed(1)}px, 24px)`,
                  }}
                  aria-hidden="true"
                >
                  <span className="text-[11px] font-mono tracking-widest text-sky-200/90 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-sky-400/25">
                    {activeHoverCategory ? `DOMAIN · ${activeHoverCategory.toUpperCase()}` : 'AI CORE · 8 DOMAINS'}
                  </span>
                </div>

                {/* 6 Floating 3D Category Cards around the Core */}
                {FLOATING_HERO_CARDS.map((card, index) => {
                  const moveX = reducedMotion ? 0 : parallaxOffset.x * 14 * card.depthFactor;
                  const moveY = reducedMotion ? 0 : parallaxOffset.y * 12 * card.depthFactor;
                  const isHovered = activeHoverCategory === card.category;

                  return (
                    <button
                      key={card.category}
                      type="button"
                      onClick={() => onSelectCategory(card.category)}
                      onMouseEnter={() => setActiveHoverCategory(card.category)}
                      onMouseLeave={() => setActiveHoverCategory(null)}
                      onFocus={() => setActiveHoverCategory(card.category)}
                      onBlur={() => setActiveHoverCategory(null)}
                      style={{
                        transform: reducedMotion
                          ? 'none'
                          : `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, ${card.translateZ}px)`,
                        animationDelay: `${index * 0.65}s`,
                      }}
                      className={`group absolute ${card.positionClass} ${
                        reducedMotion ? '' : 'animate-float-slow'
                      } flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md border ${
                        isHovered
                          ? 'border-sky-400/70 shadow-[0_12px_28px_-6px_rgba(56,189,248,0.35)]'
                          : 'border-slate-700/70 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.75)]'
                      } transition-colors duration-150 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`}
                      aria-label={`Filter AI tools by ${card.category}`}
                    >
                      <CategoryIcon3D category={card.category} size="sm" />
                      <div className="pr-1">
                        <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors whitespace-nowrap">
                          {card.category}
                        </div>
                        <div className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
                          {card.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
