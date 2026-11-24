import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Info } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveKey('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="w-full max-w-lg rounded bg-aeris-surface border border-aeris-border shadow-2xl p-6 text-aeris-body">
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
          <div className="p-3 rounded bg-aeris-surface-raised border border-aeris-border-subtle flex gap-2.5">
            <Info className="w-4 h-4 text-aeris-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-aeris-heading font-medium">Zero-Key Fallback Included</p>
              <p className="text-aeris-muted leading-relaxed">
                AERIS includes an autonomous, deterministic scientific reasoning engine. It works completely out-of-the-box without requiring an API key.
                Providing a personal Gemini API Key enables dynamic multi-turn conversational answers directly from Google's Gemini 2.5 Flash models.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label htmlFor="gemini-key-input" className="block text-aeris-heading font-medium mb-1.5">
                Gemini API Key
              </label>
              <input
                id="gemini-key-input"
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded bg-aeris-bg border border-aeris-border text-aeris-heading font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent placeholder:text-aeris-subtle"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-aeris-accent hover:underline text-[11px]"
              >
                <span>Get a free Gemini API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                {inputVal && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded text-xs text-rose-300 hover:bg-rose-950/40 border border-transparent transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded text-xs font-medium text-aeris-bg bg-aeris-accent hover:bg-aeris-accent-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {savedSuccess ? 'Saved!' : 'Save Key'}
                </button>
              </div>
            </div>
          </form>

          <div className="pt-3 border-t border-aeris-border-subtle flex items-center gap-2 text-[11px] text-aeris-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Your key is saved strictly in your local browser session (<code className="font-mono text-[10px]">sessionStorage</code>) and is never transmitted to any third-party server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
