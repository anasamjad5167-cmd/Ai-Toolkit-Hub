import React, { useState } from 'react';
import { AlertCircle, Bug, Check, Copy, Info, Mail, PlusCircle } from 'lucide-react';
import { getCanonicalUrl, SITE_CONFIG } from '../config/siteConfig';
import { CATEGORIES } from '../data/aiToolsData';

export type FormPageRoute = '/contact' | '/report-error' | '/suggest-tool';

interface InteractiveFormsPagesProps {
  route: FormPageRoute;
  onNavigate: (path: string) => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const InteractiveFormsPages: React.FC<InteractiveFormsPagesProps> = ({ route }) => {
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // 1. CONTACT FORM STATE (/contact)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactSubmittedPayload, setContactSubmittedPayload] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!contactName.trim()) errs.name = 'Please enter your name.';
    if (!isValidEmail(contactEmail)) errs.email = 'Please enter a valid email address.';
    if (!contactSubject.trim()) errs.subject = 'Please enter a subject line.';
    if (contactMessage.trim().length < 10) {
      errs.message = 'Please enter a message of at least 10 characters.';
    }
    setContactErrors(errs);
    if (Object.keys(errs).length === 0) {
      const payload = [
        `To: ${SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}`,
        `From: ${contactName.trim()} <${contactEmail.trim()}>`,
        `Subject: ${contactSubject.trim()}`,
        ``,
        contactMessage.trim(),
      ].join('\n');
      setContactSubmittedPayload(payload);
    }
  };

  // 2. REPORT AN ERROR FORM STATE (/report-error)
  const [reportName, setReportName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportUrl, setReportUrl] = useState(() => getCanonicalUrl('/ai-tools'));
  const [reportType, setReportType] = useState('Incorrect tool information');
  const [reportDesc, setReportDesc] = useState('');
  const [reportErrors, setReportErrors] = useState<Record<string, string>>({});
  const [reportSubmittedPayload, setReportSubmittedPayload] = useState<string | null>(null);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!reportName.trim()) errs.name = 'Please enter your name.';
    if (!isValidEmail(reportEmail)) errs.email = 'Please enter a valid email address.';
    if (!reportUrl.trim()) errs.url = 'Please specify the page URL or path.';
    if (reportDesc.trim().length < 10) {
      errs.desc = 'Please describe the issue in at least 10 characters.';
    }
    setReportErrors(errs);
    if (Object.keys(errs).length === 0) {
      const payload = [
        `Error Report for ${SITE_CONFIG.siteName}`,
        `Reporter: ${reportName.trim()} <${reportEmail.trim()}>`,
        `Page URL: ${reportUrl.trim()}`,
        `Problem Type: ${reportType}`,
        `Description:`,
        reportDesc.trim(),
      ].join('\n');
      setReportSubmittedPayload(payload);
    }
  };

  // 3. SUGGEST A TOOL FORM STATE (/suggest-tool)
  const [toolName, setToolName] = useState('');
  const [toolWebsite, setToolWebsite] = useState('');
  const [toolCategory, setToolCategory] = useState<string>(CATEGORIES[0].name);
  const [toolDesc, setToolDesc] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [suggestErrors, setSuggestErrors] = useState<Record<string, string>>({});
  const [suggestSubmittedPayload, setSuggestSubmittedPayload] = useState<string | null>(null);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!toolName.trim()) errs.toolName = 'Please enter the AI tool name.';
    if (!isValidUrl(toolWebsite)) {
      errs.toolWebsite = 'Please enter a valid official URL starting with https:// or http://';
    }
    if (toolDesc.trim().length < 15) {
      errs.toolDesc = 'Please provide a factual description (at least 15 characters).';
    }
    if (!isValidEmail(submitterEmail)) {
      errs.submitterEmail = 'Please enter a valid submitter email address.';
    }
    setSuggestErrors(errs);
    if (Object.keys(errs).length === 0) {
      const payload = [
        `Tool Suggestion for ${SITE_CONFIG.siteName}`,
        `Tool Name: ${toolName.trim()}`,
        `Official Website: ${toolWebsite.trim()}`,
        `Category: ${toolCategory}`,
        `Submitter Email: ${submitterEmail.trim()}`,
        `Description: ${toolDesc.trim()}`,
        `Additional Information: ${additionalInfo.trim() || 'None provided'}`,
      ].join('\n');
      setSuggestSubmittedPayload(payload);
    }
  };

  const copyPayload = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 1800);
  };

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* 1. CONTACT PAGE (/contact) */}
      {route === '/contact' && (
        <section className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <Mail className="w-4 h-4" />
              <span>Contact & Inquiries</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Contact AI Toolkit Hub
            </h1>
            <p className="text-sm text-slate-300">
              Have a question about our AI tool directory, free productivity utilities, or editorial policies? Reach out below.
            </p>
          </header>

          {/* Visible Email Placeholder as Required */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400">Direct Contact Email Placeholder:</div>
              <div className="font-mono text-sm sm:text-base font-bold text-sky-300 mt-0.5">
                {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
              </div>
            </div>
            <span className="text-xs text-slate-400">
              Configure in <code className="text-slate-300">src/config/siteConfig.ts</code>
            </span>
          </div>

          <form onSubmit={handleContactSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {contactErrors.name && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{contactErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {contactErrors.email && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{contactErrors.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                Subject *
              </label>
              <input
                id="contact-subject"
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="General inquiry, feedback, or partnership question"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
              />
              {contactErrors.subject && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{contactErrors.subject}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300 mb-1.5">
                Message *
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Write your message..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
              />
              {contactErrors.message && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{contactErrors.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors cursor-pointer"
            >
              Validate & Prepare Message
            </button>
          </form>

          {/* Honest Backend Configuration Notice (Never falsely claims email was sent) */}
          {contactSubmittedPayload && (
            <div
              role="status"
              className="p-5 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-3 text-xs text-slate-200"
            >
              <div className="flex items-start gap-2.5 text-amber-200 font-semibold text-sm">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Form Validated — Backend Email Service Required for Automatic Delivery
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                Your form fields passed validation. However, no backend email delivery service is currently configured on this static deployment, so <strong className="text-white">your message has not been automatically transmitted</strong>. You can copy your formatted message below and email it directly to{' '}
                <code className="text-sky-300 font-mono">
                  {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
                </code>{' '}
                once configured.
              </p>
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                {contactSubmittedPayload}
              </pre>
              <button
                type="button"
                onClick={() => copyPayload(contactSubmittedPayload)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied to Clipboard' : 'Copy Formatted Message'}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. REPORT AN ERROR PAGE (/report-error) */}
      {route === '/report-error' && (
        <section className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <Bug className="w-4 h-4" />
              <span>Accuracy & Maintenance · Report an Error</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Report an Error or Outdated Listing
            </h1>
            <p className="text-sm text-slate-300">
              Help us keep AI Toolkit Hub accurate by reporting incorrect tool information, broken links, pricing changes, or technical bugs.
            </p>
          </header>

          <form onSubmit={handleReportSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="report-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Name *
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {reportErrors.name && (
                  <p className="text-xs text-rose-400 mt-1">{reportErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="report-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email *
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {reportErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{reportErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="report-url" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Page URL *
                </label>
                <input
                  id="report-url"
                  type="text"
                  value={reportUrl}
                  onChange={(e) => setReportUrl(e.target.value)}
                  placeholder="https://aitoolkithub.example.com/ai-tools"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {reportErrors.url && (
                  <p className="text-xs text-rose-400 mt-1">{reportErrors.url}</p>
                )}
              </div>

              <div>
                <label htmlFor="report-type" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Problem Type *
                </label>
                <select
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                >
                  <option value="Incorrect tool information">Incorrect tool information</option>
                  <option value="Broken links">Broken links</option>
                  <option value="Incorrect pricing">Incorrect pricing</option>
                  <option value="Missing information">Missing information</option>
                  <option value="Technical problems">Technical problems</option>
                  <option value="Content errors">Content errors</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="report-desc" className="block text-xs font-medium text-slate-300 mb-1.5">
                Description *
              </label>
              <textarea
                id="report-desc"
                rows={4}
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Describe what needs to be corrected and include the official source link if applicable..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
              />
              {reportErrors.desc && (
                <p className="text-xs text-rose-400 mt-1">{reportErrors.desc}</p>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors cursor-pointer"
            >
              Validate Error Report
            </button>
          </form>

          {reportSubmittedPayload && (
            <div
              role="status"
              className="p-5 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-3 text-xs text-slate-200"
            >
              <div className="flex items-start gap-2.5 text-amber-200 font-semibold text-sm">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Error Report Validated — Backend Delivery Service Not Yet Configured
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                Because no backend form-submission endpoint is connected on this environment, <strong className="text-white">this report has not been sent automatically</strong>. Copy the formatted report below to send via email once{' '}
                <code className="text-sky-300 font-mono">
                  {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
                </code>{' '}
                is configured.
              </p>
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                {reportSubmittedPayload}
              </pre>
              <button
                type="button"
                onClick={() => copyPayload(reportSubmittedPayload)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied Report' : 'Copy Error Report'}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* 3. SUGGEST A TOOL PAGE (/suggest-tool) */}
      {route === '/suggest-tool' && (
        <section className="rounded-2xl bg-slate-950/95 border border-slate-800/90 p-6 sm:p-10 space-y-7">
          <header className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <PlusCircle className="w-4 h-4" />
              <span>Directory Submissions · Suggest a Tool</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Suggest an AI Tool
            </h1>
            <p className="text-sm text-slate-300">
              Recommend an AI software product or utility for editorial review.{' '}
              <strong className="text-white">
                Please note that submitting a tool does not guarantee inclusion in the AI Toolkit Hub directory.
              </strong>
            </p>
          </header>

          <form onSubmit={handleSuggestSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="suggest-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tool Name *
                </label>
                <input
                  id="suggest-name"
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., Example AI Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {suggestErrors.toolName && (
                  <p className="text-xs text-rose-400 mt-1">{suggestErrors.toolName}</p>
                )}
              </div>

              <div>
                <label htmlFor="suggest-url" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Official Website *
                </label>
                <input
                  id="suggest-url"
                  type="url"
                  value={toolWebsite}
                  onChange={(e) => setToolWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {suggestErrors.toolWebsite && (
                  <p className="text-xs text-rose-400 mt-1">{suggestErrors.toolWebsite}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="suggest-category" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  id="suggest-category"
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="suggest-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Submitter Email *
                </label>
                <input
                  id="suggest-email"
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
                />
                {suggestErrors.submitterEmail && (
                  <p className="text-xs text-rose-400 mt-1">{suggestErrors.submitterEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="suggest-desc" className="block text-xs font-medium text-slate-300 mb-1.5">
                Description *
              </label>
              <textarea
                id="suggest-desc"
                rows={4}
                value={toolDesc}
                onChange={(e) => setToolDesc(e.target.value)}
                placeholder="Explain what the tool does, who it is built for, and whether a free plan is available..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
              />
              {suggestErrors.toolDesc && (
                <p className="text-xs text-rose-400 mt-1">{suggestErrors.toolDesc}</p>
              )}
            </div>

            <div>
              <label htmlFor="suggest-additional" className="block text-xs font-medium text-slate-300 mb-1.5">
                Additional Information (Optional)
              </label>
              <textarea
                id="suggest-additional"
                rows={2}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Supported platforms, documentation URL, or pricing notes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-sky-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors cursor-pointer"
            >
              Validate Tool Suggestion
            </button>
          </form>

          {suggestSubmittedPayload && (
            <div
              role="status"
              className="p-5 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-3 text-xs text-slate-200"
            >
              <div className="flex items-start gap-2.5 text-amber-200 font-semibold text-sm">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Suggestion Validated — Backend Submission Service Required for Automatic Delivery
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                Your tool suggestion passed validation. Because no backend database or email service is currently connected, <strong className="text-white">this submission has not been automatically delivered</strong>. Copy the formatted summary below to send to{' '}
                <code className="text-sky-300 font-mono">
                  {SITE_CONFIG.CONTACT_EMAIL_PLACEHOLDER}
                </code>{' '}
                once configured. Remember that submission does not guarantee directory inclusion.
              </p>
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                {suggestSubmittedPayload}
              </pre>
              <button
                type="button"
                onClick={() => copyPayload(suggestSubmittedPayload)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied Suggestion' : 'Copy Tool Suggestion'}</span>
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
