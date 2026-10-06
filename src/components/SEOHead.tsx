import React, { useEffect } from 'react';
import {
  getCanonicalUrl,
  getOgImageUrl,
  resolveGoogleSiteVerification,
  SITE_CONFIG,
} from '../config/siteConfig';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  robots?: 'index, follow' | 'noindex, follow';
  ogType?: 'website' | 'article';
  breadcrumbs?: BreadcrumbItem[];
  extraJsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  path,
  robots = 'index, follow',
  ogType = 'website',
  breadcrumbs = [],
  extraJsonLd,
}) => {
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = getOgImageUrl();
  const verificationToken = resolveGoogleSiteVerification();

  useEffect(() => {
    document.title = title;

    setOrCreateMeta('name', 'description', description);
    setOrCreateMeta('name', 'robots', robots);
    setOrCreateCanonical(canonicalUrl);

    // Open Graph metadata
    setOrCreateMeta('property', 'og:title', title);
    setOrCreateMeta('property', 'og:description', description);
    setOrCreateMeta('property', 'og:url', canonicalUrl);
    setOrCreateMeta('property', 'og:type', ogType);
    setOrCreateMeta('property', 'og:site_name', SITE_CONFIG.siteName);
    setOrCreateMeta('property', 'og:image', ogImageUrl);

    // Twitter / X card metadata
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', title);
    setOrCreateMeta('name', 'twitter:description', description);
    setOrCreateMeta('name', 'twitter:image', ogImageUrl);

    // Only render Google Search Console verification meta tag when VITE_GOOGLE_SITE_VERIFICATION exists (never use placeholder tokens)
    const existingGsc = document.head.querySelector('meta[name="google-site-verification"]');
    if (verificationToken.length > 0) {
      setOrCreateMeta('name', 'google-site-verification', verificationToken);
    } else if (existingGsc) {
      existingGsc.remove();
    }
  }, [title, description, canonicalUrl, robots, ogType, ogImageUrl, verificationToken]);

  // Build valid Schema.org JSON-LD graph using resolved canonical URLs
  const siteRootUrl = getCanonicalUrl('/');
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${siteRootUrl}#website`,
      url: siteRootUrl,
      name: SITE_CONFIG.siteName,
      description:
        'Discover useful AI tools across writing, coding, images, video, and research, compare options side by side, and use free browser-based productivity utilities.',
    },
    {
      '@type': 'Organization',
      '@id': `${siteRootUrl}#organization`,
      name: SITE_CONFIG.siteName,
      url: siteRootUrl,
    },
  ];

  if (breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.label,
        item: getCanonicalUrl(crumb.path),
      })),
    });
  }

  if (extraJsonLd) {
    if (Array.isArray(extraJsonLd)) {
      graph.push(...extraJsonLd);
    } else {
      graph.push(extraJsonLd);
    }
  }

  const jsonLdPayload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
    />
  );
};
