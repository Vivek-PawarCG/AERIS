import { describe, it, expect } from 'vitest';
import { 
  getAQICategory, 
  calculateEPA_PM25_AQI, 
  calculateInhaledPM25, 
  calculateCorsiRosenthalCADR, 
  calculateAvoidedEmissions 
} from '../utils/calculators';

describe('Atmospheric & Respiratory Calculators', () => {
  it('correctly maps AQI values to official categories', () => {
    expect(getAQICategory(35)).toBe('Good');
    expect(getAQICategory(75)).toBe('Moderate');
    expect(getAQICategory(125)).toBe('UnhealthySensitive');
    expect(getAQICategory(175)).toBe('Unhealthy');
    expect(getAQICategory(250)).toBe('VeryUnhealthy');
    expect(getAQICategory(380)).toBe('Hazardous');
  });

  it('calculates official EPA AQI accurately from PM2.5 concentrations', () => {
    // 0 - 12 µg/m³ => AQI 0 - 50
    expect(calculateEPA_PM25_AQI(12.0)).toBe(50);
    expect(calculateEPA_PM25_AQI(0)).toBe(0);
    // 35.4 µg/m³ => AQI 100
    expect(calculateEPA_PM25_AQI(35.4)).toBe(100);
    // 55.4 µg/m³ => AQI 150
    expect(calculateEPA_PM25_AQI(55.4)).toBe(150);
    // 150.4 µg/m³ => AQI 200
    expect(calculateEPA_PM25_AQI(150.4)).toBe(200);
    // 250.4 µg/m³ => AQI 300
    expect(calculateEPA_PM25_AQI(250.4)).toBe(300);
  });

  it('calculates inhaled PM2.5 dosimetry considering activity and mask filtration', () => {
    // 100 µg/m³ for 60 min at light exertion (16 L/min = 0.016 m³/min)
    // Total air = 0.96 m³, unmasked (0% filtration), 65% alveolar deposition
    // Inhaled = 100 * 0.96 * 0.65 = 62.4 µg
    const unmasked = calculateInhaledPM25(100, 60, 'light', 0);
    expect(unmasked).toBeCloseTo(62.4, 0);

    // With 95% efficiency N95 respirator:
    // Filtered concentration = 100 * 0.05 = 5 µg/m³
    // Inhaled = 5 * 0.96 * 0.65 = 3.12 µg (~95% reduction)
    const masked = calculateInhaledPM25(100, 60, 'light', 95);
    expect(masked).toBeLessThan(4);
    expect(masked).toBeGreaterThan(2);
  });

  it('models Corsi-Rosenthal box CADR and ACH correctly with shroud factor', () => {
    const withShroud = calculateCorsiRosenthalCADR({
      fanType: '20-Inch Box Fan (Standard)',
      fanNominalCFM: 1400,
      filterCount: 4,
      filterMERV: 13,
      shroudApplied: true,
      roomAreaSqFt: 250,
      ceilingHeightFt: 8,
    });

    const withoutShroud = calculateCorsiRosenthalCADR({
      fanType: '20-Inch Box Fan (Standard)',
      fanNominalCFM: 1400,
      filterCount: 4,
      filterMERV: 13,
      shroudApplied: false,
      roomAreaSqFt: 250,
      ceilingHeightFt: 8,
    });

    // Shroud should provide higher CADR and ACH
    expect(withShroud.cadrCFM).toBeGreaterThan(withoutShroud.cadrCFM);
    expect(withShroud.ach).toBeGreaterThan(withoutShroud.ach);
    expect(withShroud.ach).toBeGreaterThanOrEqual(4.0); // Meets respiratory threshold
    expect(withShroud.effectiveness).toBe('Exceptional');
  });

  it('calculates avoided emissions when substituting transport and cooking', () => {
    const result = calculateAvoidedEmissions({
      tripDistanceKm: 15,
      commuteModeFrom: 'GasolineCarSolo',
      commuteModeTo: 'MetroElectricRail',
      cookingFuelFrom: 'LPG',
      cookingFuelTo: 'InductionElectric',
    });

    // 15km * (192g - 32g) = 2400g CO2 + (160g - 40g cooking) = 2520g CO2
    expect(result.co2PreventedGrams).toBeGreaterThan(2000);
    expect(result.noxPreventedGrams).toBeGreaterThan(1.0);
    expect(result.primaryPM25PreventedGrams).toBeGreaterThan(0.1);
  });
});
