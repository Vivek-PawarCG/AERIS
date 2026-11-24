import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IAQ_INTERVENTIONS } from '../data/iaqInterventions';
import { calculateCorsiRosenthalCADR } from '../utils/calculators';
import { CorsiRosenthalConfig } from '../types';

export const IAQLab: React.FC = () => {
  const { household, adoptedHackIds, toggleAdoptHack } = useApp();

  const [roomPreset, setRoomPreset] = useState<'small' | 'medium' | 'large'>('medium');
  const [shroudApplied, setShroudApplied] = useState(true);

  const roomAreaMap = {
    small: 160,   // Kids/Nursery Room
    medium: 280,  // Master Bedroom
    large: 450,   // Living & Dining Hall
  };

  const crConfig: CorsiRosenthalConfig = {
    fanType: '20-Inch Box Fan (Standard)',
    fanNominalCFM: 1400,
    filterCount: 4,
    filterMERV: 13,
    shroudApplied,
    roomAreaSqFt: roomAreaMap[roomPreset],
    ceilingHeightFt: household.ceilingHeightFt || 9,
  };

  const crMetrics = calculateCorsiRosenthalCADR(crConfig);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredHacks = activeCategory === 'All' 
    ? IAQ_INTERVENTIONS 
    : IAQ_INTERVENTIONS.filter((h) => h.category === activeCategory);

  const categories = [
    { id: 'All', label: 'All Hacks' },
    { id: 'Filtration', label: 'Air Filters' },
    { id: 'Sealing', label: 'Door Seals' },
    { id: 'Kitchen', label: 'Kitchen' },
    { id: 'Cleaning', label: 'Cleaning' },
    { id: 'Ventilation', label: 'Airing Out' },
  ];

  const minutesPerClean = Math.max(8, Math.round(60 / crMetrics.ach));

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <section 
        className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-3"
        aria-labelledby="iaq-simple-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-aeris-accent uppercase tracking-wider block mb-1">
              Easy Home Clean Air Hacks
            </span>
            <h1 id="iaq-simple-title" className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight">
              Keep Indoor Air Pure & Safe
            </h1>
            <p className="text-xs text-aeris-muted mt-1 leading-relaxed max-w-xl">
              Simple, affordable DIY tricks to stop smog from getting inside and clean rooms quickly without buying expensive purifiers.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium text-xs shrink-0">
            {adoptedHackIds.length} / {IAQ_INTERVENTIONS.length} Protocols Active
          </div>
        </div>
      </section>

      {/* 1. DIY Box Fan Clean Air Builder (Responsive Layout) */}
      <section 
        className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 space-y-4"
        aria-labelledby="diy-filter-title"
      >
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-aeris-border">
          <div>
            <div className="flex items-center gap-1.5 text-aeris-accent font-semibold text-xs mb-0.5">
              <Wrench className="w-4 h-4" />
              <span>DIY Filter Box Sizer</span>
            </div>
            <h2 id="diy-filter-title" className="text-base font-bold text-aeris-heading">
              Build a $60 Super Clean Air Box
            </h2>
            <p className="text-[11px] text-aeris-muted">
              Scientifically proven to clean large rooms faster than $500 commercial HEPA purifiers.
            </p>
          </div>
        </div>

        {/* Desktop Split: Controls on Left, Results on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3.5">
            <div>
              <label className="block text-aeris-heading font-medium text-[11px] mb-2">
                Which room do you want to clean? (1-tap selection)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setRoomPreset('small')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    roomPreset === 'small'
                      ? 'bg-aeris-accent/15 border-aeris-accent text-aeris-heading font-semibold'
                      : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                  }`}
                >
                  <div className="text-xs">Nursery / Bedroom</div>
                  <div className="text-[10px] text-aeris-subtle font-mono mt-0.5">~160 sq ft</div>
                </button>

                <button
                  onClick={() => setRoomPreset('medium')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    roomPreset === 'medium'
                      ? 'bg-aeris-accent/15 border-aeris-accent text-aeris-heading font-semibold'
                      : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                  }`}
                >
                  <div className="text-xs">Master Bedroom</div>
                  <div className="text-[10px] text-aeris-subtle font-mono mt-0.5">~280 sq ft</div>
                </button>

                <button
                  onClick={() => setRoomPreset('large')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    roomPreset === 'large'
                      ? 'bg-aeris-accent/15 border-aeris-accent text-aeris-heading font-semibold'
                      : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                  }`}
                >
                  <div className="text-xs">Living & Dining Hall</div>
                  <div className="text-[10px] text-aeris-subtle font-mono mt-0.5">~450 sq ft</div>
                </button>
              </div>
            </div>

            {/* Shroud Booster */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-aeris-bg border border-aeris-border cursor-pointer hover:border-aeris-border-subtle">
              <input
                type="checkbox"
                checked={shroudApplied}
                onChange={(e) => setShroudApplied(e.target.checked)}
                className="rounded bg-aeris-surface border-aeris-border text-aeris-accent focus:ring-aeris-accent"
              />
              <span className="text-[11px] text-aeris-body">
                Include Cardboard Booster Ring (adds 40% cleaning speed for free)
              </span>
            </label>
          </div>

          {/* Right Column: Output Metrics */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-aeris-surface-raised border border-aeris-border space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border">
                <div className="text-[10px] text-aeris-muted">Cleans All Room Air Every</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {minutesPerClean} <span className="text-xs font-normal text-aeris-muted">minutes</span>
                </div>
                <div className="text-[10px] text-aeris-subtle font-mono">{crMetrics.ach} air changes / hr</div>
              </div>

              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border">
                <div className="text-[10px] text-aeris-muted">Air Flow Speed</div>
                <div className="text-xl font-bold font-mono text-aeris-accent mt-0.5">
                  {crMetrics.cadrCFM} <span className="text-xs font-normal text-aeris-muted">CFM</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">Hospital-Grade Clean</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-aeris-heading pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Family Safe:</strong> Surpasses hospital air targets (4–6 ACH) to protect infants & asthmatics.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catalog of Practical Home Hacks (2-column grid on desktop) */}
      <section className="space-y-4" aria-labelledby="hacks-list-title">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 id="hacks-list-title" className="text-sm font-semibold text-aeris-heading">
            Simple Home Hacks
          </h2>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aeris-accent ${
                  activeCategory === cat.id
                    ? 'bg-aeris-accent text-aeris-bg'
                    : 'bg-aeris-surface border border-aeris-border text-aeris-muted hover:text-aeris-heading'
                }`}
                role="tab"
                aria-selected={activeCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hack Cards in 2 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHacks.map((hack) => {
            const isAdopted = adoptedHackIds.includes(hack.id);

            return (
              <article 
                key={hack.id}
                className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 text-xs flex flex-col justify-between space-y-3.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-aeris-accent bg-aeris-accent/10 border border-aeris-accent/20">
                          {hack.costTier}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                          −{hack.pm25ReductionPercent}% Smog
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-aeris-heading">
                        {hack.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleAdoptHack(hack.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent shrink-0 ${
                        isAdopted
                          ? 'bg-emerald-500 text-aeris-bg font-semibold shadow'
                          : 'bg-aeris-surface-raised text-aeris-body border border-aeris-border hover:text-aeris-heading'
                      }`}
                      aria-pressed={isAdopted}
                    >
                      <Check className={`w-3.5 h-3.5 ${isAdopted ? 'text-aeris-bg' : 'text-aeris-muted'}`} />
                      <span>{isAdopted ? 'Using This' : 'Add to Home'}</span>
                    </button>
                  </div>

                  <p className="text-aeris-body text-xs leading-relaxed mb-3">
                    {hack.summary}
                  </p>

                  {/* Steps */}
                  <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 space-y-1 text-[11px]">
                    <div className="font-semibold text-aeris-heading">How to do it:</div>
                    <ol className="list-decimal list-inside space-y-1 text-aeris-muted">
                      {hack.protocolSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
