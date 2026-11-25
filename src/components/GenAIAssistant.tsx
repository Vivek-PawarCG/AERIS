import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MarkdownRenderer } from './MarkdownRenderer';

export const GenAIAssistant: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    isAiGenerating,
    apiKey
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAiGenerating) return;
    const q = inputVal.trim();
    setInputVal('');
    await sendChatMessage(q);
  };

  const samplePrompts = [
    'Can I take my baby out in a stroller today?',
    'How do I make a cheap air filter with a box fan?',
    'What should someone with asthma do during smog spikes?',
    'How do I air out the house without letting smog inside?',
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Header Card */}
      <section
        className="rounded-2xl bg-aeris-surface border border-aeris-border p-4 sm:p-5 space-y-2"
        aria-labelledby="assistant-simple-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-aeris-accent/15 text-aeris-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 id="assistant-simple-title" className="text-base sm:text-lg font-bold text-aeris-heading">
                AI Clean Air Helper
              </h1>
              <p className="text-[11px] text-aeris-muted">
                Ask any question in plain language about your family, home filters, or smog
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono shrink-0 self-start sm:self-auto ${apiKey
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-aeris-bg text-aeris-accent border border-aeris-border'
            }`}>
            {apiKey ? `Live Gemini AI (${apiKey.startsWith('AQ.') ? 'Auth Key' : 'API Key'})` : 'Offline Scientific Helper'}
          </span>
        </div>
      </section>

      {/* Chat Messages Container - Responsive height */}
      <div className="rounded-2xl bg-aeris-surface border border-aeris-border flex flex-col h-[520px] lg:h-[600px] overflow-hidden">
        {/* Message Stream */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs"
          role="log"
          aria-live="polite"
        >
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-aeris-surface-raised border border-aeris-border flex items-center justify-center text-aeris-accent shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 space-y-2 ${isUser
                    ? 'bg-aeris-accent text-aeris-bg font-medium rounded-tr-none shadow'
                    : 'bg-aeris-bg border border-aeris-border text-aeris-body rounded-tl-none shadow-sm'
                  }`}>
                  <div className="flex items-center justify-between text-[10px] text-aeris-muted pb-1 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-aeris-heading">
                        {isUser ? 'You' : 'Clean Air Helper'}
                      </span>
                      {!isUser && msg.tags?.includes('Live Gemini AI') && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[9px]">
                          Live Gemini
                        </span>
                      )}
                      {!isUser && msg.tags?.includes('API Notice') && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[9px]">
                          API Notice
                        </span>
                      )}
                    </div>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <MarkdownRenderer content={msg.text} isUser={isUser} />

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-aeris-border-subtle text-[10px] text-aeris-muted">
                      <div className="flex items-center gap-1 font-medium text-aeris-heading">
                        <BookOpen className="w-3 h-3 text-aeris-accent" />
                        <span>Trusted Sources:</span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-aeris-subtle">
                        {msg.citations[0]}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-aeris-surface-raised border border-aeris-border flex items-center justify-center text-aeris-heading shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isAiGenerating && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-aeris-surface-raised border border-aeris-border flex items-center justify-center text-aeris-accent shrink-0 mt-0.5">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-aeris-bg border border-aeris-border text-xs text-aeris-muted flex items-center gap-2">
                <span>Checking air safety and calculating recommendations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Tap Question Chips */}
        <div className="p-3 border-t border-aeris-border bg-aeris-surface-raised/40 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-semibold text-aeris-muted shrink-0 uppercase tracking-wider hidden sm:inline">
            Quick Questions:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(prompt);
                sendChatMessage(prompt);
              }}
              className="px-3 py-1 rounded-full bg-aeris-surface border border-aeris-border hover:border-aeris-border-subtle text-aeris-body hover:text-aeris-heading whitespace-nowrap text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aeris-accent shrink-0 active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-aeris-border bg-aeris-surface flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your question..."
            disabled={isAiGenerating}
            className="flex-1 px-4 py-2.5 rounded-full bg-aeris-bg border border-aeris-border text-aeris-heading text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent placeholder:text-aeris-subtle disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isAiGenerating}
            className="px-4 py-2.5 rounded-full bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 shadow"
            aria-label="Send query"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
