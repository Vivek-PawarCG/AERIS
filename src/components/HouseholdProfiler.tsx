import React from 'react';
import { X, Users, Check, Sparkles, Baby, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DwellingType, CookingFuel } from '../types';

interface HouseholdProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseholdProfilerModal: React.FC<HouseholdProfilerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { household, updateHousehold } = useApp();

  if (!isOpen) return null;

  // 1-Tap Quick Family Presets (Zero work, maximum customized output)
  const applyPreset = (preset: 'family' | 'seniors' | 'standard') => {
    if (preset === 'family') {
      updateHousehold({
        members: {
          infantsUnderTwo: 1,
          childrenUnderTwelve: 1,
          elderlyOverSixtyFive: 0,
          hasAsthmaOrRespiratory: false,
          hasCardiovascularCondition: false,
          hasPets: true,
        },
        dwellingType: 'HighRiseApartment',
        roomAreaSqFt: 280,
        cookingFuel: 'PipedNaturalGas',
      });
    } else if (preset === 'seniors') {
      updateHousehold({
        members: {
          infantsUnderTwo: 0,
          childrenUnderTwelve: 0,
          elderlyOverSixtyFive: 2,
          hasAsthmaOrRespiratory: true,
          hasCardiovascularCondition: true,
          hasPets: false,
        },
        dwellingType: 'GroundFloorFlat',
        roomAreaSqFt: 320,
        cookingFuel: 'InductionElectric',
      });
    } else {
      updateHousehold({
        members: {
          infantsUnderTwo: 0,
          childrenUnderTwelve: 0,
          elderlyOverSixtyFive: 0,
          hasAsthmaOrRespiratory: false,
          hasCardiovascularCondition: false,
          hasPets: false,
        },
        dwellingType: 'ModernWeathersealedHome',
        roomAreaSqFt: 250,
        cookingFuel: 'InductionElectric',
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiler-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-aeris-surface border border-aeris-border shadow-2xl text-aeris-body overflow-hidden">
        {/* Header - Fixed */}
        <div className="px-5 py-3.5 border-b border-aeris-border flex items-center justify-between shrink-0 bg-aeris-surface">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-aeris-accent/15 text-aeris-accent flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="profiler-title" className="text-sm font-bold text-aeris-heading">
                Household & Family Protection Profile
              </h2>
              <p className="text-[11px] text-aeris-muted">
                1-tap setup to personalize your family's smog protection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-aeris-muted hover:text-aeris-heading hover:bg-aeris-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body - Stays strictly inside screen bounds */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-aeris-muted uppercase tracking-wider block">
              1-Tap Quick Setups
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('family')}
                className="p-2.5 rounded-xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-center transition-all group active:scale-95 text-left"
              >
                <div className="flex items-center gap-1.5 font-medium text-aeris-heading text-xs">
                  <Baby className="w-3.5 h-3.5 text-rose-400" />
                  <span>Young Family</span>
                </div>
                <div className="text-[10px] text-aeris-muted mt-0.5">Kids / Infants</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('seniors')}
                className="p-2.5 rounded-xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-center transition-all group active:scale-95 text-left"
              >
                <div className="flex items-center gap-1.5 font-medium text-aeris-heading text-xs">
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Seniors / Asthma</span>
                </div>
                <div className="text-[10px] text-aeris-muted mt-0.5">Elderly care</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="p-2.5 rounded-xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-center transition-all group active:scale-95 text-left"
              >
                <div className="flex items-center gap-1.5 font-medium text-aeris-heading text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>General Home</span>
                </div>
                <div className="text-[10px] text-aeris-muted mt-0.5">Adults only</div>
              </button>
            </div>
          </div>

          {/* Quick Toggles for Family Members */}
          <div className="space-y-2 pt-2 border-t border-aeris-border-subtle">
            <span className="text-[11px] font-semibold text-aeris-heading block">
              Who is in your home? (Tap to toggle)
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => updateHousehold({
                  members: { 
                    ...household.members, 
                    infantsUnderTwo: household.members.infantsUnderTwo > 0 ? 0 : 1 
                  }
                })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  household.members.infantsUnderTwo > 0
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                    : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">Babies / Toddlers (&lt;2 yrs)</div>
                  <div className="text-[10px] text-aeris-subtle">Needs bedroom filtration</div>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  household.members.infantsUnderTwo > 0 ? 'bg-rose-500 text-white' : 'border border-aeris-border'
                }`}>
                  {household.members.infantsUnderTwo > 0 && '✓'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateHousehold({
                  members: { 
                    ...household.members, 
                    elderlyOverSixtyFive: household.members.elderlyOverSixtyFive > 0 ? 0 : 1 
                  }
                })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  household.members.elderlyOverSixtyFive > 0
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">Seniors / Grandparents</div>
                  <div className="text-[10px] text-aeris-subtle">Heart & lung protection</div>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  household.members.elderlyOverSixtyFive > 0 ? 'bg-amber-500 text-black font-bold' : 'border border-aeris-border'
                }`}>
                  {household.members.elderlyOverSixtyFive > 0 && '✓'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateHousehold({
                  members: { 
                    ...household.members, 
                    hasAsthmaOrRespiratory: !household.members.hasAsthmaOrRespiratory 
                  }
                })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  household.members.hasAsthmaOrRespiratory
                    ? 'bg-orange-950/40 border-orange-800/80 text-orange-200'
                    : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">Asthma or Bronchitis</div>
                  <div className="text-[10px] text-aeris-subtle">Priority alert mode</div>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  household.members.hasAsthmaOrRespiratory ? 'bg-orange-500 text-white font-bold' : 'border border-aeris-border'
                }`}>
                  {household.members.hasAsthmaOrRespiratory && '✓'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateHousehold({
                  members: { 
                    ...household.members, 
                    hasPets: !household.members.hasPets 
                  }
                })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  household.members.hasPets
                    ? 'bg-sky-950/40 border-sky-800/80 text-sky-200'
                    : 'bg-aeris-bg border-aeris-border text-aeris-muted hover:text-aeris-heading'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">Pets (Dogs / Cats)</div>
                  <div className="text-[10px] text-aeris-subtle">Dander + duster resuspension</div>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  household.members.hasPets ? 'bg-sky-500 text-white font-bold' : 'border border-aeris-border'
                }`}>
                  {household.members.hasPets && '✓'}
                </div>
              </button>
            </div>
          </div>

          {/* Quick Home Type & Cooking */}
          <div className="space-y-2 pt-2 border-t border-aeris-border-subtle">
            <span className="text-[11px] font-semibold text-aeris-heading block">
              Home & Kitchen Setup
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="text-[10px] text-aeris-muted block mb-1">Building Type</label>
                <select
                  value={household.dwellingType}
                  onChange={(e) => updateHousehold({ dwellingType: e.target.value as DwellingType })}
                  className="w-full px-2.5 py-2 rounded-xl bg-aeris-bg border border-aeris-border text-aeris-heading text-xs"
                >
                  <option value="HighRiseApartment">Apartment (Mid/Upper floor)</option>
                  <option value="GroundFloorFlat">Ground Floor (Near street dust)</option>
                  <option value="OlderUnsealedHouse">Older House (Leaky gaps)</option>
                  <option value="ModernWeathersealedHome">Modern Sealed Home</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-aeris-muted block mb-1">Cooking Fuel</label>
                <select
                  value={household.cookingFuel}
                  onChange={(e) => updateHousehold({ cookingFuel: e.target.value as CookingFuel })}
                  className="w-full px-2.5 py-2 rounded-xl bg-aeris-bg border border-aeris-border text-aeris-heading text-xs"
                >
                  <option value="PipedNaturalGas">Gas Stove (Piped)</option>
                  <option value="LPG">LPG Cylinder Gas</option>
                  <option value="InductionElectric">Electric / Induction (Clean)</option>
                  <option value="BiomassSolid">Wood / Charcoal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-5 py-3 border-t border-aeris-border flex items-center justify-between shrink-0 bg-aeris-surface-raised/40">
          <span className="text-[10px] text-aeris-muted">Changes save automatically</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-aeris-bg bg-aeris-accent hover:bg-aeris-accent-dim transition-colors flex items-center gap-1.5 active:scale-95 shadow"
          >
            <Check className="w-3.5 h-3.5" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
