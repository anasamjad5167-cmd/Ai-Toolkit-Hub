import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cookie,
  Eye,
  FileCheck,
  HelpCircle,
  Info,
  Scale,
  Settings2,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { FAQ_ITEMS } from '../data/aiToolsData';

export type TrustPageRoute =
  | '/about'
  | '/privacy-policy'
  | '/cookie-policy'
  | '/terms-of-service'
  | '/faq'
  | '/editorial-policy'
  | '/methodology'
  | '/disclaimer'
  | '/accessibility';

interface TrustAndLegalPagesProps {
  route: TrustPageRoute;
  onNavigate: (path: string) => void;
  onOpenCookieSettings: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const TrustAndLegalPages: React.FC<TrustAndLegalPagesProps> = ({
  route,
  onNavigate,
  onOpenCookieSettings,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* 1. ABOUT PAGE (/about) */}
      {route === '/about' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-8 text-slate-300 leading-relaxed">
          <header className="border-b border-slate-800 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <Info className="w-4 h-4" />
              <span>About the Platform · Transparency & Mission</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              About AI Toolkit Hub
            </h1>
            <p className="text-base text-slate-300">
              An independent informational directory, software comparison resource, and suite of free browser-based productivity utilities.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              What AI Toolkit Hub Is
            </h2>
            <p>
              AI Toolkit Hub is a web platform created to help everyday users, students, researchers, writers, designers, and software developers navigate the rapidly expanding landscape of artificial intelligence tools and daily digital utilities.
            </p>
            <p>
              Rather than presenting hype or unverified marketing slogans, we organize third-party AI software into clear capability categories and provide practical, client-side productivity utilities that work directly in your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              Why This Website Exists
            </h2>
            <p>
              Finding the right software for a specific task often requires sifting through dozens of landing pages to answer basic questions: Does this tool have a free tier? What platforms does it support? What are its practical limitations? AI Toolkit Hub exists to summarize those factual details in a consistent format alongside free utilities you can use immediately without creating an account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              What Users Can Do on AI Toolkit Hub
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Explore AI Tools by Category:</strong> Browse 24 listed AI platforms organized across Writing, Coding, Images, Video, Research, Education, Productivity, and Audio on our{' '}
                <a
                  href="/ai-tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/ai-tools');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  AI Tools Directory
                </a>
                .
              </li>
              <li>
                <strong className="text-white">Compare Software Options Side by Side:</strong> Evaluate up to three tools at once across primary use cases, free-plan availability, pricing transparency, supported platforms, and known limitations on the{' '}
                <a
                  href="/compare"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/compare');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Compare page
                </a>
                .
              </li>
              <li>
                <strong className="text-white">Use Free Browser Utilities:</strong> Access six client-side utilities—Word Counter, Password Generator, JSON Formatter, Percentage Calculator, Color Converter, and Prompt Generator—on our{' '}
                <a
                  href="/free-tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/free-tools');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Free Tools page
                </a>
                .
              </li>
              <li>
                <strong className="text-white">Read Practical Guides & Articles:</strong> Learn structured prompting and software evaluation principles in our{' '}
                <a
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/guides');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Guides
                </a>{' '}
                and{' '}
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/blog');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Blog
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              How AI Tools Are Researched and Selected
            </h2>
            <p>
              Tools listed in our directory are selected based on clear documentation, active public availability, relevance to one of our eight core capability categories, and transparent pricing pages. We inspect official vendor documentation, product changelogs, and publicly accessible interfaces to summarize what each tool does and where its boundaries lie. For full details, see our{' '}
              <a
                href="/methodology"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/methodology');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                AI Tool Review Methodology
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              How Information Is Reviewed and Updated
            </h2>
            <p>
              Listings and articles are checked against official vendor websites at the time of publication and reviewed periodically. Because software providers frequently change their pricing tiers, credit allowances, and feature sets, we encourage visitors to verify current terms on the vendor’s official website and use our{' '}
              <a
                href="/report-error"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/report-error');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Report an Error page
              </a>{' '}
              if they spot outdated details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              Editorial Standards & Transparency Statement
            </h2>
            <p>
              We follow strict editorial honesty standards: we do not fabricate user review counts, we do not invent arbitrary numeric scores, and we do not claim formal partnerships or endorsements with the third-party software companies listed in our directory. Read our complete{' '}
              <a
                href="/editorial-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/editorial-policy');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Editorial Policy
              </a>
              .
            </p>
          </section>

          <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h2 className="font-display text-lg font-bold text-white">
              Contact Information & Ownership Placeholders
            </h2>
            <p className="text-sm">
              Primary Contact Email:{' '}
              <code className="text-sky-300 font-mono">
                {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
              </code>{' '}
              (Placeholder until production email address is configured).
            </p>
            <p className="text-sm">
              You can also reach out or submit inquiries via our{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Contact page
              </a>
              .
            </p>
          </section>
        </article>
      )}

      {/* 2. PRIVACY POLICY (/privacy-policy) */}
      {route === '/privacy-policy' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <Shield className="w-4 h-4" />
              <span>Legal Documentation · Privacy Policy</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">Last Updated: October 6, 2026</p>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">1. Introduction</h2>
            <p>
              This Privacy Policy explains how AI Toolkit Hub ("we", "our", or "the website") handles information when you visit our pages, use our client-side productivity utilities, or interact with our forms. We are committed to clear, truthful explanations of what is and is not collected.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">2. Information We Collect</h2>
            <p>
              AI Toolkit Hub does not require user registration or account creation to browse the AI tool directory, read guides, or use our free productivity tools. Depending on how you interact with the website, information falls into two categories: information you voluntarily enter and standard technical request data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">3. Information Users Provide</h2>
            <p>
              When you use our client-side Free Tools (such as the Word Counter, Password Generator, JSON Formatter, Percentage Calculator, Color Converter, or Prompt Generator), the text and values you type are processed locally inside your web browser and are not transmitted to our servers.
            </p>
            <p>
              If you complete our Contact, Report an Error, or Suggest a Tool forms, you may enter your name, email address, and message details. Please note that unless a backend email or form-processing service is actively configured on the hosting environment, form inputs remain in your local browser session so you can copy and send them manually. If a backend form handler is configured in the future, submitted fields will be used solely to review and respond to your inquiry.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              4. Automatically Collected Information
            </h2>
            <p>
              Like most websites on the internet, the web hosting infrastructure serving this site automatically receives standard HTTP request metadata when your browser loads a page. This may include your IP address, browser user-agent string, referring URL, requested page path, and timestamp, which are used to deliver web content and maintain server security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">5. Cookies & Browser Storage</h2>
            <p>
              We use standard browser <code className="text-sky-300">localStorage</code> to save your cookie-consent preferences and interface settings (such as Reduced-Motion / Static mode). For detailed information on cookie categories and controls, please read our{' '}
              <a
                href="/cookie-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/cookie-policy');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Cookie Policy
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">6. Analytics</h2>
            <p>
              Third-party analytics scripts (such as Google Analytics) are not active by default unless explicitly configured by the site operator. If analytics services are enabled in the future and you grant consent where required, they may collect aggregated usage data such as pages visited, session duration, and device type.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">7. Advertising</h2>
            <p>
              If advertising services are enabled on AI Toolkit Hub in the future, third-party ad networks may display clearly labeled advertisements. Any advertising units are visually separated from navigation and interactive utility controls.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">8. Google AdSense</h2>
            <p>
              If advertising services such as Google AdSense are enabled on this website in the future, Google and its partners may use cookies or similar technologies (such as the DoubleClick cookie) to serve ads based on a user’s prior visits to this website or other websites on the internet. Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 underline hover:text-sky-200"
              >
                Google Ads Settings
              </a>{' '}
              or adjusting their choices in our cookie consent settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">9. Third-Party Services</h2>
            <p>
              This website loads web fonts from Google Fonts to render typography consistently across devices. When your browser fetches font files, Google may receive standard request metadata in accordance with Google’s privacy policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">10. External Links</h2>
            <p>
              Our directory contains links to external third-party AI tools and vendor websites. We do not control and are not responsible for the privacy practices or content of third-party websites. We encourage you to read the privacy policy of every external website you visit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">11. How Information Is Used</h2>
            <p>
              Any information collected or provided is used to: (a) deliver and maintain the website and its utilities, (b) remember your accessibility and consent preferences, (c) review user-submitted error reports or tool suggestions, and (d) protect the security and stability of the website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">12. Data Retention</h2>
            <p>
              Client-side utility inputs are never stored on our servers and disappear as soon as you clear or close your browser tab. Local storage preferences remain in your browser until you clear your site data. If contact messages are received via email, they are retained only as long as necessary to address your inquiry.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">13. Data Security</h2>
            <p>
              We use standard technical safeguards—including HTTPS encryption in transit and client-side processing for utilities—to reduce data exposure. However, no method of transmission over the internet is 100% immune to risk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">14. User Rights</h2>
            <p>
              Depending on your jurisdiction (including under the GDPR, UK GDPR, or CCPA/CPRA), you may have the right to request access to, correction of, or deletion of personal information we hold about you, as well as the right to withdraw consent for non-essential cookies at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">15. Children’s Privacy</h2>
            <p>
              AI Toolkit Hub is a general-audience informational website and does not knowingly collect personal information from children under the age of 13 (or the applicable age of digital consent in your jurisdiction).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">16. International Visitors</h2>
            <p>
              If you access this website from outside the country where our hosting servers are located, standard web traffic data may be processed across international borders in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">17. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect operational, legal, or technical changes. When we make updates, we will revise the "Last Updated" date at the top of this page.
            </p>
          </section>

          <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h2 className="font-display text-lg font-bold text-white">18. Contact Information</h2>
            <p>
              If you have questions about this Privacy Policy, you may contact us at{' '}
              <code className="text-sky-300 font-mono">
                {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
              </code>{' '}
              or via our{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Contact page
              </a>
              .
            </p>
          </section>
        </article>
      )}

      {/* 3. COOKIE POLICY (/cookie-policy) */}
      {route === '/cookie-policy' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                <Cookie className="w-4 h-4" />
                <span>Legal Documentation · Cookie Policy</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Cookie Policy
              </h1>
              <p className="text-xs text-slate-400">Last Updated: October 6, 2026</p>
            </div>

            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Settings2 className="w-4 h-4" />
              <span>Open Cookie Settings</span>
            </button>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Necessary Cookies & Storage</h2>
            <p>
              Necessary cookies and local storage entries are required for core website functionality. Specifically, AI Toolkit Hub stores a single JSON record (<code className="text-sky-300">ai_toolkit_hub_cookie_consent_v1</code>) in your browser’s <code className="text-sky-300">localStorage</code> to remember whether you have accepted or rejected non-essential cookies so the consent banner does not reappear on every page navigation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Preference Cookies</h2>
            <p>
              Preference storage is used to remember interface choices such as whether you prefer Static Mode (reduced 3D motion) and which AI tools you have selected in the comparison tray during your session.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Analytics Cookies</h2>
            <p>
              AI Toolkit Hub does not currently have third-party analytics cookies installed. If an analytics service is configured in the future, analytics cookies will only be activated in accordance with your consent choices to measure aggregate traffic patterns.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Advertising Cookies</h2>
            <p>
              AI Toolkit Hub does not currently set active advertising cookies. If advertising providers such as Google AdSense are enabled in the future, those providers may use cookies or web beacons to serve relevant advertisements, cap ad frequency, and measure ad effectiveness, subject to your consent settings where required by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Third-Party Cookies</h2>
            <p>
              When you click external links to visit third-party AI software providers listed in our directory, those external websites operate under their own cookie and privacy policies over which we have no control.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">Cookie Controls</h2>
            <p>
              You can review or change your preferences on this website at any time by clicking the <strong className="text-white">Open Cookie Settings</strong> button at the top of this page or the <strong className="text-white">Cookie Settings</strong> link in the global footer. Additionally, most web browsers allow you to block or delete cookies and local storage through your browser’s privacy settings.
            </p>
          </section>
        </article>
      )}

      {/* 4. TERMS OF SERVICE (/terms-of-service) */}
      {route === '/terms-of-service' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <Scale className="w-4 h-4" />
              <span>Legal Documentation · Terms of Service</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400">Last Updated: October 6, 2026</p>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI Toolkit Hub, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">2. Website Usage</h2>
            <p>
              AI Toolkit Hub provides an informational directory of third-party AI tools, side-by-side comparison tables, educational guides, and free browser-based productivity utilities for personal and professional informational use.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">3. User Responsibilities</h2>
            <p>
              You are responsible for verifying the suitability, licensing terms, security compliance, and pricing of any third-party software product before adopting it, as well as safeguarding any passwords or outputs you generate using our client-side utilities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              4. AI Tool Information Disclaimer
            </h2>
            <p>
              Third-party AI software features, pricing tiers, free-plan quotas, and API policies change frequently. While we strive to keep listings accurate, AI Toolkit Hub does not warrant that directory descriptions or comparison tables are error-free or current at all times.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">5. External Websites</h2>
            <p>
              Links to third-party AI tools and external resources are provided for convenience. AI Toolkit Hub does not endorse, control, or assume responsibility for any third-party website, software service, or terms of service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">6. Intellectual Property</h2>
            <p>
              The original compilation, layout, custom 3D graphics, guides, and utility source code on AI Toolkit Hub are protected by applicable copyright laws. Third-party product names and trademarks mentioned in the directory belong to their respective owners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              7. User Submissions & Suggestions
            </h2>
            <p>
              If you submit a tool suggestion, error report, or feedback, you grant AI Toolkit Hub a non-exclusive right to review, edit, and publish factual directory updates based on that submission without compensation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">8. Prohibited Activities</h2>
            <p>
              You agree not to attempt to disrupt the website’s operation, scrape content in a manner that degrades availability, submit malicious links or spam through site forms, or misrepresent your affiliation with any software vendor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">9. Availability</h2>
            <p>
              We provide this website on an "as-is" and "as-available" basis and may modify, suspend, or discontinue any section or utility at any time without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, AI Toolkit Hub and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website, our free browser utilities, or any third-party software linked from our directory.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              11. Changes to the Service & Terms
            </h2>
            <p>
              We may revise these Terms of Service from time to time. Continued use of the website following posted updates constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h2 className="font-display text-lg font-bold text-white">12. Contact Information</h2>
            <p>
              Questions regarding these Terms of Service can be directed to{' '}
              <code className="text-sky-300 font-mono">
                {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
              </code>{' '}
              or via our{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Contact page
              </a>
              .
            </p>
          </section>
        </article>
      )}

      {/* 5. FAQ PAGE (/faq) */}
      {route === '/faq' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-8">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-sm text-slate-300">
              Clear, truthful answers about how AI Toolkit Hub works, how tools are listed, and how our free utilities operate.
            </p>
          </header>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <section
                key={item.id}
                className="p-5 rounded-xl bg-slate-900/75 border border-slate-800/90 space-y-2.5"
              >
                <h2 className="font-display text-lg font-bold text-white">{item.question}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
                <div className="pt-1">
                  <a
                    href={item.relatedLinkPath}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.relatedLinkPath);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300"
                  >
                    <span>{item.relatedLinkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </section>
            ))}
          </div>
        </article>
      )}

      {/* 6. EDITORIAL POLICY (/editorial-policy) */}
      {route === '/editorial-policy' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <BookOpen className="w-4 h-4" />
              <span>Governance & Standards · Editorial Policy</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Editorial Policy
            </h1>
            <p className="text-xs text-slate-400">
              How we research, verify, update, and maintain content on AI Toolkit Hub.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              1. How Articles and Guides Are Researched
            </h2>
            <p>
              Our guides and blog articles focus on practical software selection, prompt structure, privacy considerations, and web accessibility. Topics are researched using primary technical documentation, vendor pricing pages, and established web standards (such as W3C WCAG guidelines and Web Crypto specifications).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              2. How AI Tool Information Is Collected
            </h2>
            <p>
              For each software platform in our directory, we collect publicly verifiable information from the provider’s official website, documentation portal, and pricing page—including supported operating systems, whether a free tier exists, whether a public API is offered, and primary workflow focus.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              3. How Information Is Checked
            </h2>
            <p>
              Before publishing a tool summary or comparison row, we verify that external links point to the authentic vendor domain and avoid repeating unsubstantiated marketing superlatives or fabricated benchmark scores.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              4. How Updates and Corrections Are Handled
            </h2>
            <p>
              AI software evolves rapidly. When a vendor changes its pricing model, retires a feature, or updates its platform support, we update the corresponding listing as part of our periodic maintenance or upon receiving a verified user report.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              5. How Users Can Report Errors
            </h2>
            <p>
              Readers who spot an outdated detail, broken link, or factual inaccuracy can submit a correction request directly through our{' '}
              <a
                href="/report-error"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/report-error');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Report an Error page
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              6. How AI Assistance and Human Review Are Used
            </h2>
            <p>
              AI drafting and structuring tools may be used to assist in organizing directory descriptions, formatting code, and summarizing public documentation. Editorial review checks that published pages remain readable, accurate, and free of fabricated claims, fake reviews, or misleading promises. We do not claim that articles have undergone third-party academic peer review or certified laboratory testing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              7. Advertising & Affiliate Disclosure
            </h2>
            <p>
              AI Toolkit Hub is designed to remain editorially independent. Software vendors cannot pay to alter factual descriptions of their limitations or pricing models. If display advertising (such as Google AdSense) or referral links are enabled in the future, advertising spaces will always be clearly labeled and visually separated from directory results and utility controls.
            </p>
          </section>
        </article>
      )}

      {/* 7. AI TOOL REVIEW METHODOLOGY (/methodology) */}
      {route === '/methodology' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <FileCheck className="w-4 h-4" />
              <span>Evaluation Framework · Review Methodology</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              AI Tool Review Methodology
            </h1>
            <p className="text-xs text-slate-400">
              How AI Toolkit Hub structures tool profiles and side-by-side comparisons.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              Why We Do Not Assign Arbitrary Numeric Scores
            </h2>
            <p>
              Many software directories display arbitrary "4.9 / 5" star ratings or "98/100" scores without explaining how those numbers were calculated. On AI Toolkit Hub, <strong className="text-white">we do not assign numeric scores or aggregate star ratings</strong> because the best tool depends entirely on a user’s specific task, budget, and platform requirements. Instead, we evaluate every tool across nine transparent, qualitative criteria.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              Our Nine Evaluation Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: '1. Primary Use Cases',
                  desc: 'The specific workflow the tool is built to handle (e.g., repository-wide code editing vs. academic paper discovery).',
                },
                {
                  title: '2. Free-Plan Availability',
                  desc: 'Whether users can test the core workflow on a free tier or trial before committing to a paid subscription.',
                },
                {
                  title: '3. Pricing Transparency',
                  desc: 'Whether subscription tiers, seat costs, and usage limits are clearly published on the vendor’s official website.',
                },
                {
                  title: '4. Supported Platforms',
                  desc: 'Availability across web browsers, macOS, Windows, Linux, iOS, Android, and IDE extensions.',
                },
                {
                  title: '5. Core Features & Strengths',
                  desc: 'Concrete functional capabilities that differentiate the tool within its category.',
                },
                {
                  title: '6. Practical Limitations',
                  desc: 'Honest trade-offs—such as credit consumption rates, lack of an API, or narrow domain scope.',
                },
                {
                  title: '7. Ease of Use & User Experience',
                  desc: 'Whether the interface is accessible to beginners or requires developer setup and configuration.',
                },
                {
                  title: '8. Documentation Quality',
                  desc: 'Presence of clear onboarding guides, prompt documentation, changelogs, and API references.',
                },
                {
                  title: '9. Ecosystem Integrations',
                  desc: 'Support for standard export formats (SVG, Markdown, CSV, XML) and third-party tools.',
                },
              ].map((criterion) => (
                <div
                  key={criterion.title}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                >
                  <h3 className="font-display text-base font-bold text-white">
                    {criterion.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{criterion.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      )}

      {/* 8. DISCLAIMER (/disclaimer) */}
      {route === '/disclaimer' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Legal Documentation · Website Disclaimer</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Disclaimer
            </h1>
            <p className="text-xs text-slate-400">Last Updated: October 6, 2026</p>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              1. Informational Purpose Only
            </h2>
            <p>
              All directory listings, software comparisons, guides, blog posts, and utilities on AI Toolkit Hub are provided strictly for general informational and educational purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              2. Third-Party Product Information Can Change
            </h2>
            <p>
              Third-party AI software companies frequently modify their subscription pricing, free-tier allowances, model capabilities, terms of service, and privacy policies without notice. Information displayed on AI Toolkit Hub may not reflect the most recent changes made by a vendor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              3. Verify Pricing and Important Details with the Official Provider
            </h2>
            <p>
              Before purchasing any subscription, uploading confidential or regulated data, or integrating a third-party API into your workflow, you should always verify current pricing, security certifications, and licensing terms directly on the official provider’s website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              4. No Guarantee of Third-Party Performance
            </h2>
            <p>
              AI Toolkit Hub does not develop, control, or operate the third-party software products listed in our directory and makes no guarantees regarding their uptime, accuracy, safety, or fitness for a particular purpose.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              5. Not Professional Financial, Medical, Legal, or Regulated Advice
            </h2>
            <p>
              Nothing on this website constitutes legal, financial, tax, medical, or other regulated professional advice. You should consult a qualified professional before making legal, financial, compliance, or healthcare decisions.
            </p>
          </section>
        </article>
      )}

      {/* 9. ACCESSIBILITY STATEMENT (/accessibility) */}
      {route === '/accessibility' && (
        <article className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7 text-slate-300 leading-relaxed text-sm sm:text-base">
          <header className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                <Eye className="w-4 h-4" />
                <span>Inclusive Design · Accessibility Statement</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Accessibility Statement
              </h1>
              <p className="text-xs text-slate-400">
                Our commitment to keyboard usability, contrast, and reduced-motion support.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleReducedMotion}
              aria-pressed={reducedMotion}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 transition-colors cursor-pointer self-start sm:self-auto"
            >
              {reducedMotion ? 'Static Mode Active (Click for 3D)' : 'Enable Static Reduced-Motion Mode'}
            </button>
          </header>

          <section className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              Our Commitment to Accessibility
            </h2>
            <p>
              AI Toolkit Hub is designed so that all visitors—including people using assistive technologies, screen readers, keyboard-only navigation, or reduced-motion settings—can explore our AI tool directory, read comparisons, and use our free productivity utilities.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Keyboard Navigation</span>
              </h3>
              <p className="text-xs text-slate-300">
                All interactive controls—including category filters, comparison selectors, utility inputs, and modals—are reachable via standard Tab/Shift+Tab navigation with visible focus outlines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Responsive Design</span>
              </h3>
              <p className="text-xs text-slate-300">
                Layouts adapt fluidly from mobile screens to 1440px+ desktop monitors without horizontal overflow, and comparison tables scroll cleanly on narrow viewports.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Text Alternatives & Semantic DOM</span>
              </h3>
              <p className="text-xs text-slate-300">
                All decorative 3D canvases and SVG graphics are marked <code className="text-sky-300">aria-hidden="true"</code> so they never clutter screen readers, while every heading, button, and form field uses semantic HTML labels.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Color Contrast & Reduced Motion</span>
              </h3>
              <p className="text-xs text-slate-300">
                Typography uses high-contrast light slate on deep obsidian surfaces. When <code className="text-sky-300">prefers-reduced-motion: reduce</code> is enabled—or when Static Mode is toggled in the header—all continuous 3D animations and parallax are disabled.
              </p>
            </div>
          </section>

          <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h2 className="font-display text-lg font-bold text-white">
              How to Report Accessibility Problems
            </h2>
            <p className="text-sm">
              If you encounter an accessibility barrier on any page or utility, please contact us at{' '}
              <code className="text-sky-300 font-mono">
                {SITE_CONFIG.ACCESSIBILITY_EMAIL_PLACEHOLDER}
              </code>{' '}
              (placeholder until configured) or submit a report via our{' '}
              <a
                href="/report-error"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/report-error');
                }}
                className="text-sky-300 underline hover:text-sky-200"
              >
                Report an Error page
              </a>
              .
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
