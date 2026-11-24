export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'UnhealthySensitive' 
  | 'Unhealthy' 
  | 'VeryUnhealthy' 
  | 'Hazardous';

export interface PollutantValues {
  pm25: number; // in µg/m³
  pm10: number; // in µg/m³
  no2: number;  // in ppb or µg/m³
  o3: number;   // in ppb
  co: number;   // in ppm
}

export interface InversionDynamics {
  layerStatus: 'Trapped Surface Inversion' | 'Partial Lifting' | 'Dispersed / Active Lift';
  riskLevel: 'Severe' | 'Moderate' | 'Low';
  mixingHeightMeters: number; // e.g. 150m at dawn vs 1200m at 2pm
  windSpeedKmh: number;
  groundTempC: number;
  upperAirTempC: number;
  relativeHumidityPercent: number;
}

export interface AtmosphericReading {
  locationId: string;
  cityName: string;
  region: string;
  timestamp: string;
  aqi: number;
  category: AQICategory;
  pollutants: PollutantValues;
  inversion: InversionDynamics;
  healthAdvisory: string;
}

export interface HourlyForecastPoint {
  hour: number; // 0-23
  label: string; // "06:00"
  aqi: number;
  pm25: number;
  inversionTrapped: boolean;
  activitySafety: 'Safe' | 'Exercise Caution' | 'Hazardous Avoid';
  recommendation: string;
}

export interface FamilyMembersProfile {
  infantsUnderTwo: number;
  childrenUnderTwelve: number;
  elderlyOverSixtyFive: number;
  hasAsthmaOrRespiratory: boolean;
  hasCardiovascularCondition: boolean;
  hasPets: boolean;
}

export type DwellingType = 
  | 'HighRiseApartment' 
  | 'GroundFloorFlat' 
  | 'OlderUnsealedHouse' 
  | 'ModernWeathersealedHome';

export type CookingFuel = 'InductionElectric' | 'PipedNaturalGas' | 'LPG' | 'BiomassSolid';
export type HeatingMethod = 'HeatPumpElectric' | 'RadiatorElectric' | 'GasBoiler' | 'OpenFireplaceWood';
export type CommuteMode = 'MetroElectricRail' | 'SealedCarEV' | 'GasolineCarSolo' | 'GasolineCarCarpool' | 'TwoWheelerMotorcycle' | 'WalkingBicycle';

export interface HouseholdProfile {
  cityName: string;
  members: FamilyMembersProfile;
  dwellingType: DwellingType;
  roomAreaSqFt: number;
  ceilingHeightFt: number;
  cookingFuel: CookingFuel;
  heatingMethod: HeatingMethod;
  primaryCommute: CommuteMode;
  commuteMinutesOneWay: number;
  hasAirPurifier: boolean;
  hasCorsiRosenthalBox: boolean;
  hasWeatherStripping: boolean;
}

export interface RoutineTimeBlock {
  id: string;
  timeWindow: string; // e.g. "06:30 - 08:30"
  periodName: string; // e.g. "Early Morning Commute & School Run"
  isCriticalWindow: boolean;
  baselineExposurePM25: number; // µg/m³ ambient
  recommendedAction: string;
  sustainableAlternative: string;
  indoorProtectionHack: string;
  avoidedDoseUg: number; // µg PM2.5 prevented from entering respiratory tract
  communityEmissionPreventedGramsCO2: number;
}

export interface IAQIntervention {
  id: string;
  title: string;
  category: 'Filtration' | 'Sealing' | 'Ventilation' | 'Kitchen' | 'Cleaning';
  difficulty: 'Easy DIY' | 'Moderate DIY' | 'Advanced';
  costTier: 'Free / Zero-Cost' | '$10 - $30' | '$40 - $90';
  effectivenessRating: 'Essential' | 'High' | 'Supplementary';
  summary: string;
  cadrContributionCFM?: number;
  pm25ReductionPercent: number;
  materialsNeeded: string[];
  protocolSteps: string[];
  scientificMechanism: string;
}

export interface CorsiRosenthalConfig {
  fanType: '20-Inch Box Fan (Standard)' | '5-Array 120mm PWM PC Fans (Silent)';
  fanNominalCFM: number;
  filterCount: 4 | 5 | 1;
  filterMERV: 13 | 14;
  shroudApplied: boolean;
  roomAreaSqFt: number;
  ceilingHeightFt: number;
}

export interface CumulativeImpactStats {
  totalPM25AvoidedMicrograms: number;
  cleanAirBreathedLiters: number;
  co2PreventedKg: number;
  noxPreventedGrams: number;
  activeHacksAdoptedCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  tags?: string[];
  citations?: string[];
}
