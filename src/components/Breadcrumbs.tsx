import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from './SEOHead';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1 text-xs text-slate-400"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.path}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-slate-600 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-slate-200 font-medium truncate max-w-[260px]"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path);
                  }}
                  className="inline-flex items-center gap-1 hover:text-sky-300 transition-colors focus-visible:outline-2 focus-visible:outline-sky-400 rounded"
                >
                  {idx === 0 && <Home className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />}
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
