import { describe, it, expect } from 'vitest';
import { generateAtmosphericAdvice } from '../services/aiAssistant';
import { LOCATION_PRESETS } from '../data/mockAtmosphericData';

describe('GenAI Atmospheric Intelligence Engine', () => {
  const mockAtmospheric = LOCATION_PRESETS[0]; // New Delhi
  const mockHousehold = {
    cityName: 'New Delhi (Anand Vihar)',
    members: {
      infantsUnderTwo: 1,
      childrenUnderTwelve: 1,
      elderlyOverSixtyFive: 1,
      hasAsthmaOrRespiratory: true,
      hasCardiovascularCondition: false,
      hasPets: true,
    },
    dwellingType: 'HighRiseApartment' as const,
    roomAreaSqFt: 280,
    ceilingHeightFt: 9,
    cookingFuel: 'PipedNaturalGas' as const,
    heatingMethod: 'RadiatorElectric' as const,
    primaryCommute: 'GasolineCarSolo' as const,
    commuteMinutesOneWay: 30,
    hasAirPurifier: true,
    hasCorsiRosenthalBox: true,
    hasWeatherStripping: false,
  };

  it('generates evidence-based Corsi-Rosenthal advice with CADR calculations', async () => {
    const response = await generateAtmosphericAdvice({
      atmospheric: mockAtmospheric,
      household: mockHousehold,
      query: 'How to build a Corsi-Rosenthal box for our bedroom?',
      chatHistory: [],
    });

    expect(response.text).toContain('Corsi-Rosenthal');
    expect(response.text).toContain('CADR');
    expect(response.text).toContain('Shroud');
    expect(response.citations.length).toBeGreaterThan(0);
    expect(response.tags).toContain('Corsi-Rosenthal');
  });

  it('provides diurnal commute and respiratory exposure timing recommendations', async () => {
    const response = await generateAtmosphericAdvice({
      atmospheric: mockAtmospheric,
      household: mockHousehold,
      query: 'When is the safest time for grandma to take an outdoor walk or commute?',
      chatHistory: [],
    });

    expect(response.text).toContain('Inversion');
    expect(response.text).toContain('N95');
    expect(response.citations.length).toBeGreaterThan(0);
  });

  it('provides direct, empathetic infant and stroller safety guidance', async () => {
    const response = await generateAtmosphericAdvice({
      atmospheric: mockAtmospheric,
      household: mockHousehold,
      query: 'Can I take my baby out in a stroller today?',
      chatHistory: [],
    });

    expect(response.text.toLowerCase()).toContain('keep baby strollers indoors');
    expect(response.tags).toContain('Infant Health');
    expect(response.citations.length).toBeGreaterThan(0);
  });

  it('provides indoor kitchen and sealing mitigation strategies', async () => {
    const response = await generateAtmosphericAdvice({
      atmospheric: mockAtmospheric,
      household: mockHousehold,
      query: 'What kitchen hacks reduce PM2.5 from gas cooking?',
      chatHistory: [],
    });

    expect(response.text).toContain('range hood');
    expect(response.text.toLowerCase()).toContain('nitrogen dioxide');
    expect(response.text).toContain('microfiber');
  });
});
