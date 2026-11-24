import React from 'react';
import { 
  Wind, 
  Leaf, 
  Heart, 
  Award, 
  Users 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ImpactDashboard: React.FC = () => {
  const { cumulativeImpact, adoptedRoutineIds, adoptedHackIds } = useApp();

  const equivalentCigarettesAvoided = (
    cumulativeImpact.totalPM25AvoidedMicrograms / 350
  ).toFixed(1);

  return (
    <div className="space-y-6 text-xs">
      {/* Header Overview */}
      <section 
        className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-3"
        aria-labelledby="impact-simple-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-aeris-accent uppercase tracking-wider block mb-1">
              Your Family's Impact
            </span>
            <h1 id="impact-simple-title" className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight">
              Clean Air Breathing Tracker
            </h1>
            <p className="text-xs text-aeris-muted leading-relaxed max-w-xl">
              Every time you run your clean air box, seal drafty doors, or adjust your commute, you keep toxic winter dust out of your family's lungs and reduce neighborhood smoke.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-aeris-bg border border-aeris-border text-aeris-heading font-mono text-xs">
              {adoptedRoutineIds.length + adoptedHackIds.length} Total Protections Active
            </span>
          </div>
        </div>
      </section>

      {/* 4 Friendly Family Counters: 2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-aeris-surface border border-aeris-border space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center mb-1">
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {cumulativeImpact.totalPM25AvoidedMicrograms.toLocaleString()} <span className="text-xs font-normal text-aeris-muted">µg</span>
          </div>
          <div className="font-semibold text-aeris-heading text-xs">Smog Dust Avoided</div>
          <p className="text-[11px] text-aeris-muted leading-tight">
            Kept out of family lungs and deep airways today.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-aeris-surface border border-aeris-border space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-sky-950/60 text-aeris-accent flex items-center justify-center mb-1">
            <Wind className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-aeris-accent">
            {cumulativeImpact.cleanAirBreathedLiters.toLocaleString()} <span className="text-xs font-normal text-aeris-muted">L</span>
          </div>
          <div className="font-semibold text-aeris-heading text-xs">Clean Air Breathed</div>
          <p className="text-[11px] text-aeris-muted leading-tight">
            Liters of filtered air breathed at home and during commute.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-aeris-surface border border-aeris-border space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center mb-1">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {cumulativeImpact.co2PreventedKg} <span className="text-xs font-normal text-aeris-muted">kg</span>
          </div>
          <div className="font-semibold text-aeris-heading text-xs">City Smoke Prevented</div>
          <p className="text-[11px] text-aeris-muted leading-tight">
            Avoided vehicle and gas exhaust in your neighborhood.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-aeris-surface border border-aeris-border space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center mb-1">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
            ~{equivalentCigarettesAvoided} <span className="text-xs font-normal text-aeris-muted">cigs</span>
          </div>
          <div className="font-semibold text-aeris-heading text-xs">Smoke Burden Saved</div>
          <p className="text-[11px] text-aeris-muted leading-tight">
            Toxic smog equivalent prevented from being inhaled.
          </p>
        </div>
      </div>

      {/* Community Multiplier & Neighborhood Impact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section 
          className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-3"
          aria-labelledby="community-power-title"
        >
          <div className="flex items-center gap-2 text-aeris-heading font-semibold text-sm">
            <Users className="w-4 h-4 text-aeris-accent" />
            <h2 id="community-power-title">The Power of Neighborhood Action</h2>
          </div>

          <p className="text-aeris-body text-xs leading-relaxed">
            If 100 families in your apartment building or neighborhood adopt these simple indoor hacks and cleaner commutes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border">
              <span className="text-xs text-aeris-muted block">Smoke Prevented Every Month:</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                ~{(cumulativeImpact.co2PreventedKg * 100 * 30 / 1000).toFixed(1)} Metric Tons
              </span>
            </div>

            <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border">
              <span className="text-xs text-aeris-muted block">Emergency Asthma Visits Prevented:</span>
              <span className="text-base font-bold font-mono text-amber-300">
                ~4 to 6 Hospital Visits
              </span>
            </div>
          </div>
        </section>

        {/* Why Choices Matter Card */}
        <section 
          className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-3"
          aria-labelledby="why-it-matters-title"
        >
          <div className="flex items-center gap-2 text-aeris-heading font-semibold text-sm">
            <Wind className="w-4 h-4 text-emerald-400" />
            <h2 id="why-it-matters-title">How Small Steps Make Huge Impact</h2>
          </div>

          <p className="text-aeris-body text-xs leading-relaxed">
            Unlike outdoor smog over an entire city, indoor air can be cleaned quickly. Because winter keeps families inside for 90% of the day, running a simple $60 DIY filter and sealing door drafts removes nearly all the toxic particulate load your lungs would otherwise absorb.
          </p>

          <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 text-aeris-muted text-[11px] leading-relaxed">
            Every 10 µg/m³ of particulate matter removed from family bedrooms significantly reduces bronchial irritation, night coughing, and systemic cardiovascular inflammation.
          </div>
        </section>
      </div>
    </div>
  );
};
