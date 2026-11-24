import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  AtmosphericReading, 
  HourlyForecastPoint, 
  HouseholdProfile, 
  RoutineTimeBlock, 
  ChatMessage, 
  CumulativeImpactStats 
} from '../types';
import { LOCATION_PRESETS, generateDiurnalForecast } from '../data/mockAtmosphericData';
import { IAQ_INTERVENTIONS } from '../data/iaqInterventions';
import { calculateInhaledPM25, calculateAvoidedEmissions } from '../utils/calculators';
import { generateAtmosphericAdvice } from '../services/aiAssistant';
import { fetchLiveAtmosphericData, searchLocations, GeocodingResult } from '../services/airQualityApi';

interface AppContextType {
  atmospheric: AtmosphericReading;
  hourlyForecast: HourlyForecastPoint[];
  availableLocations: AtmosphericReading[];
  selectLocation: (locationId: string) => void;
  loadLiveLocation: (lat: number, lon: number, cityName: string, regionName?: string) => Promise<void>;
  isLoadingLocation: boolean;
  searchCities: (query: string) => Promise<GeocodingResult[]>;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  replayTutorial: () => void;
  household: HouseholdProfile;
  updateHousehold: (profile: Partial<HouseholdProfile>) => void;
  routineBlocks: RoutineTimeBlock[];
  adoptedRoutineIds: string[];
  toggleAdoptRoutine: (id: string) => void;
  adoptedHackIds: string[];
  toggleAdoptHack: (id: string) => void;
  chatMessages: ChatMessage[];
  isAiGenerating: boolean;
  sendChatMessage: (query: string) => Promise<void>;
  apiKey: string;
  setApiKey: (key: string) => void;
  cumulativeImpact: CumulativeImpactStats;
  resetAllData: () => void;
}

const DEFAULT_HOUSEHOLD: HouseholdProfile = {
  cityName: 'New Delhi (Anand Vihar)',
  members: {
    infantsUnderTwo: 1,
    childrenUnderTwelve: 1,
    elderlyOverSixtyFive: 1,
    hasAsthmaOrRespiratory: true,
    hasCardiovascularCondition: false,
    hasPets: true,
  },
  dwellingType: 'HighRiseApartment',
  roomAreaSqFt: 280,
  ceilingHeightFt: 9,
  cookingFuel: 'PipedNaturalGas',
  heatingMethod: 'RadiatorElectric',
  primaryCommute: 'GasolineCarSolo',
  commuteMinutesOneWay: 35,
  hasAirPurifier: true,
  hasCorsiRosenthalBox: true,
  hasWeatherStripping: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

const safeSession = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {}
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [atmospheric, setAtmospheric] = useState<AtmosphericReading>(LOCATION_PRESETS[0]);
  const [apiKey, setApiKey] = useState<string>(() => {
    return safeSession.getItem('aeris_gemini_api_key') || '';
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return safeStorage.getItem('aeris_onboarding_completed') === 'true';
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [liveForecast, setLiveForecast] = useState<HourlyForecastPoint[] | null>(null);
  const [userLocations, setUserLocations] = useState<AtmosphericReading[]>([]);

  const [household, setHousehold] = useState<HouseholdProfile>(() => {
    try {
      const saved = safeStorage.getItem('aeris_household_profile');
      return saved ? JSON.parse(saved) : DEFAULT_HOUSEHOLD;
    } catch {
      return DEFAULT_HOUSEHOLD;
    }
  });

  const [adoptedHackIds, setAdoptedHackIds] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('aeris_adopted_hacks');
      return saved ? JSON.parse(saved) : ['corsi-rosenthal-box', 'kitchen-positive-pressure'];
    } catch {
      return ['corsi-rosenthal-box', 'kitchen-positive-pressure'];
    }
  });

  const [adoptedRoutineIds, setAdoptedRoutineIds] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('aeris_adopted_routines');
      return saved ? JSON.parse(saved) : ['rt-morning-commute', 'rt-lunch-vent'];
    } catch {
      return ['rt-morning-commute', 'rt-lunch-vent'];
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: '07:30',
      text: `Welcome to AERIS. I am your atmospheric resilience and indoor air intelligence assistant.\n\nCurrently, ${atmospheric.cityName} is experiencing **${atmospheric.category}** conditions (AQI ${atmospheric.aqi}, PM2.5 ${atmospheric.pollutants.pm25} µg/m³) with a **${atmospheric.inversion.layerStatus}** at ${atmospheric.inversion.mixingHeightMeters}m.\n\nHow can I help you protect your home, optimize your family's daily routine, or size your indoor air filtration today?`,
      tags: ['System Active', 'Inversion Monitored'],
      citations: ['WHO Air Quality Guidelines (2021)', 'EPA National Ambient Air Standards'],
    },
  ]);

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Sync state to local/session storage
  useEffect(() => {
    safeStorage.setItem('aeris_household_profile', JSON.stringify(household));
  }, [household]);

  useEffect(() => {
    safeStorage.setItem('aeris_adopted_hacks', JSON.stringify(adoptedHackIds));
  }, [adoptedHackIds]);

  useEffect(() => {
    safeStorage.setItem('aeris_adopted_routines', JSON.stringify(adoptedRoutineIds));
  }, [adoptedRoutineIds]);

  useEffect(() => {
    if (apiKey) {
      safeSession.setItem('aeris_gemini_api_key', apiKey);
    } else {
      safeSession.removeItem('aeris_gemini_api_key');
    }
  }, [apiKey]);

  const loadLiveLocation = async (
    lat: number,
    lon: number,
    cityName: string,
    regionName: string = ''
  ) => {
    setIsLoadingLocation(true);
    try {
      const { reading, forecast } = await fetchLiveAtmosphericData(lat, lon, cityName, regionName);
      setAtmospheric(reading);
      setLiveForecast(forecast);
      setHousehold((prev) => ({ ...prev, cityName: reading.cityName }));
      safeStorage.setItem(
        'aeris_saved_location',
        JSON.stringify({ lat, lon, cityName, regionName })
      );
      setUserLocations((prev) => {
        const filtered = prev.filter((p) => p.locationId !== reading.locationId);
        return [reading, ...filtered];
      });
    } catch (err) {
      console.error('Failed to load live atmospheric data:', err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const searchCities = async (query: string): Promise<GeocodingResult[]> => {
    return await searchLocations(query);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    safeStorage.setItem('aeris_onboarding_completed', 'true');
  };

  const replayTutorial = () => {
    setHasCompletedOnboarding(false);
  };

  // Mount effect to load saved real-world location if previously configured
  useEffect(() => {
    const saved = safeStorage.getItem('aeris_saved_location');
    if (saved) {
      try {
        const { lat, lon, cityName, regionName } = JSON.parse(saved);
        if (lat !== undefined && lon !== undefined) {
          loadLiveLocation(lat, lon, cityName, regionName);
        }
      } catch {}
    }
  }, []);

  const hourlyForecast = useMemo(() => {
    if (liveForecast && liveForecast.length > 0) {
      return liveForecast;
    }
    return generateDiurnalForecast(atmospheric.aqi, atmospheric.pollutants.pm25);
  }, [liveForecast, atmospheric.aqi, atmospheric.pollutants.pm25]);

  const availableLocations = useMemo(() => {
    return [
      ...userLocations,
      ...LOCATION_PRESETS.filter((p) => !userLocations.some((u) => u.cityName === p.cityName)),
    ];
  }, [userLocations]);

  const selectLocation = (locationId: string) => {
    const loc = availableLocations.find((l) => l.locationId === locationId);
    if (loc) {
      setAtmospheric(loc);
      setHousehold((prev) => ({ ...prev, cityName: loc.cityName }));
    }
  };

  const updateHousehold = (updated: Partial<HouseholdProfile>) => {
    setHousehold((prev) => ({
      ...prev,
      ...updated,
      members: updated.members ? { ...prev.members, ...updated.members } : prev.members,
    }));
  };

  const toggleAdoptHack = (id: string) => {
    setAdoptedHackIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAdoptRoutine = (id: string) => {
    setAdoptedRoutineIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Structured dynamic daily routine blocks tailored to current atmospheric readings and household
  const routineBlocks = useMemo((): RoutineTimeBlock[] => {
    const pm = atmospheric.pollutants.pm25;
    return [
      {
        id: 'rt-early-morning',
        timeWindow: '06:00 - 07:30',
        periodName: 'Dawn Thermal Stagnation & Exercise Window',
        isCriticalWindow: true,
        baselineExposurePM25: Math.round(pm * 1.45),
        recommendedAction: 'Keep bedroom air cleaning active on low speed. Delay all outdoor walks or jogging. Conduct gentle yoga or indoor stretching.',
        sustainableAlternative: 'Indoor resistance / mobility exercises in high-ACH sealed room instead of neighborhood park jogging.',
        indoorProtectionHack: 'Maintain door threshold seals; do not open balcony sliders for morning air.',
        avoidedDoseUg: calculateInhaledPM25(pm * 1.45, 60, 'moderate', 0) - calculateInhaledPM25(pm * 0.15, 60, 'resting', 0),
        communityEmissionPreventedGramsCO2: 0,
      },
      {
        id: 'rt-morning-commute',
        timeWindow: '07:30 - 09:30',
        periodName: 'Peak Morning Commute & School Transit',
        isCriticalWindow: true,
        baselineExposurePM25: Math.round(pm * 1.48),
        recommendedAction: 'Wear a sealed N95/FFP2 respirator. Switch vehicle HVAC to 100% Cabin Recirculation, or board sealed electric metro transit.',
        sustainableAlternative: 'Shift from solo combustion vehicle to filtered electric metro rail or shared carpool.',
        indoorProtectionHack: 'Seal school bags and outer jackets at entry vestibule to prevent tracking particulate dust into living areas.',
        avoidedDoseUg: calculateInhaledPM25(pm * 1.48, household.commuteMinutesOneWay, 'light', 0) - calculateInhaledPM25(pm * 1.48, household.commuteMinutesOneWay, 'light', 95),
        communityEmissionPreventedGramsCO2: calculateAvoidedEmissions({
          tripDistanceKm: 14,
          commuteModeFrom: household.primaryCommute,
          commuteModeTo: 'MetroElectricRail',
          cookingFuelFrom: 'LPG',
          cookingFuelTo: 'InductionElectric',
        }).co2PreventedGrams,
      },
      {
        id: 'rt-lunch-vent',
        timeWindow: '12:30 - 14:30',
        periodName: 'Planetary Boundary Layer Expansion & Ventilation Flush',
        isCriticalWindow: false,
        baselineExposurePM25: Math.round(pm * 0.50),
        recommendedAction: 'Solar convective heating has broken the ground inversion. Open cross-ventilation windows for 15 minutes to purge accumulated indoor CO2.',
        sustainableAlternative: 'Prepare lunch using electric induction or electric pressure cooking with covered cookware rather than high-temperature frying.',
        indoorProtectionHack: 'Run Corsi-Rosenthal unit on maximum speed for 20 minutes immediately following the window flush.',
        avoidedDoseUg: Math.round(pm * 0.35 * 0.016 * 120 * 0.65),
        communityEmissionPreventedGramsCO2: 120,
      },
      {
        id: 'rt-evening-rebound',
        timeWindow: '17:30 - 20:00',
        periodName: 'Dusk Radiative Inversion & Evening Commute',
        isCriticalWindow: true,
        baselineExposurePM25: Math.round(pm * 1.20),
        recommendedAction: 'Ground radiation cools rapidly, re-establishing a cold surface lid. Keep kids indoors; run humidified damp mopping in dining zones.',
        sustainableAlternative: 'Consolidate errands into a single trip or arrange communal delivery.',
        indoorProtectionHack: 'Run kitchen exhaust hood on high before lighting stove; isolate kitchen doors.',
        avoidedDoseUg: calculateInhaledPM25(pm * 1.20, 60, 'light', 0) - calculateInhaledPM25(pm * 0.20, 60, 'light', 0),
        communityEmissionPreventedGramsCO2: 240,
      },
      {
        id: 'rt-night-sleep',
        timeWindow: '22:00 - 06:00',
        periodName: 'Nocturnal Inversion Cap & Sleep Filtration',
        isCriticalWindow: false,
        baselineExposurePM25: Math.round(pm * 1.25),
        recommendedAction: 'Position air cleaner 3 feet from bed headboard. Run continuously in whisper mode with bedroom door closed to create a micro-clean clean air bubble.',
        sustainableAlternative: 'Set electric heating thermostat to 19°C (66°F) and use heavy layered blankets instead of running open biomass/wood heaters.',
        indoorProtectionHack: 'Inspect window latch compression; place weighted draft seal against bedroom threshold.',
        avoidedDoseUg: calculateInhaledPM25(pm * 1.25, 480, 'resting', 0) - calculateInhaledPM25(pm * 0.12, 480, 'resting', 0),
        communityEmissionPreventedGramsCO2: 450,
      },
    ];
  }, [atmospheric.pollutants.pm25, household.commuteMinutesOneWay, household.primaryCommute]);

  // Aggregate impact metrics
  const cumulativeImpact = useMemo((): CumulativeImpactStats => {
    let totalPM25Avoided = 0;
    let totalCO2PreventedGrams = 0;

    // Routine contributions
    routineBlocks.forEach((block) => {
      if (adoptedRoutineIds.includes(block.id)) {
        totalPM25Avoided += block.avoidedDoseUg;
        totalCO2PreventedGrams += block.communityEmissionPreventedGramsCO2;
      }
    });

    // IAQ Hack contributions
    adoptedHackIds.forEach((hackId) => {
      const hack = IAQ_INTERVENTIONS.find((h) => h.id === hackId);
      if (hack) {
        // Active filtration hack cuts continuous indoor exposure
        const dailyInhaledUnfiltered = calculateInhaledPM25(atmospheric.pollutants.pm25 * 0.7, 720, 'resting', 0);
        const prevented = dailyInhaledUnfiltered * (hack.pm25ReductionPercent / 100);
        totalPM25Avoided += Math.round(prevented);
      }
    });

    // Base community emission from adopted actions
    const noxGrams = (totalCO2PreventedGrams / 1000) * 1.8;
    const cleanLitersBreathed = Math.round((totalPM25Avoided / Math.max(1, atmospheric.pollutants.pm25)) * 1000 * 45);

    return {
      totalPM25AvoidedMicrograms: Math.round(totalPM25Avoided),
      cleanAirBreathedLiters: Math.max(1200, cleanLitersBreathed),
      co2PreventedKg: Math.round((totalCO2PreventedGrams / 1000) * 10) / 10,
      noxPreventedGrams: Math.round(noxGrams * 10) / 10,
      activeHacksAdoptedCount: adoptedHackIds.length,
    };
  }, [routineBlocks, adoptedRoutineIds, adoptedHackIds, atmospheric.pollutants.pm25]);

  const sendChatMessage = async (query: string) => {
    if (!query.trim() || isAiGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiGenerating(true);

    try {
      const result = await generateAtmosphericAdvice({
        atmospheric,
        household,
        query,
        chatHistory: chatMessages,
        apiKey: apiKey || undefined,
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: result.text,
        citations: result.citations,
        tags: result.tags,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const errorMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'A temporary communication error occurred while processing your request. Please try again or inspect your connection.',
        tags: ['System Alert'],
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const resetAllData = () => {
    safeStorage.removeItem('aeris_household_profile');
    safeStorage.removeItem('aeris_adopted_hacks');
    safeStorage.removeItem('aeris_adopted_routines');
    safeStorage.removeItem('aeris_onboarding_completed');
    safeStorage.removeItem('aeris_saved_location');
    setHousehold(DEFAULT_HOUSEHOLD);
    setAdoptedHackIds(['corsi-rosenthal-box', 'kitchen-positive-pressure']);
    setAdoptedRoutineIds(['rt-morning-commute', 'rt-lunch-vent']);
    setHasCompletedOnboarding(false);
  };

  return (
    <AppContext.Provider
      value={{
        atmospheric,
        hourlyForecast,
        availableLocations,
        selectLocation,
        loadLiveLocation,
        isLoadingLocation,
        searchCities,
        hasCompletedOnboarding,
        completeOnboarding,
        replayTutorial,
        household,
        updateHousehold,
        routineBlocks,
        adoptedRoutineIds,
        toggleAdoptRoutine,
        adoptedHackIds,
        toggleAdoptHack,
        chatMessages,
        isAiGenerating,
        sendChatMessage,
        apiKey,
        setApiKey,
        cumulativeImpact,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
