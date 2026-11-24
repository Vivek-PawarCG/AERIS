import { AQICategory, CorsiRosenthalConfig } from '../types';

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'UnhealthySensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'VeryUnhealthy';
  return 'Hazardous';
}

export function getCategoryLabel(category: AQICategory): string {
  switch (category) {
    case 'Good':
      return 'Good (Satisfactory)';
    case 'Moderate':
      return 'Moderate (Acceptable)';
    case 'UnhealthySensitive':
      return 'Unhealthy for Sensitive Groups';
    case 'Unhealthy':
      return 'Unhealthy';
    case 'VeryUnhealthy':
      return 'Very Unhealthy (Severe Alert)';
    case 'Hazardous':
      return 'Hazardous (Emergency Warning)';
  }
}

export function getCategoryColor(category: AQICategory): string {
  switch (category) {
    case 'Good':
      return 'text-aqi-good border-aqi-good/30 bg-aqi-good/10';
    case 'Moderate':
      return 'text-aqi-moderate border-aqi-moderate/30 bg-aqi-moderate/10';
    case 'UnhealthySensitive':
      return 'text-aqi-sensitive border-aqi-sensitive/30 bg-aqi-sensitive/10';
    case 'Unhealthy':
      return 'text-aqi-unhealthy border-aqi-unhealthy/30 bg-aqi-unhealthy/10';
    case 'VeryUnhealthy':
      return 'text-aqi-veryUnhealthy border-aqi-veryUnhealthy/30 bg-aqi-veryUnhealthy/10';
    case 'Hazardous':
      return 'text-aqi-hazardous border-aqi-hazardous/30 bg-aqi-hazardous/10';
  }
}

export function getCategoryBadgeClasses(category: AQICategory): string {
  switch (category) {
    case 'Good':
      return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60';
    case 'Moderate':
      return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
    case 'UnhealthySensitive':
      return 'bg-orange-950/80 text-orange-400 border border-orange-800/60';
    case 'Unhealthy':
      return 'bg-red-950/80 text-red-400 border border-red-800/60';
    case 'VeryUnhealthy':
      return 'bg-purple-950/80 text-purple-300 border border-purple-800/60';
    case 'Hazardous':
      return 'bg-rose-950/90 text-rose-300 border border-rose-800/80';
  }
}

/**
 * Calculates official US EPA AQI for PM2.5 concentration in µg/m³
 */
export function calculateEPA_PM25_AQI(pm25: number): number {
  const c = Math.max(0, Math.round(pm25 * 10) / 10);
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (c >= bp.cLow && c <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow
      );
    }
  }

  if (c > 500.4) {
    return 500;
  }
  return 0;
}

export type RespiratoryIntensity = 'resting' | 'light' | 'moderate' | 'vigorous';

/**
 * Calculates inhaled PM2.5 in micrograms (µg) based on tidal volume and minute ventilation
 */
export function calculateInhaledPM25(
  ambientPM25UgPerM3: number,
  durationMinutes: number,
  intensity: RespiratoryIntensity = 'light',
  maskEfficiencyPercent: number = 0
): number {
  // Minute ventilation rates in m³/min (Liters/min divided by 1000)
  const ventilationRates: Record<RespiratoryIntensity, number> = {
    resting: 0.0075,   // ~7.5 L/min
    light: 0.016,      // ~16 L/min (walking, light desk/home activity)
    moderate: 0.035,   // ~35 L/min (fast walking, cycling)
    vigorous: 0.065,   // ~65 L/min (running, strenuous work)
  };

  const volumeM3 = ventilationRates[intensity] * durationMinutes;
  const filteredConcentration = ambientPM25UgPerM3 * (1 - Math.min(0.99, maskEfficiencyPercent / 100));
  const depositionFraction = 0.65; // ~65% of inhaled fine particulates deposit in alveolar/bronchial regions
  
  return Math.round(filteredConcentration * volumeM3 * depositionFraction * 10) / 10;
}

/**
 * Computes Corsi-Rosenthal Clean Air Delivery Rate (CADR) in CFM
 * Based on empirical aerosol research (Richard Corsi & Jim Rosenthal)
 */
export function calculateCorsiRosenthalCADR(config: CorsiRosenthalConfig): {
  cadrCFM: number;
  ach: number;
  effectiveness: 'Exceptional' | 'Adequate' | 'Insufficient';
  statusDescription: string;
} {
  const baseCFM = config.fanType.includes('20-Inch') ? 1400 : 700;
  
  // Plenums with 4 or 5 filters drastically drop static backpressure compared to single filter
  let pressureFactor = 0.42; // single filter
  if (config.filterCount === 4) pressureFactor = 0.72;
  if (config.filterCount === 5) pressureFactor = 0.78;

  // Cardboard shroud prevents blade tip recirculatory stall, boosting flow 35-45%
  const shroudMultiplier = config.shroudApplied ? 1.40 : 1.0;
  
  // MERV 13 single-pass capture for PM2.5 is ~80%, MERV 14 is ~88%
  const singlePassEfficiency = config.filterMERV === 14 ? 0.88 : 0.82;

  const actualAirflowCFM = Math.min(baseCFM, baseCFM * pressureFactor * shroudMultiplier);
  const cadrCFM = Math.round(actualAirflowCFM * singlePassEfficiency);

  const roomVolumeCuFt = Math.max(100, config.roomAreaSqFt * config.ceilingHeightFt);
  // ACH = (CADR * 60) / Volume
  const ach = Math.round(((cadrCFM * 60) / roomVolumeCuFt) * 10) / 10;

  let effectiveness: 'Exceptional' | 'Adequate' | 'Insufficient' = 'Adequate';
  let statusDescription = 'Maintains safe indoor dilution for general occupants.';

  if (ach >= 5.0) {
    effectiveness = 'Exceptional';
    statusDescription = 'Surpasses hospital-grade respiratory target (5+ ACH). High protection for infants & asthmatics.';
  } else if (ach < 3.0) {
    effectiveness = 'Insufficient';
    statusDescription = 'ACH below minimum winter smog threshold (<3 ACH). Consider adding a second unit or reducing room boundary.';
  }

  return { cadrCFM, ach, effectiveness, statusDescription };
}

/**
 * Calculates prevented emissions when substituting transport, heating, and cooking
 */
export function calculateAvoidedEmissions(params: {
  tripDistanceKm: number;
  commuteModeFrom: string;
  commuteModeTo: string;
  cookingFuelFrom: string;
  cookingFuelTo: string;
}): {
  co2PreventedGrams: number;
  noxPreventedGrams: number;
  primaryPM25PreventedGrams: number;
} {
  // Transport emissions per passenger-km (DEFRA / EPA standards)
  const transportFactors: Record<string, { co2: number; nox: number; pm25: number }> = {
    GasolineCarSolo: { co2: 192, nox: 0.16, pm25: 0.012 },
    GasolineCarCarpool: { co2: 96, nox: 0.08, pm25: 0.006 },
    TwoWheelerMotorcycle: { co2: 78, nox: 0.22, pm25: 0.018 },
    MetroElectricRail: { co2: 32, nox: 0.01, pm25: 0.001 },
    SealedCarEV: { co2: 45, nox: 0.01, pm25: 0.004 },
    WalkingBicycle: { co2: 0, nox: 0, pm25: 0 },
  };

  const fromTransport = transportFactors[params.commuteModeFrom] || transportFactors.GasolineCarSolo;
  const toTransport = transportFactors[params.commuteModeTo] || transportFactors.MetroElectricRail;

  const transportCO2 = Math.max(0, (fromTransport.co2 - toTransport.co2) * params.tripDistanceKm);
  const transportNOx = Math.max(0, (fromTransport.nox - toTransport.nox) * params.tripDistanceKm);
  const transportPM25 = Math.max(0, (fromTransport.pm25 - toTransport.pm25) * params.tripDistanceKm);

  // Cooking fuel session emissions (grams per meal session)
  const cookingFactors: Record<string, { co2: number; nox: number; pm25: number }> = {
    BiomassSolid: { co2: 650, nox: 1.2, pm25: 4.5 },
    LPG: { co2: 160, nox: 0.4, pm25: 0.15 },
    PipedNaturalGas: { co2: 140, nox: 0.35, pm25: 0.12 },
    InductionElectric: { co2: 40, nox: 0.02, pm25: 0.01 },
  };

  const fromCooking = cookingFactors[params.cookingFuelFrom] || cookingFactors.LPG;
  const toCooking = cookingFactors[params.cookingFuelTo] || cookingFactors.InductionElectric;

  const cookingCO2 = Math.max(0, fromCooking.co2 - toCooking.co2);
  const cookingNOx = Math.max(0, fromCooking.nox - toCooking.nox);
  const cookingPM25 = Math.max(0, fromCooking.pm25 - toCooking.pm25);

  return {
    co2PreventedGrams: Math.round(transportCO2 + cookingCO2),
    noxPreventedGrams: Math.round((transportNOx + cookingNOx) * 100) / 100,
    primaryPM25PreventedGrams: Math.round((transportPM25 + cookingPM25) * 100) / 100,
  };
}
