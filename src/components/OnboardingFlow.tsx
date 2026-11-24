import React, { useState } from 'react';
import { 
  Wind, 
  MapPin, 
  Search, 
  Loader2, 
  Check, 
  ArrowRight, 
  Baby, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Navigation,
  Sun
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchLocations, GeocodingResult } from '../services/airQualityApi';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }) => {
  const { updateHousehold, loadLiveLocation, isLoadingLocation } = useApp();

  const [step, setStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setGpsError(null);
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Browser GPS auto-detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please search for your city.');
      return;
    }

    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: GeocodingResult = {
          id: Date.now(),
          name: 'My Current Location',
          country: '',
          latitude,
          longitude,
        };
        setSelectedLocation(loc);
        await loadLiveLocation(latitude, longitude, 'My Location', 'GPS Station');
      },
      () => {
        setGpsError('Unable to retrieve your location. Please type your city in the search box.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectCity = async (loc: GeocodingResult) => {
    setSelectedLocation(loc);
    setSearchResults([]);
    await loadLiveLocation(loc.latitude, loc.longitude, loc.name, loc.country || loc.admin1);
  };

  const applyFamilyPreset = (preset: 'family' | 'seniors' | 'standard') => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-aeris-surface border border-aeris-border shadow-2xl overflow-hidden text-aeris-body">
        {/* Progress Bar Indicator */}
        <div className="h-1.5 w-full bg-aeris-bg">
          <div 
            className="h-full bg-aeris-accent transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* STEP 1: WELCOME & THE WINTER SMOG TRAP */}
          {step === 1 && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-aeris-accent/15 text-aeris-accent flex items-center justify-center mx-auto sm:mx-0">
                <Wind className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-aeris-accent uppercase tracking-wider">
                  Beginner Walkthrough
                </span>
                <h1 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight mt-1">
                  Welcome to AERIS
                </h1>
                <p className="text-xs text-aeris-muted mt-1 leading-relaxed">
                  Your atmospheric companion designed to protect families from dangerous winter smog and cold-air traps.
                </p>
              </div>

              {/* Friendly Educational Callout */}
              <div className="p-4 rounded-2xl bg-aeris-bg border border-aeris-border text-left space-y-2">
                <div className="flex items-center gap-2 font-semibold text-aeris-heading text-xs">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Why Winter Smog is Different</span>
                </div>
                <p className="text-[11px] text-aeris-body leading-relaxed">
                  On cold winter nights, cold ground air gets trapped under a warm air lid — trapping vehicle exhaust, stove smoke, and dust close to the street. AERIS helps you:
                </p>
                <div className="space-y-1.5 text-[11px] text-aeris-muted pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Time your daily schedule to avoid the worst smog hours.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Clean room air fast with simple $60 DIY clean air boxes.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Catch the afternoon sunlight when air naturally clears.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow"
                >
                  <span>Set Up Your Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REAL-WORLD LOCATION SETUP */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-aeris-accent uppercase tracking-wider">
                  Step 2 of 4 • Real-Time Data
                </span>
                <h2 className="text-xl font-bold text-aeris-heading tracking-tight mt-1">
                  Where Does Your Family Live?
                </h2>
                <p className="text-xs text-aeris-muted mt-1 leading-relaxed">
                  AERIS connects directly to real atmospheric stations worldwide. No mock data.
                </p>
              </div>

              {/* GPS Auto-Detect Button */}
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLoadingLocation}
                className="w-full p-3.5 rounded-2xl border border-aeris-accent/40 bg-aeris-accent/10 hover:bg-aeris-accent/20 text-aeris-heading font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin text-aeris-accent" />
                ) : (
                  <Navigation className="w-4 h-4 text-aeris-accent" />
                )}
                <span>{isLoadingLocation ? 'Locating Station...' : 'Auto-Detect My Current Location (GPS)'}</span>
              </button>

              {gpsError && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-[11px]">
                  {gpsError}
                </div>
              )}

              {/* City Search Bar */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-aeris-muted text-center sm:text-left">
                  Or search for any city or town worldwide:
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-aeris-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. New Delhi, Salt Lake City, London, Lahore, Milan..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-aeris-bg border border-aeris-border text-aeris-heading text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-4 py-2.5 rounded-xl bg-aeris-surface-raised border border-aeris-border hover:border-aeris-accent text-aeris-heading font-medium text-xs transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </button>
                </form>

                {/* Search Results Dropdown List */}
                {searchResults.length > 0 && (
                  <div className="p-1 rounded-xl bg-aeris-bg border border-aeris-border divide-y divide-aeris-border/60 max-h-44 overflow-y-auto">
                    {searchResults.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectCity(loc)}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-aeris-surface transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-aeris-heading text-xs">{loc.name}</div>
                          <div className="text-[10px] text-aeris-muted">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                        <MapPin className="w-3.5 h-3.5 text-aeris-accent" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Location Pill */}
                {selectedLocation && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Selected Station: <strong>{selectedLocation.name}</strong></span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Live Data Connected</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-aeris-border-subtle">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-aeris-muted hover:text-aeris-heading text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!selectedLocation && !searchQuery}
                  className="px-6 py-2.5 rounded-xl bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg font-semibold text-xs transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>Next: Family Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FAMILY & HOUSEHOLD PRESETS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-aeris-accent uppercase tracking-wider">
                  Step 3 of 4 • 1-Tap Setup
                </span>
                <h2 className="text-xl font-bold text-aeris-heading tracking-tight mt-1">
                  Who Are We Protecting?
                </h2>
                <p className="text-xs text-aeris-muted mt-1 leading-relaxed">
                  Tap the preset that best fits your household to calibrate your clean air advice.
                </p>
              </div>

              {/* 3 Quick Cards */}
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    applyFamilyPreset('family');
                    setStep(4);
                  }}
                  className="p-3.5 rounded-2xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-left transition-all group active:scale-98 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-aeris-heading text-xs">Young Family with Kids</div>
                      <p className="text-[11px] text-aeris-muted mt-0.5 leading-relaxed">
                        For households with babies, toddlers, or school children. Maximizes indoor bedroom purification and times school commutes.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-aeris-muted group-hover:text-aeris-accent shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyFamilyPreset('seniors');
                    setStep(4);
                  }}
                  className="p-3.5 rounded-2xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-left transition-all group active:scale-98 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-aeris-heading text-xs">Seniors / Asthma & Heart Care</div>
                      <p className="text-[11px] text-aeris-muted mt-0.5 leading-relaxed">
                        For family members over 65, asthma sufferers, or heart patients. Activates priority respiratory alerts and walking advisories.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-aeris-muted group-hover:text-aeris-accent shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyFamilyPreset('standard');
                    setStep(4);
                  }}
                  className="p-3.5 rounded-2xl border border-aeris-border bg-aeris-bg hover:border-aeris-accent text-left transition-all group active:scale-98 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-aeris-heading text-xs">General Household</div>
                      <p className="text-[11px] text-aeris-muted mt-0.5 leading-relaxed">
                        Balanced clean air recommendations for adult households. Optimizes room ventilation and low-emission commuting.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-aeris-muted group-hover:text-aeris-accent shrink-0 ml-2" />
                </button>
              </div>

              <div className="pt-2 flex justify-between border-t border-aeris-border-subtle">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-aeris-muted hover:text-aeris-heading text-xs"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LAUNCH & GUIDED TOUR */}
          {step === 4 && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Setup Complete
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight mt-1">
                  Your Live Clean Air System is Ready
                </h2>
                <p className="text-xs text-aeris-muted mt-1 leading-relaxed">
                  We have connected your live location to Open-Meteo atmospheric sensors and customized your protection plan.
                </p>
              </div>

              {/* 3 Quick Navigation Tips */}
              <div className="p-4 rounded-2xl bg-aeris-bg border border-aeris-border text-left space-y-3">
                <div className="font-semibold text-aeris-heading text-xs">
                  Here is how to use AERIS every day:
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-aeris-accent/15 text-aeris-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-aeris-heading">Air Today:</strong> Check your current smog alert and the afternoon fresh air window before opening windows.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-aeris-accent/15 text-aeris-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-aeris-heading">Daily Plan:</strong> Tap <em>"1-Click Adopt Full Plan"</em> to protect family commutes, cooking, and sleeping.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-aeris-accent/15 text-aeris-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-aeris-heading">Home Hacks & AI:</strong> Build a $60 DIY clean air box and ask the AI Helper any family question.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                >
                  <span>Enter My Live Dashboard</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
