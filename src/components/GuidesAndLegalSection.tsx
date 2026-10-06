import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle, FileText } from 'lucide-react';
import {
  AI_TOOLS,
  AITool,
  BLOG_POSTS,
  BlogPost,
  GUIDE_ARTICLES,
  GuideArticle,
  ToolCategory,
} from '../data/aiToolsData';

interface GuidesAndBlogSectionProps {
  mode: 'home-preview' | 'guides-page' | 'blog-page';
  onNavigate: (path: string) => void;
  onInspectTool: (tool: AITool) => void;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const GuidesAndLegalSection: React.FC<GuidesAndBlogSectionProps> = ({
  mode,
  onNavigate,
  onInspectTool,
  onSelectCategory,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle>(GUIDE_ARTICLES[0]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost>(BLOG_POSTS[0]);

  const GuidesHeadingTag = mode === 'guides-page' ? 'h1' : 'h2';
  const BlogHeadingTag = mode === 'blog-page' ? 'h1' : 'h2';

  const relatedGuideTools = AI_TOOLS.filter((t) =>
    selectedGuide.relatedToolIds.includes(t.id)
  );
  const relatedBlogTools = AI_TOOLS.filter((t) =>
    selectedBlog.relatedToolIds.includes(t.id)
  );

  return (
    <div className="relative z-10">
      {/* GUIDES SECTION */}
      {(mode === 'home-preview' || mode === 'guides-page') && (
        <section
          id="guides-section"
          aria-labelledby="guides-heading"
          className="py-14 lg:py-20 border-b border-slate-800/70"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
                  <span>Practical Tutorials & Frameworks</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">Readability-First Layout</span>
                </div>
                <GuidesHeadingTag
                  id="guides-heading"
                  className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  AI Guides & Tutorials
                </GuidesHeadingTag>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Step-by-step guides for evaluating AI software, structuring prompts, and choosing research workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Guide Selector List */}
              <div className="lg:col-span-5 space-y-3.5">
                {GUIDE_ARTICLES.map((article) => {
                  const isSelected = selectedGuide.id === article.id;
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedGuide(article)}
                      className={`w-full text-left p-5 rounded-2xl transition-colors duration-150 border cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                        isSelected
                          ? 'bg-slate-900 border-sky-400/60 shadow-lg'
                          : 'bg-slate-950/80 hover:bg-slate-900/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                        <span className="font-mono text-sky-400 font-semibold">
                          {article.number}.
                        </span>
                        <span>{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>Updated {article.lastReviewedDate}</span>
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Active Guide Reader Surface */}
              <article className="lg:col-span-7 rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-sky-300 font-medium">{selectedGuide.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Published {selectedGuide.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedGuide.readTime}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {selectedGuide.title}
                  </h2>
                </div>

                {/* Key Takeaways Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/85 border border-slate-800">
                  <div className="text-xs font-semibold text-sky-300 mb-2.5">
                    Key Takeaways
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {selectedGuide.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Sections */}
                <div className="space-y-5 text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                  {selectedGuide.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white">
                        {sec.heading}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}
                </div>

                {/* Internal Links: Guide -> Related AI Tools & Category */}
                <div className="pt-5 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Related AI Tools Mentioned in This Guide:
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {relatedGuideTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => onInspectTool(tool)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700/80 transition-colors cursor-pointer"
                      >
                        {tool.name} ({tool.category})
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onSelectCategory(selectedGuide.category)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/50 border border-slate-800 cursor-pointer"
                    >
                      <span>Browse all {selectedGuide.category} tools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* BLOG SECTION */}
      {(mode === 'home-preview' || mode === 'blog-page') && (
        <section
          id="blog-section"
          aria-labelledby="blog-heading"
          className="py-14 lg:py-20 border-b border-slate-800/70"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Editorial Articles & Analysis</span>
                </div>
                <BlogHeadingTag
                  id="blog-heading"
                  className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  AI Toolkit Hub Blog
                </BlogHeadingTag>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Articles covering browser privacy, software pricing models, and accessible 3D web design.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-3.5">
                {BLOG_POSTS.map((post) => {
                  const isSelected = selectedBlog.id === post.id;
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedBlog(post)}
                      className={`w-full text-left p-5 rounded-2xl transition-colors duration-150 border cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                        isSelected
                          ? 'bg-slate-900 border-sky-400/60 shadow-lg'
                          : 'bg-slate-950/80 hover:bg-slate-900/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                        <span className="text-sky-400 font-medium">{post.topic}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              <article className="lg:col-span-7 rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-sky-300 font-medium">{selectedBlog.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>Published {selectedBlog.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedBlog.readTime}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {selectedBlog.title}
                  </h2>
                </div>

                <div className="space-y-5 text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                  {selectedBlog.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white">
                        {sec.heading}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}
                </div>

                {/* Internal Links: Blog -> Related Tools & Editorial Policy */}
                <div className="pt-5 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Related Resources & Tools:
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {relatedBlogTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => onInspectTool(tool)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700/80 transition-colors cursor-pointer"
                      >
                        {tool.name}
                      </button>
                    ))}
                    <a
                      href="/free-tools"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('/free-tools');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800"
                    >
                      Open Free Browser Utilities →
                    </a>
                    <a
                      href="/editorial-policy"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('/editorial-policy');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800"
                    >
                      Read Editorial Policy →
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
