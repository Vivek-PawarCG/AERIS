import React, { useState } from 'react';
import { 
  Wind, 
  MapPin, 
  Key, 
  Users, 
  Check,
  CalendarCheck,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  Search,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryBadgeClasses } from '../utils/calculators';
import { GeocodingResult } from '../services/airQualityApi';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApiKeyModal: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  onOpenProfileModal,
}) => {
  const { 
    atmospheric, 
    availableLocations, 
    selectLocation, 
    loadLiveLocation, 
    isLoadingLocation, 
    searchCities, 
    replayTutorial, 
    household, 
    apiKey 
  } = useApp();

  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = async (loc: GeocodingResult) => {
    await loadLiveLocation(loc.latitude, loc.longitude, loc.name, loc.country || loc.admin1);
    setIsLocationMenuOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const hasSensitiveMembers = 
    household.members.infantsUnderTwo > 0 ||
    household.members.elderlyOverSixtyFive > 0 ||
    household.members.hasAsthmaOrRespiratory ||
    household.members.hasCardiovascularCondition;

  const navTabs = [
    { id: 'telemetry', label: 'Air Today', icon: Wind },
    { id: 'routines', label: 'Daily Plan', icon: CalendarCheck },
    { id: 'iaq', label: 'Home Hacks', icon: Sparkles },
    { id: 'impact', label: 'Impact', icon: HeartHandshake },
    { id: 'assistant', label: 'AI Helper', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-aeris-bg/95 border-b border-aeris-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & City Picker */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-aeris-surface-raised border border-aeris-border flex items-center justify-center text-aeris-accent shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <span className="font-bold text-aeris-heading tracking-tight text-sm hidden sm:inline">
              AERIS
            </span>
          </div>

          <div className="relative min-w-0">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-aeris-surface border border-aeris-border hover:border-aeris-border-subtle text-xs text-aeris-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent max-w-[200px] sm:max-w-xs truncate"
              aria-haspopup="listbox"
              aria-expanded={isLocationMenuOpen}
              aria-label="Select City or Region"
            >
              <MapPin className="w-3.5 h-3.5 text-aeris-accent shrink-0" />
              <span className="font-medium truncate">{atmospheric.cityName.split('(')[0].trim()}</span>
              {isLoadingLocation ? (
                <Loader2 className="w-3 h-3 animate-spin text-aeris-accent" />
              ) : (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium shrink-0 ${getCategoryBadgeClasses(atmospheric.category)}`}>
                  AQI {atmospheric.aqi}
                </span>
              )}
            </button>

            {isLocationMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-80 rounded-2xl bg-aeris-surface-overlay border border-aeris-border shadow-2xl py-1 z-50 text-xs"
                role="listbox"
              >
                {/* Live City Search Box */}
                <div className="p-2 border-b border-aeris-border">
                  <form onSubmit={handleSearchSubmit} className="flex gap-1.5">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-aeris-muted" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search any global city..."
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-aeris-bg border border-aeris-border text-aeris-heading text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aeris-accent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-2.5 py-1.5 rounded-lg bg-aeris-surface-raised border border-aeris-border hover:border-aeris-accent text-aeris-heading text-xs shrink-0 disabled:opacity-40"
                    >
                      {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Go'}
                    </button>
                  </form>

                  {searchResults.length > 0 && (
                    <div className="mt-2 rounded-lg bg-aeris-bg border border-aeris-border divide-y divide-aeris-border/60 max-h-36 overflow-y-auto">
                      {searchResults.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className="w-full p-2 text-left hover:bg-aeris-surface-raised text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-aeris-heading">{city.name}</div>
                            <div className="text-[10px] text-aeris-muted">{[city.admin1, city.country].filter(Boolean).join(', ')}</div>
                          </div>
                          <MapPin className="w-3 h-3 text-aeris-accent shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold text-aeris-muted uppercase tracking-wider border-b border-aeris-border">
                  Available Stations
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-aeris-border/40">
                  {availableLocations.map((loc) => (
                    <button
                      key={loc.locationId}
                      onClick={() => {
                        selectLocation(loc.locationId);
                        setIsLocationMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-aeris-surface-raised transition-colors ${
                        loc.locationId === atmospheric.locationId ? 'bg-aeris-surface-raised text-aeris-heading font-medium' : 'text-aeris-body'
                      }`}
                      role="option"
                      aria-selected={loc.locationId === atmospheric.locationId}
                    >
                      <div>
                        <div className="font-medium">{loc.cityName}</div>
                        <div className="text-[10px] text-aeris-muted">{loc.region}</div>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${getCategoryBadgeClasses(loc.category)}`}>
                          {loc.aqi}
                        </span>
                        {loc.locationId === atmospheric.locationId && (
                          <Check className="w-3.5 h-3.5 text-aeris-accent" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-aeris-border bg-aeris-surface">
                  <button
                    onClick={() => {
                      setIsLocationMenuOpen(false);
                      replayTutorial();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-aeris-surface-raised hover:bg-aeris-accent/15 text-aeris-heading hover:text-aeris-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-aeris-accent" />
                    <span>Replay Beginner Tutorial</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile, prominent on md+) */}
        <nav className="hidden md:flex items-center gap-1 bg-aeris-surface/60 p-1 rounded-xl border border-aeris-border/60" aria-label="Desktop Main Navigation">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent ${
                  isActive
                    ? 'bg-aeris-surface-raised text-aeris-heading shadow-sm border border-aeris-border'
                    : 'text-aeris-muted hover:text-aeris-heading hover:bg-aeris-surface-raised/40'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-aeris-accent' : 'text-aeris-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Family Profile, Tutorial & Key Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={replayTutorial}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aeris-surface border border-aeris-border hover:border-aeris-accent text-aeris-muted hover:text-aeris-heading text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent"
            title="Replay Beginner Tutorial & Location Setup"
            aria-label="Replay Beginner Tutorial"
          >
            <HelpCircle className="w-3.5 h-3.5 text-aeris-accent" />
            <span className="hidden sm:inline text-[11px]">Tour</span>
          </button>

          <button
            onClick={onOpenProfileModal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent ${
              hasSensitiveMembers
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
                : 'bg-aeris-surface text-aeris-body border-aeris-border hover:text-aeris-heading'
            }`}
            title="Edit household profile"
            aria-label="Household Profile Settings"
          >
            <Users className="w-3.5 h-3.5 text-aeris-accent" />
            <span className="text-[11px]">Family Setup</span>
            {hasSensitiveMembers && (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Sensitive family members protected" />
            )}
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="p-1.5 rounded-full bg-aeris-surface border border-aeris-border text-aeris-muted hover:text-aeris-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent"
            title={apiKey ? 'Gemini AI Connected' : 'Offline Engine Active (Click to add key)'}
            aria-label="AI Key Settings"
          >
            <Key className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-400' : 'text-aeris-muted'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
