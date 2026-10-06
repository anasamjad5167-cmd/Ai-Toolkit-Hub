/**
 * Central Site Configuration with non-blocking optional environment-variable handling.
 *
 * - `VITE_SITE_URL`: Optional. Used when provided for canonical URLs, sitemap generation,
 *   Open Graph URLs, and Schema.org structured data. Otherwise falls back safely to the
 *   active browser origin (`window.location.origin`) or `http://localhost:3000` in development.
 * - `VITE_GOOGLE_SITE_VERIFICATION`: Optional. Only rendered when a real verification token
 *   is provided. Placeholder tokens are strictly ignored.
 */

const PLACEHOLDER_PATTERNS = [
  'my_site_url',
  'your_site_url',
  'my_app_url',
  'my_google_site_verification',
  'your_google_site_verification',
  'your_verification_token',
  'placeholder',
  'todo',
  'change_me',
  'none',
  'null',
  'undefined',
];

function isPlaceholderValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized.startsWith('[') && normalized.endsWith(']')) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function resolveSiteUrl(): string {
  const rawEnvUrl =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SITE_URL
      : undefined;

  if (typeof rawEnvUrl === 'string' && !isPlaceholderValue(rawEnvUrl)) {
    const trimmed = rawEnvUrl.trim().replace(/\/+$/, '');
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return `${parsed.origin}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')}`;
      }
    } catch {
      // Ignore malformed URL and use safe development fallback
    }
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return 'http://localhost:3000';
}

export function resolveGoogleSiteVerification(): string {
  const rawToken =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
      : undefined;

  if (typeof rawToken !== 'string') return '';
  const trimmed = rawToken.trim();
  if (!trimmed || isPlaceholderValue(trimmed)) {
    return '';
  }
  return trimmed;
}

export const INDEXABLE_ROUTES: {
  path: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
}[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/ai-tools', changefreq: 'weekly', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
  { path: '/compare', changefreq: 'weekly', priority: '0.8' },
  { path: '/free-tools', changefreq: 'weekly', priority: '0.9' },
  { path: '/guides', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/editorial-policy', changefreq: 'monthly', priority: '0.6' },
  { path: '/methodology', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/cookie-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms-of-service', changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
  { path: '/accessibility', changefreq: 'monthly', priority: '0.5' },
  { path: '/report-error', changefreq: 'monthly', priority: '0.5' },
  { path: '/suggest-tool', changefreq: 'monthly', priority: '0.6' },
];

export const SITE_CONFIG = {
  siteName: 'AI Toolkit Hub',
  get SITE_URL(): string {
    return resolveSiteUrl();
  },
  get GOOGLE_SITE_VERIFICATION(): string {
    return resolveGoogleSiteVerification();
  },
  CONTACT_EMAIL_PLACEHOLDER: '[YOUR EMAIL ADDRESS]',
  ACCESSIBILITY_EMAIL_PLACEHOLDER: '[YOUR CONTACT EMAIL]',
  HAS_CONFIGURED_FORM_BACKEND: false,
  defaultOgImage: '/og-preview.svg',
};

export function getCanonicalUrl(pathname: string, baseOverride?: string): string {
  const cleanBase = (baseOverride || resolveSiteUrl()).replace(/\/+$/, '');
  const cleanPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  return `${cleanBase}${cleanPath}`;
}

export function getOgImageUrl(baseOverride?: string): string {
  const cleanBase = (baseOverride || resolveSiteUrl()).replace(/\/+$/, '');
  return `${cleanBase}${SITE_CONFIG.defaultOgImage}`;
}

export function generateSitemapXml(baseOverride?: string): string {
  const base = (baseOverride || resolveSiteUrl()).replace(/\/+$/, '');
  const urlEntries = INDEXABLE_ROUTES.map((route) => {
    const loc = getCanonicalUrl(route.path, base);
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

export function generateRobotsTxt(baseOverride?: string): string {
  const base = (baseOverride || resolveSiteUrl()).replace(/\/+$/, '');
  return [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /admin/',
    'Disallow: /*?preview=',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');
}
