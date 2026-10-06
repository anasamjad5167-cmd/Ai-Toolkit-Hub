/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  EyeOff,
  FileText,
  Filter,
  Globe,
  RotateCcw,
  Scale,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AI_TOOLS,
  AITool,
  CATEGORIES,
  FAQ_ITEMS,
  FreeUtilityId,
  GUIDE_ARTICLES,
  PricingTier,
  ToolCategory,
} from './data/aiToolsData';
import { getCanonicalUrl, SITE_CONFIG } from './config/siteConfig';
import { Background3D } from './components/Background3D';
import { Hero3D } from './components/Hero3D';
import { CategoryIcon3D, ToolEmblem3D } from './components/Icons3D';
import { ToolCard3D } from './components/ToolCard3D';
import { FreeToolsSection } from './components/FreeToolsSection';
import { ComparisonSection } from './components/ComparisonSection';
import { GuidesAndLegalSection } from './components/GuidesAndLegalSection';
import { TrustAndLegalPages, TrustPageRoute } from './components/TrustAndLegalPages';
import { FormPageRoute, InteractiveFormsPages } from './components/InteractiveFormsPages';
import { BreadcrumbItem, SEOHead } from './components/SEOHead';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CookieConsent } from './components/CookieConsent';

type SortOption = 'featured' | 'name' | 'category';

const TRUST_ROUTES = new Set<string>([
  '/about',
  '/privacy-policy',
  '/cookie-policy',
  '/terms-of-service',
  '/faq',
  '/editorial-policy',
  '/methodology',
  '/disclaimer',
  '/accessibility',
]);

const FORM_ROUTES = new Set<string>(['/contact', '/report-error', '/suggest-tool']);

function normalizePathname(raw: string): string {
  if (!raw || raw === '/') return '/';
  const cleaned = raw.replace(/\/+$/, '');
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/'
  );
  const [transitionKey, setTransitionKey] = useState<number>(0);

  // Reduced Motion Detection + Accessible User Override
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Cookie Settings Modal State
  const [cookieModalOpen, setCookieModalOpen] = useState<boolean>(false);

  // Scroll Depth State
  const [scrollY, setScrollY] = useState<number>(0);

  // Directory Search, Category, Pricing & Sort Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All'>('All');
  const [selectedPricing, setSelectedPricing] = useState<PricingTier | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Active Free Utility State
  const [activeUtility, setActiveUtility] = useState<FreeUtilityId>('word-counter');

  // Side-by-Side Comparison State
  const [comparedToolIds, setComparedToolIds] = useState<string[]>([
    'claude-workspace',
    'cursor-ide',
    'perplexity-pro',
  ]);

  // Quick Modal Inspector State (when viewing on homepage/directory)
  const [inspectedTool, setInspectedTool] = useState<AITool | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePathname(window.location.pathname));
      setTransitionKey((k) => k + 1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  const navigateTo = (path: string, sectionId?: string) => {
    const normalized = normalizePathname(path);
    setInspectedTool(null);
    if (normalized !== currentPath) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
      setTransitionKey((k) => k + 1);
    }
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleSelectCategory = (category: ToolCategory) => {
    setSelectedCategory(category);
    navigateTo('/ai-tools', 'directory-section');
  };

  const handleToggleCompare = (toolId: string) => {
    setComparedToolIds((prev) => {
      if (prev.includes(toolId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== toolId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], toolId];
      }
      return [...prev, toolId];
    });
  };

  const handleReplaceCompareSlot = (slotIndex: number, newToolId: string) => {
    setComparedToolIds((prev) => {
      const next = [...prev];
      next[slotIndex] = newToolId;
      return next;
    });
  };

  // Check if route is an individual AI tool page: /ai-tools/:id
  const activeToolDetail: AITool | null = useMemo(() => {
    if (currentPath.startsWith('/ai-tools/')) {
      const slug = currentPath.replace('/ai-tools/', '').trim();
      return AI_TOOLS.find((t) => t.id === slug) || null;
    }
    return null;
  }, [currentPath]);

  // Filtered and Sorted AI Tools
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return AI_TOOLS.filter((tool) => {
      const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesPrice = selectedPricing === 'All' || tool.pricing === selectedPricing;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.primaryUseCase.toLowerCase().includes(q);
      return matchesCat && matchesPrice && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, selectedPricing, sortBy]);

  // Compute Page-Specific SEO Metadata, Breadcrumbs & JSON-LD (Sections 46-53)
  const seoConfig = useMemo(() => {
    const homeCrumb: BreadcrumbItem = { label: 'Home', path: '/' };

    if (activeToolDetail) {
      const crumbs: BreadcrumbItem[] = [
        homeCrumb,
        { label: 'AI Tools', path: '/ai-tools' },
        { label: activeToolDetail.category, path: '/categories' },
        { label: activeToolDetail.name, path: `/ai-tools/${activeToolDetail.id}` },
      ];
      return {
        title: `${activeToolDetail.name} — Features, Pricing Model & Alternatives | AI Toolkit Hub`,
        description: `${activeToolDetail.name}: ${activeToolDetail.tagline} Explore supported platforms, free-plan availability, limitations, and related ${activeToolDetail.category} tools.`,
        path: `/ai-tools/${activeToolDetail.id}`,
        breadcrumbs: crumbs,
        ogType: 'website' as const,
        extraJsonLd: undefined,
      };
    }

    switch (currentPath) {
      case '/':
        return {
          title: 'AI Toolkit Hub — Discover Useful AI Tools & Free Productivity Tools',
          description:
            'Explore AI tools across writing, coding, images, video, and research, compare your options side by side, and use free client-side productivity utilities.',
          path: '/',
          breadcrumbs: [homeCrumb],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/ai-tools':
        return {
          title: 'Best AI Tools — Discover & Compare AI Software | AI Toolkit Hub',
          description:
            'Browse and filter 24 curated AI software platforms across writing, coding, images, video, research, education, productivity, and audio.',
          path: '/ai-tools',
          breadcrumbs: [homeCrumb, { label: 'AI Tools', path: '/ai-tools' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/categories':
        return {
          title: 'AI Tool Categories — Browse Software by Capability | AI Toolkit Hub',
          description:
            'Explore AI software organized across eight core capability categories: Writing, Coding, Images, Video, Research, Education, Productivity, and Audio.',
          path: '/categories',
          breadcrumbs: [homeCrumb, { label: 'Categories', path: '/categories' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/compare':
        return {
          title: 'Compare AI Tools Side by Side — Features & Pricing Models | AI Toolkit Hub',
          description:
            'Compare up to three AI tools side by side across primary use cases, free-plan availability, pricing transparency, supported platforms, and limitations.',
          path: '/compare',
          breadcrumbs: [homeCrumb, { label: 'Compare AI Tools', path: '/compare' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/free-tools':
        return {
          title: 'Free Online Tools — AI & Productivity Utilities | AI Toolkit Hub',
          description:
            'Use six free client-side browser utilities: Word Counter, Password Generator, JSON Formatter, Percentage Calculator, Color Converter, and Prompt Generator.',
          path: '/free-tools',
          breadcrumbs: [homeCrumb, { label: 'Free Tools', path: '/free-tools' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/guides':
        return {
          title: 'AI Guides & Tutorials | AI Toolkit Hub',
          description:
            'Practical guides and tutorials on evaluating AI software stacks, designing structured prompts, and choosing research tools.',
          path: '/guides',
          breadcrumbs: [homeCrumb, { label: 'Guides', path: '/guides' }],
          ogType: 'article' as const,
          extraJsonLd: {
            '@type': 'Article',
            headline: 'AI Guides & Tutorials — Evaluating AI Software and Structured Prompting',
            datePublished: '2026-09-18',
            dateModified: '2026-10-06',
            author: {
              '@type': 'Organization',
              name: SITE_CONFIG.siteName,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.siteName,
            },
            mainEntityOfPage: getCanonicalUrl('/guides'),
          },
        };
      case '/blog':
        return {
          title: 'AI Blog — Privacy, Software Pricing & Web Design | AI Toolkit Hub',
          description:
            'Read articles on browser-based utility privacy, understanding AI software pricing models, and accessible 3D web interface design.',
          path: '/blog',
          breadcrumbs: [homeCrumb, { label: 'Blog', path: '/blog' }],
          ogType: 'article' as const,
          extraJsonLd: {
            '@type': 'Article',
            headline: 'AI Toolkit Hub Blog — Privacy, Software Pricing & Accessible Design',
            datePublished: '2026-09-19',
            dateModified: '2026-10-02',
            author: {
              '@type': 'Organization',
              name: SITE_CONFIG.siteName,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.siteName,
            },
            mainEntityOfPage: getCanonicalUrl('/blog'),
          },
        };
      case '/about':
        return {
          title: 'About AI Toolkit Hub — Mission, Standards & Transparency',
          description:
            'Learn what AI Toolkit Hub is, why the website exists, how AI tools are researched and reviewed, and our commitment to editorial transparency.',
          path: '/about',
          breadcrumbs: [homeCrumb, { label: 'About', path: '/about' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/contact':
        return {
          title: 'Contact Us | AI Toolkit Hub',
          description:
            'Get in touch with AI Toolkit Hub regarding directory listings, free utilities, or general inquiries.',
          path: '/contact',
          breadcrumbs: [homeCrumb, { label: 'Contact', path: '/contact' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/privacy-policy':
        return {
          title: 'Privacy Policy | AI Toolkit Hub',
          description:
            'Read the AI Toolkit Hub Privacy Policy covering client-side utilities, cookies, analytics, advertising, Google AdSense, and user privacy rights.',
          path: '/privacy-policy',
          breadcrumbs: [homeCrumb, { label: 'Privacy Policy', path: '/privacy-policy' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/cookie-policy':
        return {
          title: 'Cookie Policy | AI Toolkit Hub',
          description:
            'Understand how AI Toolkit Hub uses necessary and preference storage, how optional analytics or advertising cookies work, and how to manage your settings.',
          path: '/cookie-policy',
          breadcrumbs: [homeCrumb, { label: 'Cookie Policy', path: '/cookie-policy' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/terms-of-service':
        return {
          title: 'Terms of Service | AI Toolkit Hub',
          description:
            'Review the Terms of Service governing your use of the AI Toolkit Hub directory, comparison tables, and free browser utilities.',
          path: '/terms-of-service',
          breadcrumbs: [homeCrumb, { label: 'Terms of Service', path: '/terms-of-service' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/faq':
        return {
          title: 'Frequently Asked Questions (FAQ) | AI Toolkit Hub',
          description:
            'Find truthful answers to common questions about AI Toolkit Hub, how tools are selected, free productivity utilities, cookies, and advertising.',
          path: '/faq',
          breadcrumbs: [homeCrumb, { label: 'FAQ', path: '/faq' }],
          ogType: 'website' as const,
          extraJsonLd: {
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        };
      case '/editorial-policy':
        return {
          title: 'Editorial Policy — Research, Corrections & Disclosure | AI Toolkit Hub',
          description:
            'Learn how AI Toolkit Hub researches articles, checks AI tool listings, handles corrections, uses AI assistance, and maintains editorial independence.',
          path: '/editorial-policy',
          breadcrumbs: [homeCrumb, { label: 'Editorial Policy', path: '/editorial-policy' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/methodology':
        return {
          title: 'AI Tool Review Methodology — Evaluation Criteria | AI Toolkit Hub',
          description:
            'Explore the nine qualitative criteria AI Toolkit Hub uses to evaluate AI software—including free-plan availability, pricing transparency, and limitations.',
          path: '/methodology',
          breadcrumbs: [homeCrumb, { label: 'Review Methodology', path: '/methodology' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/disclaimer':
        return {
          title: 'Website Disclaimer | AI Toolkit Hub',
          description:
            'Important disclaimers regarding informational content, third-party pricing changes, and verification with official software vendors.',
          path: '/disclaimer',
          breadcrumbs: [homeCrumb, { label: 'Disclaimer', path: '/disclaimer' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/accessibility':
        return {
          title: 'Accessibility Statement | AI Toolkit Hub',
          description:
            'Learn about keyboard navigation, responsive layout, color contrast, and reduced-motion support on AI Toolkit Hub.',
          path: '/accessibility',
          breadcrumbs: [homeCrumb, { label: 'Accessibility', path: '/accessibility' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/report-error':
        return {
          title: 'Report an Error or Outdated Listing | AI Toolkit Hub',
          description:
            'Report incorrect AI tool information, broken links, outdated pricing, or technical problems on AI Toolkit Hub.',
          path: '/report-error',
          breadcrumbs: [homeCrumb, { label: 'Report an Error', path: '/report-error' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      case '/suggest-tool':
        return {
          title: 'Suggest an AI Tool for Review | AI Toolkit Hub',
          description:
            'Submit an AI tool suggestion for editorial consideration on AI Toolkit Hub.',
          path: '/suggest-tool',
          breadcrumbs: [homeCrumb, { label: 'Suggest a Tool', path: '/suggest-tool' }],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
      default:
        return {
          title: 'AI Toolkit Hub — Discover Useful AI Tools & Free Productivity Tools',
          description:
            'Explore AI tools, compare your options, and use powerful free productivity utilities.',
          path: '/',
          breadcrumbs: [homeCrumb],
          ogType: 'website' as const,
          extraJsonLd: undefined,
        };
    }
  }, [currentPath, activeToolDetail]);

  return (
    <div className={`min-h-screen relative ${reducedMotion ? 'reduce-motion-forced' : ''}`}>
      {/* Dynamic SEO Head Manager & JSON-LD Structured Data */}
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        path={seoConfig.path}
        ogType={seoConfig.ogType}
        breadcrumbs={seoConfig.breadcrumbs}
        extraJsonLd={seoConfig.extraJsonLd}
      />

      {/* Subtle Animated 3D Background */}
      <Background3D reducedMotion={reducedMotion} scrollY={scrollY} />

      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-[#07090E]/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            AI Toolkit Hub
          </a>

          {/* Zone 2: 6 Clean Single-Line Text Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            {[
              { label: 'Home', path: '/' },
              { label: 'AI Tools', path: '/ai-tools' },
              { label: 'Categories', path: '/categories' },
              { label: 'Free Tools', path: '/free-tools' },
              { label: 'Compare', path: '/compare' },
              { label: 'Guides', path: '/guides' },
            ].map((navItem) => {
              const isActive =
                currentPath === navItem.path ||
                (navItem.path === '/ai-tools' && currentPath.startsWith('/ai-tools/'));
              return (
                <a
                  key={navItem.path}
                  href={navItem.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(navItem.path);
                  }}
                  className={`hover:text-white underline-offset-8 hover:underline transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-sky-300 underline' : ''
                  }`}
                >
                  {navItem.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 2 Primary Actions (Reduced Motion Toggle + Compare Action) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setReducedMotion((m) => !m)}
              aria-pressed={reducedMotion}
              title="Toggle 3D animations and parallax for accessibility"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                reducedMotion
                  ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{reducedMotion ? 'Static Mode' : '3D Motion'}</span>
            </button>

            <a
              href="/compare"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/compare');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-300"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({comparedToolIds.length})</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WITH 3D PAGE TRANSITION CONTAINER */}
      <main id="top" key={transitionKey} className="relative z-10 page-transition-enter">
        {/* Mobile Quick Navigation Bar */}
        <div className="md:hidden border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          {[
            { label: 'Home', path: '/' },
            { label: 'AI Tools', path: '/ai-tools' },
            { label: 'Categories', path: '/categories' },
            { label: 'Free Tools', path: '/free-tools' },
            { label: 'Compare', path: '/compare' },
            { label: 'Guides', path: '/guides' },
            { label: 'Blog', path: '/blog' },
            { label: 'FAQ', path: '/faq' },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.path);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                currentPath === item.path
                  ? 'bg-sky-400 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Accessible Breadcrumb Trail on all subpages */}
        <Breadcrumbs items={seoConfig.breadcrumbs} onNavigate={navigateTo} />

        {/* ROUTE A: INDIVIDUAL AI TOOL DETAIL PAGE (/ai-tools/:id) */}
        {activeToolDetail && (
          <section className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-start gap-4">
                  <ToolEmblem3D name={activeToolDetail.name} category={activeToolDetail.category} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                      <a
                        href="/categories"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectCategory(activeToolDetail.category);
                        }}
                        className="text-sky-300 font-medium hover:underline"
                      >
                        {activeToolDetail.category}
                      </a>
                      <span>·</span>
                      <span>{activeToolDetail.pricing}</span>
                      <span>·</span>
                      <span>{activeToolDetail.apiAvailable ? 'API Available' : 'Web / App'}</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      {activeToolDetail.name}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleCompare(activeToolDetail.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      comparedToolIds.includes(activeToolDetail.id)
                        ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {comparedToolIds.includes(activeToolDetail.id) ? (
                      <>
                        <Check className="w-4 h-4 text-sky-300" />
                        <span>Selected in Compare</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-4 h-4" />
                        <span>Add to Compare</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeToolDetail.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors"
                  >
                    <span>Visit Official Website</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed">
                <h2 className="font-display text-xl font-bold text-white">Overview</h2>
                <p className="text-base text-slate-200 font-medium">{activeToolDetail.tagline}</p>
                <p className="text-sm sm:text-base">{activeToolDetail.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400">Primary Use Case</h3>
                  <p className="text-sm font-semibold text-white mt-1">
                    {activeToolDetail.primaryUseCase}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400">Free-Plan Availability</h3>
                  <p className="text-sm font-semibold text-sky-300 mt-1">
                    {activeToolDetail.freePlanAvailable}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400">Supported Platforms</h3>
                  <p className="text-sm text-slate-200 mt-1 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{activeToolDetail.supportedPlatforms}</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400">Pricing Transparency</h3>
                  <p className="text-sm text-slate-200 mt-1">
                    {activeToolDetail.pricingTransparencyNote}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/75 border border-slate-800 space-y-3">
                  <h2 className="font-display text-lg font-bold text-white">
                    Key Features & Strengths
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {activeToolDetail.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/75 border border-slate-800 space-y-3">
                  <h2 className="font-display text-lg font-bold text-white">
                    Practical Limitations
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                    {activeToolDetail.limitations.map((l, idx) => (
                      <li key={idx} className="leading-relaxed">
                        – {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Internal Linking: Related AI Tools & Related Guides (Section 50) */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="font-display text-base font-bold text-white">
                    Related AI Tools
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {activeToolDetail.relatedToolIds.map((relId) => {
                      const relTool = AI_TOOLS.find((t) => t.id === relId);
                      if (!relTool) return null;
                      return (
                        <a
                          key={relTool.id}
                          href={`/ai-tools/${relTool.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(`/ai-tools/${relTool.id}`);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700/80 transition-colors"
                        >
                          {relTool.name} ({relTool.category})
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="font-display text-base font-bold text-white">
                    Relevant Guides & Actions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {activeToolDetail.relatedGuideIds.map((gId) => {
                      const guide = GUIDE_ARTICLES.find((g) => g.id === gId);
                      if (!guide) return null;
                      return (
                        <a
                          key={guide.id}
                          href="/guides"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/guides');
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
                        >
                          Guide: {guide.title.slice(0, 38)}...
                        </a>
                      );
                    })}
                    <a
                      href="/report-error"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/report-error');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800"
                    >
                      Report Incorrect Info →
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/ai-tools"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/ai-tools');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All AI Tools</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ROUTE B: TRUST & LEGAL PAGES (/about, /privacy-policy, /cookie-policy, /terms-of-service, /faq, /editorial-policy, /methodology, /disclaimer, /accessibility) */}
        {!activeToolDetail && TRUST_ROUTES.has(currentPath) && (
          <TrustAndLegalPages
            route={currentPath as TrustPageRoute}
            onNavigate={navigateTo}
            onOpenCookieSettings={() => setCookieModalOpen(true)}
            reducedMotion={reducedMotion}
            onToggleReducedMotion={() => setReducedMotion((m) => !m)}
          />
        )}

        {/* ROUTE C: INTERACTIVE FORMS PAGES (/contact, /report-error, /suggest-tool) */}
        {!activeToolDetail && FORM_ROUTES.has(currentPath) && (
          <InteractiveFormsPages
            route={currentPath as FormPageRoute}
            onNavigate={navigateTo}
          />
        )}

        {/* ROUTE D: HOME, AI TOOLS, CATEGORIES, FREE TOOLS, COMPARE, GUIDES, BLOG */}
        {!activeToolDetail && !TRUST_ROUTES.has(currentPath) && !FORM_ROUTES.has(currentPath) && (
          <>
            {/* 1. 3D HERO SECTION (Shown on Home `/`) */}
            {currentPath === '/' && (
              <Hero3D
                reducedMotion={reducedMotion}
                onExploreTools={() => navigateTo('/ai-tools')}
                onTryFreeTools={() => navigateTo('/free-tools')}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* 2. 3D CATEGORY CARDS SECTION (Shown on `/` and `/categories`) */}
            {(currentPath === '/' || currentPath === '/categories') && (
              <section
                id="categories-section"
                aria-labelledby="categories-heading"
                className="py-14 lg:py-20 border-b border-slate-800/70"
              >
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
                        <span>Capability Taxonomy</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">8 Core AI Software Domains</span>
                      </div>
                      {currentPath === '/categories' ? (
                        <h1
                          id="categories-heading"
                          className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                          style={{ textWrap: 'balance' }}
                        >
                          Explore AI Tools by Capability Category
                        </h1>
                      ) : (
                        <h2
                          id="categories-heading"
                          className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                          style={{ textWrap: 'balance' }}
                        >
                          Explore by AI Capability Category
                        </h2>
                      )}
                    </div>
                    <a
                      href="/methodology"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/methodology');
                      }}
                      className="text-xs font-medium text-sky-400 hover:text-sky-300 self-start md:self-auto"
                    >
                      How we categorize & evaluate tools →
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          className={`group text-left p-5 rounded-2xl card-3d-surface flex flex-col justify-between ${
                            isSelected ? 'ring-2 ring-sky-400/80 bg-slate-900/95' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <CategoryIcon3D category={cat.id} size="md" />
                              <span className="font-mono text-xs text-slate-400 tabular-nums">
                                {cat.toolCount} tools
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                              {cat.shortDesc}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <a
                              href="/guides"
                              onClick={(e) => {
                                e.preventDefault();
                                navigateTo('/guides');
                              }}
                              className="text-slate-400 hover:text-slate-200 truncate"
                            >
                              Related Guide →
                            </a>
                            <button
                              type="button"
                              onClick={() => handleSelectCategory(cat.id)}
                              className="text-sky-400 hover:text-sky-300 font-semibold shrink-0 cursor-pointer"
                            >
                              Browse {cat.name} →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* 3. 3D AI TOOL DIRECTORY SECTION (Shown on `/` and `/ai-tools`) */}
            {(currentPath === '/' || currentPath === '/ai-tools') && (
              <section
                id="directory-section"
                aria-labelledby="directory-heading"
                className="py-14 lg:py-22 border-b border-slate-800/70"
              >
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Software Directory</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">
                          Showing {filteredTools.length} of {AI_TOOLS.length} Tools
                        </span>
                      </div>
                      {currentPath === '/ai-tools' ? (
                        <h1
                          id="directory-heading"
                          className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                          style={{ textWrap: 'balance' }}
                        >
                          {selectedCategory === 'All'
                            ? 'Best AI Tools — Discover & Compare AI Software'
                            : `${selectedCategory} AI Tools`}
                        </h1>
                      ) : (
                        <h2
                          id="directory-heading"
                          className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                          style={{ textWrap: 'balance' }}
                        >
                          {selectedCategory === 'All'
                            ? 'Featured & Curated AI Tools'
                            : `${selectedCategory} AI Tools`}
                        </h2>
                      )}
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative min-w-[260px] sm:min-w-[300px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="search"
                          aria-label="Search AI tools by name, category, or capability"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search Claude, Cursor, video, SVG..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 focus:border-sky-400 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                        <select
                          aria-label="Sort AI tools"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortOption)}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-xs sm:text-sm text-slate-200 focus:outline-2 focus:outline-sky-400 cursor-pointer"
                        >
                          <option value="featured">Sort: Featured First</option>
                          <option value="name">Sort: Alphabetical (A–Z)</option>
                          <option value="category">Sort: By Category</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Category & Pricing Segmented Filter Bar */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-800/80">
                    <div
                      className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800"
                      role="group"
                      aria-label="Filter by AI category"
                    >
                      {(['All', ...CATEGORIES.map((c) => c.id)] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-sky-400 text-slate-950 font-semibold shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800"
                      role="group"
                      aria-label="Filter by pricing model"
                    >
                      {(['All', 'Free', 'Freemium', 'Paid'] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setSelectedPricing(tier)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            selectedPricing === tier
                              ? 'bg-slate-800 text-sky-300 font-semibold border border-sky-400/40'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tier === 'All' ? 'All Pricing' : tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D AI Tool Cards Grid */}
                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTools.map((tool) => (
                        <ToolCard3D
                          key={tool.id}
                          tool={tool}
                          reducedMotion={reducedMotion}
                          isCompared={comparedToolIds.includes(tool.id)}
                          onToggleCompare={handleToggleCompare}
                          onInspectTool={(t) => navigateTo(`/ai-tools/${t.id}`)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center space-y-4">
                      <p className="text-base font-medium text-slate-200">
                        No AI tools matched your current filter combination.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setSelectedPricing('All');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Directory Filters</span>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 4. 3D FREE TOOLS SECTION (Shown on `/` and `/free-tools`) */}
            {(currentPath === '/' || currentPath === '/free-tools') && (
              <FreeToolsSection
                activeUtility={activeUtility}
                onSelectUtility={setActiveUtility}
                reducedMotion={reducedMotion}
                isStandalonePage={currentPath === '/free-tools'}
              />
            )}

            {/* 5. COMPARISON SECTION (Shown on `/` and `/compare`) */}
            {(currentPath === '/' || currentPath === '/compare') && (
              <ComparisonSection
                comparedToolIds={comparedToolIds}
                onSetComparedTools={setComparedToolIds}
                onReplaceCompareSlot={handleReplaceCompareSlot}
                onInspectTool={(t) => navigateTo(`/ai-tools/${t.id}`)}
                isStandalonePage={currentPath === '/compare'}
              />
            )}

            {/* 6. GUIDES & BLOG SECTIONS (Shown on `/`, `/guides`, and `/blog`) */}
            {currentPath === '/' && (
              <GuidesAndLegalSection
                mode="home-preview"
                onNavigate={navigateTo}
                onInspectTool={(t) => navigateTo(`/ai-tools/${t.id}`)}
                onSelectCategory={handleSelectCategory}
              />
            )}
            {currentPath === '/guides' && (
              <GuidesAndLegalSection
                mode="guides-page"
                onNavigate={navigateTo}
                onInspectTool={(t) => navigateTo(`/ai-tools/${t.id}`)}
                onSelectCategory={handleSelectCategory}
              />
            )}
            {currentPath === '/blog' && (
              <GuidesAndLegalSection
                mode="blog-page"
                onNavigate={navigateTo}
                onInspectTool={(t) => navigateTo(`/ai-tools/${t.id}`)}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* Homepage Trust & Quick Navigation Hub (Internal Linking Section 50) */}
            {currentPath === '/' && (
              <section
                aria-labelledby="home-trust-heading"
                className="py-14 lg:py-20 bg-[#05070B] border-b border-slate-800/80"
              >
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="max-w-2xl">
                    <div className="text-xs font-medium text-sky-400 mb-2">
                      Transparency, Methodology & Community
                    </div>
                    <h2
                      id="home-trust-heading"
                      className="font-display text-2xl sm:text-3xl font-bold text-white"
                    >
                      How AI Toolkit Hub Works
                    </h2>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      We maintain clear editorial standards, explain our qualitative review criteria, and provide direct forms for reporting outdated tool details or suggesting new software.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: 'Review Methodology',
                        desc: 'See the 9 qualitative criteria we check instead of assigning arbitrary numeric ratings.',
                        path: '/methodology',
                      },
                      {
                        title: 'Editorial Policy',
                        desc: 'Learn how we research guides, verify vendor links, and handle corrections.',
                        path: '/editorial-policy',
                      },
                      {
                        title: 'Frequently Asked Questions',
                        desc: 'Read answers to 14 common questions about free tools, pricing, and independence.',
                        path: '/faq',
                      },
                      {
                        title: 'Suggest a Tool or Report Error',
                        desc: 'Submit a new AI tool for consideration or notify us of pricing changes.',
                        path: '/suggest-tool',
                      },
                    ].map((card) => (
                      <a
                        key={card.path}
                        href={card.path}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(card.path);
                        }}
                        className="p-5 rounded-2xl bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-sky-400/40 transition-colors flex flex-col justify-between group"
                      >
                        <div>
                          <h3 className="font-display text-base font-bold text-white group-hover:text-sky-300">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-sky-400">
                          <span>Read page</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* GLOBAL FOOTER (Section 57: Explore, Company, Legal, FAQ) */}
      <footer className="relative z-10 bg-[#05070B] border-t border-slate-800/80 pt-14 pb-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Summary Column */}
            <div className="lg:col-span-1 space-y-3">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="font-display text-lg font-bold text-white hover:text-sky-300"
              >
                AI Toolkit Hub
              </a>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover useful AI tools across 8 capability categories, compare software side by side, and use free client-side productivity utilities.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Contact: {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
              </div>
            </div>

            {/* Column 1: Explore */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-white tracking-wide">
                Explore
              </h2>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  { label: 'AI Tools', path: '/ai-tools' },
                  { label: 'Categories', path: '/categories' },
                  { label: 'Compare', path: '/compare' },
                  { label: 'Free Tools', path: '/free-tools' },
                  { label: 'Guides', path: '/guides' },
                  { label: 'Blog', path: '/blog' },
                ].map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(link.path);
                      }}
                      className="hover:text-sky-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-white tracking-wide">
                Company
              </h2>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  { label: 'About', path: '/about' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Editorial Policy', path: '/editorial-policy' },
                  { label: 'Methodology', path: '/methodology' },
                  { label: 'Report an Error', path: '/report-error' },
                  { label: 'Suggest a Tool', path: '/suggest-tool' },
                ].map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(link.path);
                      }}
                      className="hover:text-sky-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-white tracking-wide">
                Legal
              </h2>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  { label: 'Privacy Policy', path: '/privacy-policy' },
                  { label: 'Cookie Policy', path: '/cookie-policy' },
                  { label: 'Terms of Service', path: '/terms-of-service' },
                  { label: 'Disclaimer', path: '/disclaimer' },
                  { label: 'Accessibility', path: '/accessibility' },
                ].map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(link.path);
                      }}
                      className="hover:text-sky-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: FAQ & Technical SEO Links */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-white tracking-wide">
                FAQ & Preferences
              </h2>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="/faq"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/faq');
                    }}
                    className="hover:text-sky-300 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setCookieModalOpen(true)}
                    className="hover:text-sky-300 transition-colors cursor-pointer text-left"
                  >
                    Cookie Settings
                  </button>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-300 transition-colors"
                  >
                    XML Sitemap (/sitemap.xml)
                  </a>
                </li>
                <li>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-300 transition-colors"
                  >
                    Robots.txt (/robots.txt)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {SITE_CONFIG.siteName}. Informational content only. Verify third-party software pricing and terms on each vendor’s official website.
            </p>
            <div className="font-mono text-[11px] text-slate-500">
              Canonical Base: {SITE_CONFIG.SITE_URL}
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner & Granular Preferences Modal */}
      <CookieConsent
        isOpenSettings={cookieModalOpen}
        onCloseSettings={() => setCookieModalOpen(false)}
        onOpenSettings={() => setCookieModalOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Quick Tool Modal (if triggered) */}
      {inspectedTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-tool-title"
          onClick={() => setInspectedTool(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/90 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <ToolEmblem3D name={inspectedTool.name} category={inspectedTool.category} />
                <div>
                  <h3 id="modal-tool-title" className="font-display text-2xl font-bold text-white">
                    {inspectedTool.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-sky-300 font-medium">{inspectedTool.category}</span>
                    <span>·</span>
                    <span>{inspectedTool.pricing}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedTool(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300">{inspectedTool.description}</p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigateTo(`/ai-tools/${inspectedTool.id}`)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 cursor-pointer"
              >
                Open Full Tool Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
