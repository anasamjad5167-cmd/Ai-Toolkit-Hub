import React, { useRef, useState } from 'react';
import { ArrowUpRight, Check, Scale, SlidersHorizontal } from 'lucide-react';
import { AITool } from '../data/aiToolsData';
import { ToolEmblem3D } from './Icons3D';

interface ToolCard3DProps {
  tool: AITool;
  reducedMotion: boolean;
  isCompared: boolean;
  onToggleCompare: (toolId: string) => void;
  onInspectTool: (tool: AITool) => void;
}

export const ToolCard3D: React.FC<ToolCard3DProps> = ({
  tool,
  reducedMotion,
  isCompared,
  onToggleCompare,
  onInspectTool,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 768) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 5.2,
      ry: x * 5.2,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  const transformStyle =
    !reducedMotion && tilt.active
      ? `perspective(1000px) translate3d(0, -4px, 0) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`
      : 'perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className="group relative rounded-2xl p-6 card-3d-surface flex flex-col justify-between preserve-3d"
    >
      <div
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Header: 3D Emblem + Primary Title + Quiet Unboxed Metadata */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <ToolEmblem3D name={tool.name} category={tool.category} />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-white tracking-tight truncate group-hover:text-sky-200 transition-colors">
                <a
                  href={`/ai-tools/${tool.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onInspectTool(tool);
                  }}
                  className="hover:underline focus-visible:outline-2 focus-visible:outline-sky-400 rounded"
                >
                  {tool.name}
                </a>
              </h3>
              {/* Clean unboxed metadata with typographic separators (Zero-Pill & Zero-Fake-Rating Rule) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span className="text-sky-300 font-medium">{tool.category}</span>
                <span aria-hidden="true">·</span>
                <span>{tool.pricing}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">
                  {tool.apiAvailable ? 'API Available' : 'Web / App'}
                </span>
              </div>
            </div>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800/70 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-sky-400"
            aria-label={`Visit ${tool.name} official website (opens in new tab)`}
            title={`Visit ${tool.name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Tagline & Description */}
        <p className="mt-4 text-sm font-medium text-slate-200 leading-snug">
          {tool.tagline}
        </p>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Use Case & Free Plan Note (Unboxed Text) */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span className="truncate">{tool.primaryUseCase}</span>
          <span className="font-mono text-[11px] text-slate-300 shrink-0">
            {tool.pricing}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onInspectTool(tool)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/70 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleCompare(tool.id)}
          aria-pressed={isCompared}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
            isCompared
              ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
              : 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5 text-sky-300" />
              <span>In Comparison</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
