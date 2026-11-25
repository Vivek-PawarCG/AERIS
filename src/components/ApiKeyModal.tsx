import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Info, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { testGeminiApiKey, sanitizeApiKey } from '../services/aiAssistant';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputVal, setInputVal] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const clean = sanitizeApiKey(inputVal);
    if (!clean) {
      setTestResult({ success: false, message: 'Please enter a key to test.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testGeminiApiKey(clean);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: `Verified! Successfully connected to Google Gemini (${res.model || 'gemini-3.5-flash-lite'}).`,
      });
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Connection failed. Please inspect your key.',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeApiKey(inputVal);
    onSaveKey(clean);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveKey('');
    setTestResult(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-aeris-surface border border-aeris-border shadow-2xl p-6 text-aeris-body">
        <div className="flex items-center justify-between pb-4 border-b border-aeris-border mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-aeris-accent" />
            <h2 id="api-modal-title" className="text-base font-semibold text-aeris-heading">
              Google Gemini API Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-aeris-muted hover:text-aeris-heading hover:bg-aeris-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-aeris-surface-raised border border-aeris-border-subtle flex gap-2.5">
            <Info className="w-4 h-4 text-aeris-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-aeris-heading font-medium">Supports All Gemini Key Formats</p>
              <p className="text-aeris-muted leading-relaxed">
                AERIS natively supports Google AI Studio's newest authorization keys (starting with <code className="font-mono text-aeris-heading">AQ.</code>) as well as legacy <code className="font-mono text-aeris-heading">AIzaSy...</code> keys.
                Without a key, AERIS automatically runs the autonomous offline aerosol expert system.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="gemini-key-input" className="block text-aeris-heading font-medium">
                  Gemini API / Auth Key
                </label>
                <span className="text-[10px] text-aeris-muted">e.g. AQ.Ab8R... or AIzaSy...</span>
              </div>
              <input
                id="gemini-key-input"
                type="password"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AQ.Ab8R... or AIzaSy..."
                className="w-full px-3 py-2 rounded-xl bg-aeris-bg border border-aeris-border text-aeris-heading font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent placeholder:text-aeris-subtle"
              />
            </div>

            {/* Test Status Banner */}
            {testResult && (
              <div
                className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] ${testResult.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div className="leading-relaxed">{testResult.message}</div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-aeris-accent hover:underline text-[11px]"
              >
                <span>Get a Gemini key (AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                {inputVal && (
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-aeris-surface-raised hover:bg-aeris-surface border border-aeris-border text-aeris-heading transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isTesting && <Loader2 className="w-3 h-3 animate-spin text-aeris-accent" />}
                    <span>{isTesting ? 'Testing...' : 'Test Key'}</span>
                  </button>
                )}

                {inputVal && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded-xl text-xs text-rose-300 hover:bg-rose-950/40 border border-transparent transition-colors"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-aeris-bg bg-aeris-accent hover:bg-aeris-accent-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {savedSuccess ? 'Saved!' : 'Save Key'}
                </button>
              </div>
            </div>
          </form>

          <div className="pt-3 border-t border-aeris-border-subtle flex items-center gap-2 text-[11px] text-aeris-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Your key is saved strictly in your local browser session (<code className="font-mono text-[10px]">sessionStorage</code>) and is sent directly and only to Google's HTTPS API.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
