import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';
import {
  generateRobotsTxt,
  generateSitemapXml,
} from './src/config/siteConfig';

const PLACEHOLDER_TOKENS = new Set([
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
]);

function isPlaceholder(val?: string): boolean {
  if (!val) return true;
  const cleaned = val.trim().toLowerCase();
  if (!cleaned) return true;
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) return true;
  for (const token of PLACEHOLDER_TOKENS) {
    if (cleaned.includes(token)) return true;
  }
  return false;
}

function resolveBuildSiteUrl(env: Record<string, string | undefined>): string {
  const candidates = [env.VITE_SITE_URL, process.env.VITE_SITE_URL, env.APP_URL, process.env.APP_URL];
  for (const candidate of candidates) {
    if (candidate && !isPlaceholder(candidate)) {
      try {
        const parsed = new URL(candidate.trim());
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          return `${parsed.origin}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')}`;
        }
      } catch {
        // Ignore invalid URL candidate and continue to fallback
      }
    }
  }
  return 'http://localhost:3000';
}

function resolveBuildVerificationToken(env: Record<string, string | undefined>): string {
  const raw = env.VITE_GOOGLE_SITE_VERIFICATION ?? process.env.VITE_GOOGLE_SITE_VERIFICATION ?? '';
  const trimmed = raw.trim();
  if (!trimmed || isPlaceholder(trimmed)) {
    return '';
  }
  return trimmed;
}

function seoEnvAndSitemapPlugin(siteUrl: string, verificationToken: string): Plugin {
  return {
    name: 'seo-env-and-sitemap-plugin',
    transformIndexHtml(html) {
      let updated = html.replace(/__SITE_URL__/g, siteUrl);
      if (verificationToken.length > 0) {
        const safeToken = verificationToken.replace(/"/g, '&quot;');
        updated = updated.replace(
          '<!-- __GSC_VERIFICATION_META__ -->',
          `<meta name="google-site-verification" content="${safeToken}" />`
        );
      } else {
        updated = updated.replace('<!-- __GSC_VERIFICATION_META__ -->', '');
      }
      return updated;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0];
        if (urlPath === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(generateSitemapXml(siteUrl));
          return;
        }
        if (urlPath === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(generateRobotsTxt(siteUrl));
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: generateSitemapXml(siteUrl),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: generateRobotsTxt(siteUrl),
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const resolvedSiteUrl = resolveBuildSiteUrl(env);
  const resolvedVerificationToken = resolveBuildVerificationToken(env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      seoEnvAndSitemapPlugin(resolvedSiteUrl, resolvedVerificationToken),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
