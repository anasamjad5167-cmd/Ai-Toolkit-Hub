import React from 'react';
import { ArrowUpRight, CheckCircle2, FileText, Globe, Layers } from 'lucide-react';
import { AI_TOOLS, AITool, COMPARISON_PRESETS } from '../data/aiToolsData';
import { ToolEmblem3D } from './Icons3D';

interface ComparisonSectionProps {
  comparedToolIds: string[];
  onSetComparedTools: (ids: string[]) => void;
  onReplaceCompareSlot: (slotIndex: number, newToolId: string) => void;
  onInspectTool: (tool: AITool) => void;
  isStandalonePage?: boolean;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  comparedToolIds,
  onSetComparedTools,
  onReplaceCompareSlot,
  onInspectTool,
  isStandalonePage = false,
}) => {
  const activeTools: AITool[] = [0, 1, 2].map((idx) => {
    const id = comparedToolIds[idx];
    const found = AI_TOOLS.find((t) => t.id === id);
    if (found) return found;
    return AI_TOOLS[idx] || AI_TOOLS[0];
  });

  const HeadingTag = isStandalonePage ? 'h1' : 'h2';

  return (
    <section
      id="comparison-section"
      aria-labelledby="comparison-heading"
      className="relative py-12 lg:py-20 border-b border-slate-800/70"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Comparison Header with Subtle Depth */}
        <div className="rounded-2xl p-6 sm:p-8 mb-8 card-3d-surface">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
                <span>Side-by-Side Feature & Pricing Model Matrix</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">2D Readability Layout</span>
              </div>
              <HeadingTag
                id="comparison-heading"
                className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Compare AI Tools Side by Side
              </HeadingTag>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                Compare primary use cases, free-plan availability, pricing models, supported platforms, and limitations across up to three AI tools. Always verify current pricing and terms on each provider’s official website.
              </p>
            </div>

            {/* Quick Preset Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {COMPARISON_PRESETS.map((preset) => {
                const isCurrent =
                  comparedToolIds[0] === preset.toolIds[0] &&
                  comparedToolIds[1] === preset.toolIds[1] &&
                  comparedToolIds[2] === preset.toolIds[2];
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSetComparedTools([...preset.toolIds])}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                      isCurrent
                        ? 'bg-sky-400 text-slate-950 font-semibold shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Tool Selection Cards with Subtle 3D Depth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {activeTools.map((tool, slotIdx) => (
            <div
              key={`${tool.id}-${slotIdx}`}
              className="group rounded-2xl p-5 card-3d-surface flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label
                    htmlFor={`compare-slot-${slotIdx}`}
                    className="text-xs font-mono text-slate-400"
                  >
                    Comparison Slot 0{slotIdx + 1}
                  </label>
                  <span className="text-xs text-sky-400 font-mono">
                    {tool.category} · {tool.pricing}
                  </span>
                </div>

                <select
                  id={`compare-slot-${slotIdx}`}
                  value={tool.id}
                  onChange={(e) => onReplaceCompareSlot(slotIdx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/90 text-sm font-semibold text-white mb-4 focus:outline-2 focus:outline-sky-400 cursor-pointer"
                >
                  {AI_TOOLS.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} ({candidate.category})
                    </option>
                  ))}
                </select>

                <div className="flex items-start gap-3">
                  <ToolEmblem3D name={tool.name} category={tool.category} />
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-white truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                      {tool.tagline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onInspectTool(tool)}
                  className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                >
                  View Full Profile
                </button>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <span>Official Site</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Clean 2D High-Readability Comparison Table */}
        <div className="rounded-2xl bg-slate-950/95 border border-slate-800/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="py-4 px-5 text-xs font-semibold text-slate-400 w-1/4">
                    Evaluation Criterion
                  </th>
                  {activeTools.map((tool, i) => (
                    <th
                      key={`th-${tool.id}-${i}`}
                      className="py-4 px-5 font-display text-base font-bold text-white w-1/4"
                    >
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Primary Category & Use Case
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`cat-${tool.id}-${i}`} className="py-4 px-5 text-slate-200">
                      <div className="font-semibold text-sky-300">{tool.category}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{tool.primaryUseCase}</div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Pricing Model & Free Plan
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`price-${tool.id}-${i}`} className="py-4 px-5 text-slate-200">
                      <div className="font-semibold text-white">{tool.pricing}</div>
                      <div className="text-xs text-sky-300 mt-0.5">{tool.freePlanAvailable}</div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Pricing Transparency
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`trans-${tool.id}-${i}`} className="py-4 px-5 text-xs text-slate-300">
                      {tool.pricingTransparencyNote}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Supported Platforms
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`plat-${tool.id}-${i}`} className="py-4 px-5 text-xs text-slate-200">
                      <div className="flex items-start gap-1.5">
                        <Globe className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{tool.supportedPlatforms}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Core Capability Focus
                  </td>
                  {activeTools.map((tool, i) => (
                    <td
                      key={`spec-${tool.id}-${i}`}
                      className="py-4 px-5 font-mono text-xs text-slate-200"
                    >
                      {tool.contextOrSpec}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Developer API Availability
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`api-${tool.id}-${i}`} className="py-4 px-5">
                      {tool.apiAvailable ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Public API Available</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Application Interface Only</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Documentation & Resources
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`doc-${tool.id}-${i}`} className="py-4 px-5 text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{tool.documentationNote}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Key Features & Strengths
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`str-${tool.id}-${i}`} className="py-4 px-5 align-top">
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {tool.strengths.map((s, idx) => (
                          <li key={idx} className="leading-relaxed">
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Known Limitations
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`lim-${tool.id}-${i}`} className="py-4 px-5 align-top">
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {tool.limitations.map((l, idx) => (
                          <li key={idx} className="leading-relaxed">
                            – {l}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-5 font-medium text-slate-300 bg-slate-900/30">
                    Supported Integrations
                  </td>
                  {activeTools.map((tool, i) => (
                    <td key={`int-${tool.id}-${i}`} className="py-4 px-5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{tool.integrations.join(' · ')}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
