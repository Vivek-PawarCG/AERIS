import React from 'react';
import { 
  Check, 
  Clock, 
  Leaf, 
  Activity, 
  Zap,
  Info,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyRoutineOptimizer: React.FC = () => {
  const { 
    routineBlocks, 
    adoptedRoutineIds, 
    toggleAdoptRoutine, 
    atmospheric 
  } = useApp();

  const allAdopted = routineBlocks.length > 0 && adoptedRoutineIds.length === routineBlocks.length;

  const handleAdoptAll = () => {
    routineBlocks.forEach((block) => {
      if (!adoptedRoutineIds.includes(block.id)) {
        toggleAdoptRoutine(block.id);
      }
    });
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Header Banner with 1-Click "Adopt All" */}
      <section 
        className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-3"
        aria-labelledby="daily-plan-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-medium text-aeris-accent uppercase tracking-wider block mb-1">
              Family Daily Exposure Plan
            </span>
            <h1 id="daily-plan-title" className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight">
              Today&apos;s Clean Air Schedule
            </h1>
            <p className="text-xs text-aeris-muted mt-1 leading-relaxed max-w-xl">
              Everyday routine adjustments calibrated to {atmospheric.cityName}&apos;s winter smog dynamics to keep dirty air out of family lungs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleAdoptAll}
              disabled={allAdopted}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent active:scale-95 shadow ${
                allAdopted
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 cursor-default'
                  : 'bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>{allAdopted ? 'All Schedule Adopted' : '1-Click Adopt Full Plan'}</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-aeris-bg border border-aeris-border-subtle flex items-start gap-2.5">
          <Info className="w-4 h-4 text-aeris-accent shrink-0 mt-0.5" />
          <p className="text-aeris-body text-xs leading-relaxed">
            By shifting high-breathing activities (exercise, school commute, cooking) away from morning and evening cold-air traps, your family avoids up to <strong>70%</strong> of toxic particulate inhalation today.
          </p>
        </div>
      </section>

      {/* Routine Cards Grid (Single-column on mobile, 2-column on desktop for optimal space usage) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routineBlocks.map((block) => {
          const isAdopted = adoptedRoutineIds.includes(block.id);

          return (
            <article 
              key={block.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-3.5 ${
                isAdopted 
                  ? 'bg-aeris-surface border-aeris-border shadow-sm' 
                  : 'bg-aeris-surface/60 border-aeris-border-subtle opacity-90'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        block.isCriticalWindow 
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' 
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      }`}>
                        <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
                        {block.timeWindow}
                      </span>
                      {block.isCriticalWindow ? (
                        <span className="text-[10px] text-rose-400 font-medium">Worst Smog Trap</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium">Cleaner Window</span>
                      )}
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-aeris-heading">
                      {block.periodName}
                    </h2>
                  </div>

                  <button
                    onClick={() => toggleAdoptRoutine(block.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent shrink-0 ${
                      isAdopted
                        ? 'bg-emerald-500 text-aeris-bg font-semibold shadow'
                        : 'bg-aeris-surface-raised text-aeris-body border border-aeris-border hover:text-aeris-heading'
                    }`}
                    aria-pressed={isAdopted}
                  >
                    <Check className={`w-3.5 h-3.5 ${isAdopted ? 'text-aeris-bg' : 'text-aeris-muted'}`} />
                    <span>{isAdopted ? 'Done' : 'I\'ll do this'}</span>
                  </button>
                </div>

                {/* Action Protocols */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-aeris-heading text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-aeris-accent" />
                      <span>Action Recommendation:</span>
                    </div>
                    <p className="text-aeris-body leading-relaxed text-xs">
                      {block.recommendedAction}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-aeris-bg/60 border border-aeris-border/40">
                      <span className="text-emerald-400 font-medium block mb-0.5 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Cleaner alternative:
                      </span>
                      <span className="text-aeris-muted">{block.sustainableAlternative}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-aeris-bg/60 border border-aeris-border/40">
                      <span className="text-amber-400 font-medium block mb-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Home hack:
                      </span>
                      <span className="text-aeris-muted">{block.indoorProtectionHack}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit Footer */}
              <div className="pt-2.5 border-t border-aeris-border-subtle flex items-center justify-between text-[11px] text-aeris-muted">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Keeps −{block.avoidedDoseUg} µg of dirty smoke out of family lungs
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
