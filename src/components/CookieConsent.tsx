import React, { useEffect, useState } from 'react';
import { Cookie, Settings2, ShieldCheck, X } from 'lucide-react';

export interface CookiePreferences {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  advertising: boolean;
  decidedAt: string | null;
}

const STORAGE_KEY = 'ai_toolkit_hub_cookie_consent_v1';

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  preferences: true,
  analytics: false,
  advertising: false,
  decidedAt: null,
};

interface CookieConsentProps {
  isOpenSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
  onNavigate: (path: string) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  isOpenSettings,
  onCloseSettings,
  onOpenSettings,
  onNavigate,
}) => {
  const [prefs, setPrefs] = useState<CookiePreferences>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          necessary: true,
          preferences: Boolean(parsed.preferences),
          analytics: Boolean(parsed.analytics),
          advertising: Boolean(parsed.advertising),
          decidedAt: parsed.decidedAt || null,
        };
      }
    } catch {
      // Fallback to default if storage is unavailable
    }
    return DEFAULT_PREFERENCES;
  });

  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    if (!prefs.decidedAt) {
      setShowBanner(true);
    }
  }, [prefs.decidedAt]);

  const saveConsent = (next: Omit<CookiePreferences, 'necessary' | 'decidedAt'>) => {
    const updated: CookiePreferences = {
      necessary: true,
      preferences: next.preferences,
      analytics: next.analytics,
      advertising: next.advertising,
      decidedAt: new Date().toISOString(),
    };
    setPrefs(updated);
    setShowBanner(false);
    onCloseSettings();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      preferences: true,
      analytics: true,
      advertising: true,
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      preferences: false,
      analytics: false,
      advertising: false,
    });
  };

  return (
    <>
      {/* Non-blocking bottom consent banner with equal-prominence Accept and Reject buttons */}
      {showBanner && !isOpenSettings && (
        <aside
          aria-label="Cookie Consent Notice"
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none"
        >
          <div className="max-w-[1160px] mx-auto rounded-2xl bg-slate-950/95 backdrop-blur-md border border-slate-700/90 p-4 sm:p-5 shadow-2xl pointer-events-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <Cookie className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Cookie & Privacy Preferences</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We use essential browser storage to remember your consent choice and accessibility settings. If optional analytics or advertising services (such as Google AdSense) are enabled in the future, they will only activate if you consent. Read our{' '}
                <a
                  href="/cookie-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/cookie-policy');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Cookie Policy
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy-policy');
                  }}
                  className="text-sky-300 underline hover:text-sky-200"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Equal visual hierarchy for Reject and Accept — no deceptive dark patterns */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                <Settings2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Cookie Settings</span>
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-300"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Granular Cookie Preferences Modal */}
      {isOpenSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onClick={onCloseSettings}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2
                  id="cookie-settings-title"
                  className="font-display text-xl font-bold text-white flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <span>Granular Cookie & Storage Settings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Control how AI Toolkit Hub stores preferences and whether optional future analytics or advertising cookies may be used.
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseSettings}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                aria-label="Close cookie settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Necessary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">1. Necessary Storage (Always Active)</div>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Required for core site operation, such as storing your cookie consent decision in local storage so we do not prompt you on every page view.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-sky-300 shrink-0 mt-0.5">
                  Required
                </span>
              </div>

              {/* Preferences */}
              <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">2. Preference Storage</div>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Remembers interface settings such as Static / Reduced-Motion mode and comparison selections.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.preferences}
                  onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-sky-400"
                />
              </label>

              {/* Analytics */}
              <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">3. Analytics Cookies (If Configured)</div>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Currently not installed. If analytics tools are configured in the future, enabling this allows anonymous traffic measurement.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-sky-400"
                />
              </label>

              {/* Advertising */}
              <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">4. Advertising Cookies (If Enabled)</div>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    If advertising providers such as Google AdSense are enabled in the future, this controls whether they may use cookies to measure ads or personalize ad delivery.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.advertising}
                  onChange={(e) => setPrefs((p) => ({ ...p, advertising: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-sky-400"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                >
                  Reject All Non-Essential
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                >
                  Accept All
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    preferences: prefs.preferences,
                    analytics: prefs.analytics,
                    advertising: prefs.advertising,
                  })
                }
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
