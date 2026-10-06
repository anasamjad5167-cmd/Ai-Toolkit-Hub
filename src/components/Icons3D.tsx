import React from 'react';
import { ToolCategory, FreeUtilityId } from '../data/aiToolsData';

interface CategoryIconProps {
  category: ToolCategory;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryIcon3D: React.FC<CategoryIconProps> = ({ category, size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-13 h-13';

  return (
    <div
      className={`relative ${dimensions} flex items-center justify-center select-none icon-3d-pop`}
      aria-hidden="true"
    >
      {/* Ambient 3D Base Pedestal Glow */}
      <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-transparent blur-md pointer-events-none" />

      {category === 'Writing' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(14,165,233,0.28)]">
          <defs>
            <linearGradient id="docBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="docFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          {/* 3D Shadow Layer */}
          <rect x="12" y="14" width="32" height="40" rx="6" transform="rotate(-6 28 34)" fill="url(#docBack)" stroke="#475569" strokeWidth="1" />
          {/* Extruded 3D Document Slab */}
          <rect x="16" y="10" width="32" height="40" rx="6" fill="url(#docFront)" stroke="#BAE6FD" strokeWidth="1.2" />
          {/* 3D Raised Text Bars */}
          <rect x="22" y="19" width="16" height="3" rx="1.5" fill="#F8FAFC" opacity="0.95" />
          <rect x="22" y="26" width="20" height="2.5" rx="1.25" fill="#E0F2FE" opacity="0.8" />
          <rect x="22" y="32" width="18" height="2.5" rx="1.25" fill="#E0F2FE" opacity="0.75" />
          <rect x="22" y="38" width="12" height="2.5" rx="1.25" fill="#BAE6FD" opacity="0.7" />
          {/* 3D Volumetric Sparkle */}
          <path
            d="M48 8 L50.5 15.5 L58 18 L50.5 20.5 L48 28 L45.5 20.5 L38 18 L45.5 15.5 Z"
            fill="url(#sparkleGrad)"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          <circle cx="48" cy="18" r="2" fill="#FFFFFF" />
        </svg>
      )}

      {category === 'Images' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(56,189,248,0.28)]">
          <defs>
            <linearGradient id="frameOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="frameInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="prismPeak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Back Depth Plane */}
          <rect x="10" y="16" width="40" height="34" rx="7" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
          {/* Main 3D Frame */}
          <rect x="14" y="12" width="40" height="34" rx="7" fill="url(#frameOuter)" stroke="#E0F2FE" strokeWidth="1.2" />
          <rect x="18" y="16" width="32" height="26" rx="4" fill="url(#frameInner)" />
          {/* 3D Sun Orb */}
          <circle cx="41" cy="24" r="4.5" fill="#FDE047" />
          {/* 3D Layered Mountain Prisms */}
          <polygon points="20,42 30,27 40,42" fill="url(#prismPeak)" />
          <polygon points="31,42 40,30 49,42" fill="#93C5FD" opacity="0.88" />
        </svg>
      )}

      {category === 'Video' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(59,130,246,0.3)]">
          <defs>
            <linearGradient id="videoSlab" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="playPrism" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
          </defs>
          {/* Orbital Ring */}
          <ellipse cx="32" cy="34" rx="25" ry="11" transform="rotate(-18 32 34)" fill="none" stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.65" />
          {/* 3D Extruded Play Cube */}
          <rect x="13" y="13" width="38" height="38" rx="10" fill="url(#videoSlab)" stroke="#7DD3FC" strokeWidth="1.3" />
          {/* 3D Beveled Play Triangle */}
          <polygon points="26,22 26,42 43,32" fill="#0284C7" transform="translate(2, 2)" />
          <polygon points="26,22 26,42 43,32" fill="url(#playPrism)" stroke="#FFFFFF" strokeWidth="0.8" />
        </svg>
      )}

      {category === 'Coding' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(6,182,212,0.3)]">
          <defs>
            <linearGradient id="codeBlock" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0E7490" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="bracketGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          {/* 3D Base Plate */}
          <rect x="10" y="12" width="44" height="40" rx="9" fill="url(#codeBlock)" stroke="#38BDF8" strokeWidth="1.2" />
          {/* Extruded Shadow of Brackets */}
          <path d="M25 23 L17 32 L25 41 M39 23 L47 32 L39 41 M35 21 L29 43" stroke="#083344" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(1.5, 2)" />
          {/* Foreground 3D Brackets */}
          <path d="M25 23 L17 32 L25 41" stroke="url(#bracketGlow)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M39 23 L47 32 L39 41" stroke="url(#bracketGlow)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="35" y1="21" x2="29" y2="43" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}

      {category === 'Research' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(56,189,248,0.28)]">
          <defs>
            <radialGradient id="lensGlass" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#0284C7" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          {/* Discovery Constellation Nodes behind Lens */}
          <line x1="20" y1="28" x2="29" y2="22" stroke="#7DD3FC" strokeWidth="1.5" />
          <line x1="29" y1="22" x2="36" y2="30" stroke="#7DD3FC" strokeWidth="1.5" />
          {/* 3D Magnifying Glass Rim (Back Extrusion) */}
          <circle cx="29" cy="28" r="15" fill="none" stroke="#1E3A8A" strokeWidth="4.5" />
          {/* 3D Handle */}
          <line x1="39" y1="38" x2="51" y2="50" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
          <line x1="39" y1="38" x2="50" y2="49" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" />
          {/* 3D Optical Lens */}
          <circle cx="28" cy="27" r="15" fill="url(#lensGlass)" stroke="#7DD3FC" strokeWidth="2.5" />
          {/* Specular Nodes inside Lens */}
          <circle cx="22" cy="28" r="2.5" fill="#FFFFFF" />
          <circle cx="29" cy="22" r="3" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="35" cy="29" r="2.5" fill="#FFFFFF" />
        </svg>
      )}

      {category === 'Education' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(59,130,246,0.28)]">
          <defs>
            <linearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="capBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Skullcap Base 3D Cylinder */}
          <path d="M18 31 L18 43 C18 47 46 47 46 43 L46 31" fill="url(#capBase)" stroke="#38BDF8" strokeWidth="1.3" />
          {/* Isometric Mortarboard Diamond */}
          <polygon points="32,14 55,26 32,38 9,26" fill="#0F172A" transform="translate(0, 2.5)" />
          <polygon points="32,14 55,26 32,38 9,26" fill="url(#capTop)" stroke="#E0F2FE" strokeWidth="1.2" />
          {/* Center Button & 3D Tassel */}
          <circle cx="32" cy="26" r="2.5" fill="#FFFFFF" />
          <path d="M32 26 Q44 30 49 41" fill="none" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="49" cy="42" r="2.5" fill="#FDE047" />
        </svg>
      )}

      {category === 'Productivity' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(56,189,248,0.28)]">
          <defs>
            <linearGradient id="dashBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>
            <linearGradient id="bar3d" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Back Floating Panel */}
          <rect x="10" y="14" width="40" height="32" rx="6" fill="url(#dashBg)" stroke="#475569" strokeWidth="1.2" />
          {/* Front Floating Holographic Dashboard */}
          <rect x="15" y="19" width="40" height="32" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.4" />
          {/* 3D Columns */}
          <rect x="22" y="36" width="5" height="9" rx="1.5" fill="url(#bar3d)" />
          <rect x="30" y="30" width="5" height="15" rx="1.5" fill="url(#bar3d)" />
          <rect x="38" y="25" width="5" height="20" rx="1.5" fill="#38BDF8" />
          <circle cx="47" cy="28" r="3" fill="#F8FAFC" />
        </svg>
      )}

      {category === 'Audio' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(56,189,248,0.3)]">
          <defs>
            <linearGradient id="wavePillar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          {/* 3D Acoustic Ring */}
          <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="#1E40AF" strokeWidth="1.5" />
          {/* 3D Extruded Waveform Pillars */}
          <rect x="14" y="26" width="4.5" height="12" rx="2.25" fill="url(#wavePillar)" />
          <rect x="21.5" y="19" width="4.5" height="26" rx="2.25" fill="url(#wavePillar)" />
          <rect x="29.5" y="12" width="5" height="40" rx="2.5" fill="url(#wavePillar)" stroke="#FFFFFF" strokeWidth="0.6" />
          <rect x="38" y="20" width="4.5" height="24" rx="2.25" fill="url(#wavePillar)" />
          <rect x="45.5" y="25" width="4.5" height="14" rx="2.25" fill="url(#wavePillar)" />
        </svg>
      )}
    </div>
  );
};

interface UtilityIconProps {
  utilityId: FreeUtilityId;
}

export const UtilityIcon3D: React.FC<UtilityIconProps> = ({ utilityId }) => {
  return (
    <div
      className="relative w-12 h-12 flex items-center justify-center select-none icon-3d-pop"
      aria-hidden="true"
    >
      <div className="absolute inset-0.5 rounded-xl bg-sky-500/15 blur-md pointer-events-none" />

      {utilityId === 'word-counter' && (
        /* Floating 3D Document */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.25)]">
          <rect x="14" y="14" width="32" height="38" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1.2" transform="rotate(-5 30 33)" />
          <rect x="18" y="10" width="32" height="38" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="24" y1="20" x2="42" y2="20" stroke="#7DD3FC" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="24" y1="28" x2="44" y2="28" stroke="#E0F2FE" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="24" y1="36" x2="36" y2="36" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="46" cy="42" r="8" fill="#0284C7" stroke="#E0F2FE" strokeWidth="1.2" />
          <text x="46" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">W</text>
        </svg>
      )}

      {utilityId === 'password-generator' && (
        /* 3D Lock */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.25)]">
          <path d="M22 28 V20 C22 14 42 14 42 20 V28" fill="none" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M22 28 V20 C22 14 42 14 42 20 V28" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <rect x="15" y="27" width="34" height="26" rx="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
          <circle cx="32" cy="38" r="3.5" fill="#38BDF8" />
          <path d="M32 41 L32 46" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}

      {utilityId === 'json-formatter' && (
        /* 3D Code Brackets */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.25)]">
          <rect x="11" y="12" width="42" height="40" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.4" />
          <path d="M24 20 C20 20 20 29 17 32 C20 35 20 44 24 44" fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 20 C44 20 44 29 47 32 C44 35 44 44 40 44" fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="28" r="2.2" fill="#F8FAFC" />
          <circle cx="32" cy="36" r="2.2" fill="#38BDF8" />
        </svg>
      )}

      {utilityId === 'percentage-calculator' && (
        /* 3D Calculator */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.25)]">
          <rect x="15" y="10" width="34" height="44" rx="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="20" y="15" width="24" height="10" rx="2.5" fill="#0284C7" opacity="0.35" stroke="#7DD3FC" strokeWidth="1" />
          <line x1="25" y1="43" x2="39" y2="29" stroke="#E0F2FE" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="27" cy="31" r="2.5" fill="#38BDF8" />
          <circle cx="37" cy="41" r="2.5" fill="#38BDF8" />
        </svg>
      )}

      {utilityId === 'color-converter' && (
        /* 3D Color Sphere */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.3)]">
          <defs>
            <radialGradient id="sphere3D" cx="32%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#38BDF8" />
              <stop offset="68%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>
          <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(-24 32 32)" fill="none" stroke="#7DD3FC" strokeWidth="1.4" opacity="0.7" />
          <circle cx="32" cy="32" r="16" fill="url(#sphere3D)" stroke="#BAE6FD" strokeWidth="1" />
        </svg>
      )}

      {utilityId === 'prompt-generator' && (
        /* 3D Magic Wand / Prompt Card */
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_12px_rgba(56,189,248,0.28)]">
          <rect x="12" y="14" width="32" height="36" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
          <line x1="18" y1="23" x2="34" y2="23" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="18" y1="30" x2="30" y2="30" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
          {/* 3D Luminous Wand */}
          <line x1="24" y1="46" x2="48" y2="22" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          <line x1="24" y1="46" x2="48" y2="22" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="49,13 51,18 56,20 51,22 49,27 47,22 42,20 47,18" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.7" />
        </svg>
      )}
    </div>
  );
};

interface ToolEmblem3DProps {
  name: string;
  category: ToolCategory;
}

export const ToolEmblem3D: React.FC<ToolEmblem3DProps> = ({ name, category }) => {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="relative w-11 h-11 rounded-xl flex items-center justify-center select-none icon-3d-pop shrink-0"
      style={{
        background:
          'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        boxShadow:
          '0 6px 16px -4px rgba(2, 132, 199, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
        border: '1px solid rgba(125, 211, 252, 0.24)',
      }}
      aria-hidden="true"
    >
      {/* Subtle top-left 3D bevel highlight */}
      <div className="absolute inset-x-1 top-0.5 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
      <span className="font-display text-sm font-bold tracking-tight text-sky-100">
        {initials}
      </span>
      <span
        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-sky-400/50 flex items-center justify-center"
        title={category}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
      </span>
    </div>
  );
};
