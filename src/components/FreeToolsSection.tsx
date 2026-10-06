import React, { useMemo, useState } from 'react';
import { Check, Copy, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { FREE_UTILITIES, FreeUtilityId } from '../data/aiToolsData';
import { UtilityIcon3D } from './Icons3D';

interface FreeToolsSectionProps {
  activeUtility: FreeUtilityId;
  onSelectUtility: (id: FreeUtilityId) => void;
  reducedMotion: boolean;
  isStandalonePage?: boolean;
}

const STOP_WORDS = new Set([
  'the', 'and', 'to', 'of', 'in', 'a', 'is', 'that', 'for', 'on', 'with', 'as', 'are', 'this',
  'by', 'be', 'at', 'or', 'from', 'an', 'it', 'can', ' into', 'their', 'has', 'have', 'will',
]);

function sortJsonKeysRecursively(val: unknown): unknown {
  if (Array.isArray(val)) {
    return val.map(sortJsonKeysRecursively);
  }
  if (val !== null && typeof val === 'object') {
    const sorted: Record<string, unknown> = {};
    Object.keys(val as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .forEach((k) => {
        sorted[k] = sortJsonKeysRecursively((val as Record<string, unknown>)[k]);
      });
    return sorted;
  }
  return val;
}

function measureJsonStats(val: unknown, depth = 1): { keys: number; maxDepth: number } {
  if (Array.isArray(val)) {
    let keys = 0;
    let maxDepth = depth;
    for (const item of val) {
      const sub = measureJsonStats(item, depth + 1);
      keys += sub.keys;
      if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
    }
    return { keys, maxDepth };
  }
  if (val !== null && typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    let keys = entries.length;
    let maxDepth = depth;
    for (const [, v] of entries) {
      const sub = measureJsonStats(v, depth + 1);
      keys += sub.keys;
      if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
    }
    return { keys, maxDepth };
  }
  return { keys: 0, maxDepth: depth - 1 };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, '').trim();
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c1 = 1 - r / 255;
  const m1 = 1 - g / 255;
  const y1 = 1 - b / 255;
  const k = Math.min(c1, m1, y1);
  return {
    c: Math.round(((c1 - k) / (1 - k)) * 100),
    m: Math.round(((m1 - k) / (1 - k)) * 100),
    y: Math.round(((y1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({
  activeUtility,
  onSelectUtility,
  isStandalonePage = false,
}) => {
  const HeadingTag = isStandalonePage ? 'h1' : 'h2';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 1. WORD COUNTER STATE
  const [wordText, setWordText] = useState<string>(
    'Modern artificial intelligence teams evaluate software tools across three primary dimensions: latency under real production workloads, citation accuracy across primary sources, and strict zero-retention data privacy. By combining a long-context reasoning engine with specialized code and research utilities, teams reduce context-switching overhead while maintaining complete editorial control.'
  );

  const wordStats = useMemo(() => {
    const trimmed = wordText.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const charsWithSpaces = wordText.length;
    const charsNoSpaces = wordText.replace(/\s+/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingSeconds = Math.ceil((wordCount / 225) * 60);
    const speakingSeconds = Math.ceil((wordCount / 140) * 60);

    const freq: Record<string, number> = {};
    for (const raw of words) {
      const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    }
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      wordCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingSeconds,
      speakingSeconds,
      topKeywords,
    };
  }, [wordText]);

  // 2. PASSWORD GENERATOR STATE
  const [pwLength, setPwLength] = useState<number>(20);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwNumbers, setPwNumbers] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [pwNoAmbiguous, setPwNoAmbiguous] = useState<boolean>(true);
  const [pwSeed, setPwSeed] = useState<number>(0);

  const generatedPasswords = useMemo(() => {
    let chars = '';
    if (pwUpper) chars += pwNoAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pwLower) chars += pwNoAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (pwNumbers) chars += pwNoAmbiguous ? '23456789' : '0123456789';
    if (pwSymbols) chars += '!@#$%^&*()-_=+[]{}<>?';
    if (!chars) chars = 'abcdefghijkmnopqrstuvwxyz23456789';

    const poolSize = chars.length;
    const entropyBits = Math.round(pwLength * Math.log2(poolSize));

    const makeOne = (offset: number) => {
      const array = new Uint32Array(pwLength);
      if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        window.crypto.getRandomValues(array);
      } else {
        for (let i = 0; i < pwLength; i++) {
          array[i] = Math.floor(Math.random() * 100000) + offset + pwSeed;
        }
      }
      let out = '';
      for (let i = 0; i < pwLength; i++) {
        out += chars[array[i] % poolSize];
      }
      return out;
    };

    const strengthLabel =
      entropyBits >= 110
        ? 'Cryptographic Grade (110+ bits)'
        : entropyBits >= 80
        ? 'High Security (80+ bits)'
        : 'Standard Security';

    return {
      primary: makeOne(1),
      backups: [makeOne(2), makeOne(3), makeOne(4)],
      entropyBits,
      poolSize,
      strengthLabel,
    };
  }, [pwLength, pwUpper, pwLower, pwNumbers, pwSymbols, pwNoAmbiguous, pwSeed]);

  // 3. JSON FORMATTER STATE
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "platform": "AetherIndex",\n  "version": "2026.10",\n  "capabilities": ["3D Spatial UI", "Tool Comparison", "Free Utilities"],\n  "metrics": {\n    "toolsIndexed": 24,\n    "zeroRetentionVerified": true\n  }\n}'
  );
  const [jsonIndent, setJsonIndent] = useState<number>(2);

  const jsonAnalysis = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const stats = measureJsonStats(parsed);
      const byteSize = new Blob([jsonInput]).size;
      return {
        valid: true as const,
        parsed,
        keys: stats.keys,
        depth: stats.maxDepth,
        byteSize,
        error: null,
      };
    } catch (err) {
      return {
        valid: false as const,
        parsed: null,
        keys: 0,
        depth: 0,
        byteSize: new Blob([jsonInput]).size,
        error: err instanceof Error ? err.message : 'Invalid JSON syntax',
      };
    }
  }, [jsonInput]);

  const handleFormatJson = (mode: 'pretty' | 'minify' | 'sort') => {
    if (!jsonAnalysis.valid) return;
    if (mode === 'pretty') {
      setJsonInput(JSON.stringify(jsonAnalysis.parsed, null, jsonIndent));
    } else if (mode === 'minify') {
      setJsonInput(JSON.stringify(jsonAnalysis.parsed));
    } else if (mode === 'sort') {
      const sorted = sortJsonKeysRecursively(jsonAnalysis.parsed);
      setJsonInput(JSON.stringify(sorted, null, jsonIndent));
    }
  };

  // 4. PERCENTAGE CALCULATOR STATE
  const [pctA1, setPctA1] = useState<string>('18');
  const [pctB1, setPctB1] = useState<string>('2450');
  const [pctA2, setPctA2] = useState<string>('420');
  const [pctB2, setPctB2] = useState<string>('1680');
  const [pctFrom, setPctFrom] = useState<string>('120');
  const [pctTo, setPctTo] = useState<string>('168');
  const [priceBase, setPriceBase] = useState<string>('240');
  const [priceDisc, setPriceDisc] = useState<string>('25');

  const pctResults = useMemo(() => {
    const a1 = parseFloat(pctA1) || 0;
    const b1 = parseFloat(pctB1) || 0;
    const res1 = (a1 / 100) * b1;

    const a2 = parseFloat(pctA2) || 0;
    const b2 = parseFloat(pctB2) || 0;
    const res2 = b2 !== 0 ? (a2 / b2) * 100 : 0;

    const fromVal = parseFloat(pctFrom) || 0;
    const toVal = parseFloat(pctTo) || 0;
    const deltaPct = fromVal !== 0 ? ((toVal - fromVal) / Math.abs(fromVal)) * 100 : 0;

    const base = parseFloat(priceBase) || 0;
    const disc = parseFloat(priceDisc) || 0;
    const saved = (disc / 100) * base;
    const finalPrice = base - saved;

    return { res1, res2, deltaPct, saved, finalPrice };
  }, [pctA1, pctB1, pctA2, pctB2, pctFrom, pctTo, priceBase, priceDisc]);

  // 5. COLOR CONVERTER STATE
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 56, g: 189, b: 248 });
  const [hexDraft, setHexDraft] = useState<string>('#38BDF8');

  const colorData = useMemo(() => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const darkLum = relativeLuminance(7, 9, 14); // #07090E
    const whiteLum = 1;
    const contrastDark = contrastRatio(lum, darkLum);
    const contrastLight = contrastRatio(lum, whiteLum);
    return { hex, hsl, cmyk, contrastDark, contrastLight };
  }, [rgb]);

  const handleHexChange = (val: string) => {
    setHexDraft(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      setRgb(parsed);
    }
  };

  // 6. PROMPT GENERATOR STATE
  const [promptDomain, setPromptDomain] = useState<string>('Full-Stack Software Architecture');
  const [promptTone, setPromptTone] = useState<string>('First-Principles Technical & Deterministic');
  const [promptFormat, setPromptFormat] = useState<string>('Numbered Architecture Spec + TypeScript Code');
  const [promptTask, setPromptTask] = useState<string>(
    'Design a multi-tenant rate limiter using Redis token buckets with graceful fallback and strict TypeScript types.'
  );
  const [promptConstraints, setPromptConstraints] = useState<string>(
    'Avoid external heavyweight dependencies, handle clock drift across distributed nodes, and include complexity metrics.'
  );

  const compiledPrompt = useMemo(() => {
    return [
      `# Role & Domain Authority`,
      `Act as a Principal Specialist in ${promptDomain}. Maintain a ${promptTone} style throughout your response.`,
      ``,
      `# Primary Objective`,
      `${promptTask.trim() || 'Provide a comprehensive analysis and implementation plan.'}`,
      ``,
      `# Operational Constraints & Guardrails`,
      `- ${promptConstraints.trim() || 'Ensure high factual precision and zero filler prose.'}`,
      `- Do not use vague placeholders, truncated snippets, or unverified assumptions.`,
      `- Explicitly state trade-offs, edge cases, and failure recovery paths.`,
      ``,
      `# Required Output Schema`,
      `Format your output strictly as: ${promptFormat}.`,
    ].join('\n');
  }, [promptDomain, promptTone, promptFormat, promptTask, promptConstraints]);

  return (
    <section
      id="free-tools-section"
      aria-labelledby="free-tools-heading"
      className="relative py-16 lg:py-24 border-b border-slate-800/70"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
              <span>02. Instant Browser Utilities</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Zero Server Latency · 100% Client-Side</span>
            </div>
            <HeadingTag
              id="free-tools-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Free Online AI & Productivity Utilities
            </HeadingTag>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Select any utility card below to launch its interactive instrument immediately in your browser.
          </p>
        </div>

        {/* 6 Interactive 3D Utility Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          role="tablist"
          aria-label="Free Productivity Utilities"
        >
          {FREE_UTILITIES.map((util) => {
            const isSelected = activeUtility === util.id;
            return (
              <button
                key={util.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectUtility(util.id)}
                className={`group text-left p-5 rounded-2xl card-3d-surface flex items-start gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                  isSelected
                    ? 'ring-2 ring-sky-400/70 bg-slate-900/95'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <UtilityIcon3D utilityId={util.id} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                      {util.name}
                    </h3>
                    <span className="text-[11px] font-mono text-sky-400 shrink-0">
                      {isSelected ? 'Active' : 'Open'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {util.summary}
                  </p>
                  <div className="mt-2.5 text-[11px] text-slate-500 font-mono">
                    {util.metricLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE UTILITY WORKSPACE */}
        <div
          role="tabpanel"
          className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
        >
          {/* 1. WORD COUNTER WORKSPACE */}
          {activeUtility === 'word-counter' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Word Counter & Lexical Density Analyzer
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time word, character, reading cadence, and keyword frequency analysis.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWordText(wordText.toUpperCase())}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    UPPERCASE
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordText(wordText.toLowerCase())}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    lowercase
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordText(wordText.replace(/\s+/g, ' ').trim())}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    Clean Spaces
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(wordText, 'word-copy')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'word-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'word-copy' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <label htmlFor="word-counter-input" className="sr-only">
                    Text to analyze
                  </label>
                  <textarea
                    id="word-counter-input"
                    rows={8}
                    value={wordText}
                    onChange={(e) => setWordText(e.target.value)}
                    placeholder="Paste or type your article, prompt, or documentation here..."
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 focus:border-sky-400/70 p-4 text-sm text-slate-100 placeholder-slate-500 leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Words</div>
                      <div className="font-mono text-2xl font-bold text-white tabular-nums mt-0.5">
                        {wordStats.wordCount}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Characters</div>
                      <div className="font-mono text-2xl font-bold text-sky-300 tabular-nums mt-0.5">
                        {wordStats.charsWithSpaces}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-xs text-slate-400">No Spaces</div>
                      <div className="font-mono text-lg font-semibold text-slate-200 tabular-nums mt-0.5">
                        {wordStats.charsNoSpaces}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Sentences · Paras</div>
                      <div className="font-mono text-lg font-semibold text-slate-200 tabular-nums mt-0.5">
                        {wordStats.sentences} · {wordStats.paragraphs}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Estimated Reading Time:</span>
                      <span className="font-mono tabular-nums text-sky-300">{wordStats.readingSeconds}s</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Estimated Speaking Time:</span>
                      <span className="font-mono tabular-nums text-sky-300">{wordStats.speakingSeconds}s</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-slate-400 mb-1.5">Top Keywords:</div>
                      {wordStats.topKeywords.length > 0 ? (
                        <div className="space-y-1">
                          {wordStats.topKeywords.map(([kw, count]) => (
                            <div key={kw} className="flex justify-between font-mono text-slate-300 tabular-nums">
                              <span>{kw}</span>
                              <span className="text-slate-400">{count}×</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">Type words to see density</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PASSWORD GENERATOR WORKSPACE */}
          {activeUtility === 'password-generator' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Cryptographic Password & API Secret Generator
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generated locally via Web Crypto CSPRNG (`window.crypto.getRandomValues`). Never transmitted.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPwSeed((s) => s + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Entropy</span>
                </button>
              </div>

              {/* Primary Generated Password Display */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-mono text-lg sm:text-xl text-sky-200 break-all tracking-wider select-all">
                  {generatedPasswords.primary}
                </div>
                <button
                  type="button"
                  onClick={() => copyText(generatedPasswords.primary, 'pw-main')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/40 hover:bg-sky-500/30 shrink-0 cursor-pointer"
                >
                  {copiedKey === 'pw-main' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'pw-main' ? 'Copied Secret' : 'Copy Password'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                      <label htmlFor="pw-length-slider">Password Length</label>
                      <span className="font-mono text-sky-300 tabular-nums">{pwLength} characters</span>
                    </div>
                    <input
                      id="pw-length-slider"
                      type="range"
                      min={8}
                      max={64}
                      value={pwLength}
                      onChange={(e) => setPwLength(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pwUpper}
                        onChange={(e) => setPwUpper(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <span>Uppercase (A–Z)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pwLower}
                        onChange={(e) => setPwLower(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <span>Lowercase (a–z)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pwNumbers}
                        onChange={(e) => setPwNumbers(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <span>Numbers (0–9)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pwSymbols}
                        onChange={(e) => setPwSymbols(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <span>Symbols (!@#$)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer col-span-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={pwNoAmbiguous}
                        onChange={(e) => setPwNoAmbiguous(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <span>Exclude Ambiguous Characters (0, O, 1, l, I)</span>
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Entropy Strength:</span>
                    <span className="font-mono font-semibold text-sky-300 tabular-nums">
                      {generatedPasswords.entropyBits} bits
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Security Rating:</span>
                    <span className="text-slate-200 font-medium">{generatedPasswords.strengthLabel}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-slate-400 mb-2">Alternative Batch Tokens:</div>
                    <div className="space-y-1.5">
                      {generatedPasswords.backups.map((b, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300"
                        >
                          <span className="truncate">{b}</span>
                          <button
                            type="button"
                            onClick={() => copyText(b, `pw-sub-${idx}`)}
                            className="text-sky-400 hover:text-sky-300 shrink-0 cursor-pointer"
                          >
                            {copiedKey === `pw-sub-${idx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. JSON FORMATTER WORKSPACE */}
          {activeUtility === 'json-formatter' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    JSON Formatter, Validator & Key Sorter
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Inspect payload syntax, normalize indentation, and sort nested object keys alphabetically.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="JSON indentation spaces"
                    value={jsonIndent}
                    onChange={(e) => setJsonIndent(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    <option value={2}>2 Spaces</option>
                    <option value={4}>4 Spaces</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleFormatJson('pretty')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    Prettify
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatJson('minify')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    Minify
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatJson('sort')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    Sort Keys A–Z
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(jsonInput, 'json-copy')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 cursor-pointer"
                  >
                    {copiedKey === 'json-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'json-copy' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Status & Telemetry Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="font-mono">
                  {jsonAnalysis.valid ? (
                    <span className="text-emerald-400 font-medium">
                      Valid JSON Payload · Syntax Verified
                    </span>
                  ) : (
                    <span className="text-rose-400 font-medium">
                      Syntax Error: {jsonAnalysis.error}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 font-mono text-slate-400 tabular-nums">
                  <span>Keys: {jsonAnalysis.keys}</span>
                  <span>·</span>
                  <span>Depth: {jsonAnalysis.depth}</span>
                  <span>·</span>
                  <span>Size: {jsonAnalysis.byteSize} B</span>
                </div>
              </div>

              <label htmlFor="json-formatter-textarea" className="sr-only">
                JSON payload editor
              </label>
              <textarea
                id="json-formatter-textarea"
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                spellCheck={false}
                className="w-full rounded-xl bg-slate-950/90 border border-slate-800 focus:border-sky-400/70 p-4 font-mono text-xs sm:text-sm text-sky-100 leading-relaxed focus:outline-none"
              />
            </div>
          )}

          {/* 4. PERCENTAGE CALCULATOR WORKSPACE */}
          {activeUtility === 'percentage-calculator' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-display text-xl font-bold text-white">
                  Quantitative Percentage & Margin Calculator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  All four calculators update instantaneously with tabular numerical precision.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mode 1 */}
                <div className="p-5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-3">
                  <div className="text-xs font-medium text-sky-400">1. Percentage of a Value</div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <span>What is</span>
                    <input
                      type="number"
                      aria-label="Percentage value"
                      value={pctA1}
                      onChange={(e) => setPctA1(e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                    <span>% of</span>
                    <input
                      type="number"
                      aria-label="Total base value"
                      value={pctB1}
                      onChange={(e) => setPctB1(e.target.value)}
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Result:</span>
                    <span className="font-mono text-xl font-bold text-white tabular-nums">
                      {pctResults.res1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                </div>

                {/* Mode 2 */}
                <div className="p-5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-3">
                  <div className="text-xs font-medium text-sky-400">2. Proportion Ratio</div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="number"
                      aria-label="Part value"
                      value={pctA2}
                      onChange={(e) => setPctA2(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                    <span>is what % of</span>
                    <input
                      type="number"
                      aria-label="Whole value"
                      value={pctB2}
                      onChange={(e) => setPctB2(e.target.value)}
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Proportion:</span>
                    <span className="font-mono text-xl font-bold text-sky-300 tabular-nums">
                      {pctResults.res2.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Mode 3 */}
                <div className="p-5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-3">
                  <div className="text-xs font-medium text-sky-400">3. Percentage Increase / Decrease</div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <span>From</span>
                    <input
                      type="number"
                      aria-label="Starting value"
                      value={pctFrom}
                      onChange={(e) => setPctFrom(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      aria-label="Ending value"
                      value={pctTo}
                      onChange={(e) => setPctTo(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Net Delta:</span>
                    <span className="font-mono text-xl font-bold text-white tabular-nums">
                      {pctResults.deltaPct >= 0 ? '+' : ''}
                      {pctResults.deltaPct.toFixed(2)}% ({pctResults.deltaPct >= 0 ? 'Increase' : 'Decrease'})
                    </span>
                  </div>
                </div>

                {/* Mode 4 */}
                <div className="p-5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-3">
                  <div className="text-xs font-medium text-sky-400">4. SaaS & Product Discount Calculator</div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <span>Price $</span>
                    <input
                      type="number"
                      aria-label="Original price"
                      value={priceBase}
                      onChange={(e) => setPriceBase(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                    <span>minus</span>
                    <input
                      type="number"
                      aria-label="Discount percentage"
                      value={priceDisc}
                      onChange={(e) => setPriceDisc(e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white tabular-nums"
                    />
                    <span>%</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">
                      Net Price (Save ${pctResults.saved.toFixed(2)}):
                    </span>
                    <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                      ${pctResults.finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. COLOR CONVERTER WORKSPACE */}
          {activeUtility === 'color-converter' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-display text-xl font-bold text-white">
                  3D Color Sphere & WCAG Contrast Converter
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Convert across HEX, RGB, HSL, and CMYK while verifying WCAG 2.1 contrast ratios.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* 3D Shaded Color Sphere Preview */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <div
                    className="w-32 h-32 rounded-full transition-shadow duration-150"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${colorData.hex} 42%, rgba(7,9,14,0.95) 95%)`,
                      boxShadow: `0 18px 40px -8px ${colorData.hex}66, inset 0 2px 6px rgba(255,255,255,0.45)`,
                    }}
                    aria-label={`3D sphere preview of color ${colorData.hex}`}
                  />
                  <div className="mt-4 font-mono text-sm font-bold text-white">
                    {colorData.hex}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {['#38BDF8', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#F8FAFC'].map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => handleHexChange(swatch)}
                        style={{ backgroundColor: swatch }}
                        className="w-6 h-6 rounded-full border border-white/30 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                        aria-label={`Select color swatch ${swatch}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls & Multi-Space Outputs */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label htmlFor="hex-input" className="block text-xs text-slate-400 mb-1">
                        HEX Value
                      </label>
                      <input
                        id="hex-input"
                        type="text"
                        value={hexDraft}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white"
                      />
                    </div>
                    {(['r', 'g', 'b'] as const).map((channel) => (
                      <div key={channel}>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <label htmlFor={`rgb-${channel}`}>{channel.toUpperCase()} Channel</label>
                          <span className="font-mono text-slate-200 tabular-nums">{rgb[channel]}</span>
                        </div>
                        <input
                          id={`rgb-${channel}`}
                          type="range"
                          min={0}
                          max={255}
                          value={rgb[channel]}
                          onChange={(e) => {
                            const next = { ...rgb, [channel]: Number(e.target.value) };
                            setRgb(next);
                            setHexDraft(rgbToHex(next.r, next.g, next.b));
                          }}
                          className="w-full accent-sky-400 mt-1.5 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Copyable Color Space Strings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    {[
                      { label: 'HEX', val: colorData.hex },
                      { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                      { label: 'HSL', val: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)` },
                      {
                        label: 'CMYK',
                        val: `cmyk(${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%)`,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <div>
                          <span className="text-slate-500 mr-2">{row.label}:</span>
                          <span className="text-slate-100">{row.val}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(row.val, `color-${row.label}`)}
                          className="text-sky-400 hover:text-sky-300 cursor-pointer"
                        >
                          {copiedKey === `color-${row.label}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* WCAG Contrast Verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Contrast on Dark (#07090E):</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {colorData.contrastDark.toFixed(2)}:1 ·{' '}
                        {colorData.contrastDark >= 4.5 ? 'WCAG AA Pass' : 'Low Contrast'}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Contrast on White (#FFFFFF):</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {colorData.contrastLight.toFixed(2)}:1 ·{' '}
                        {colorData.contrastLight >= 4.5 ? 'WCAG AA Pass' : 'Low Contrast'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. PROMPT GENERATOR WORKSPACE */}
          {activeUtility === 'prompt-generator' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Structured AI Prompt Compiler
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synthesize deterministic system prompts with explicit domain roles, guardrails, and output schemas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(compiledPrompt, 'prompt-copy')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  {copiedKey === 'prompt-copy' ? <Check className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                  <span>{copiedKey === 'prompt-copy' ? 'Copied Prompt Spec' : 'Copy Compiled Prompt'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="prompt-domain" className="block text-xs text-slate-400 mb-1">
                        Specialist Domain
                      </label>
                      <select
                        id="prompt-domain"
                        value={promptDomain}
                        onChange={(e) => setPromptDomain(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      >
                        <option value="Full-Stack Software Architecture">Full-Stack Software Architecture</option>
                        <option value="Technical Writing & Documentation">Technical Writing & Documentation</option>
                        <option value="Empirical Literature Synthesis">Empirical Literature Synthesis</option>
                        <option value="3D & Visual Concept Art Direction">3D & Visual Concept Art Direction</option>
                        <option value="Product Strategy & Financial Modeling">Product Strategy & Financial Modeling</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="prompt-tone" className="block text-xs text-slate-400 mb-1">
                        Reasoning Tone
                      </label>
                      <select
                        id="prompt-tone"
                        value={promptTone}
                        onChange={(e) => setPromptTone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      >
                        <option value="First-Principles Technical & Deterministic">First-Principles Technical</option>
                        <option value="Concise Executive Briefing">Concise Executive Briefing</option>
                        <option value="Rigorous Peer-Review Analytical">Rigorous Peer-Review Analytical</option>
                        <option value="Socratic Pedagogical Step-by-Step">Socratic Step-by-Step</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="prompt-format" className="block text-xs text-slate-400 mb-1">
                      Target Output Schema
                    </label>
                    <select
                      id="prompt-format"
                      value={promptFormat}
                      onChange={(e) => setPromptFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="Numbered Architecture Spec + TypeScript Code">
                        Numbered Architecture Spec + TypeScript Code
                      </option>
                      <option value="Markdown Comparison Table + Executive Summary">
                        Markdown Comparison Table + Executive Summary
                      </option>
                      <option value="Strict Validated JSON Schema">Strict Validated JSON Schema</option>
                      <option value="Step-by-Step Verification Checklist">
                        Step-by-Step Verification Checklist
                      </option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="prompt-task" className="block text-xs text-slate-400 mb-1">
                      Primary Task Objective
                    </label>
                    <textarea
                      id="prompt-task"
                      rows={3}
                      value={promptTask}
                      onChange={(e) => setPromptTask(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label htmlFor="prompt-constraints" className="block text-xs text-slate-400 mb-1">
                      Negative Constraints & Guardrails
                    </label>
                    <input
                      id="prompt-constraints"
                      type="text"
                      value={promptConstraints}
                      onChange={(e) => setPromptConstraints(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Live Compiled Prompt Card */}
                <div className="lg:col-span-6 flex flex-col">
                  <div className="text-xs text-sky-400 font-mono mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Compiled Prompt Specification</span>
                  </div>
                  <pre className="flex-1 rounded-xl bg-slate-950 border border-sky-500/25 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {compiledPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
