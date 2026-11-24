import { describe, it, expect } from 'vitest';
import { searchLocations, fetchLiveAtmosphericData } from '../services/airQualityApi';

describe('Real-World Atmospheric & Geocoding Service', () => {
  it('searches locations and returns matched cities', async () => {
    const results = await searchLocations('London');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBeDefined();
    expect(results[0].latitude).toBeDefined();
    expect(results[0].longitude).toBeDefined();
  });

  it('fetches live atmospheric readings and hourly forecasts without mock data', async () => {
    const data = await fetchLiveAtmosphericData(28.6139, 77.2090, 'New Delhi', 'India');

    expect(data.reading).toBeDefined();
    expect(data.reading.cityName).toBe('New Delhi');
    expect(data.reading.aqi).toBeGreaterThan(0);
    expect(data.reading.pollutants.pm25).toBeGreaterThan(0);
    expect(data.reading.inversion.layerStatus).toBeDefined();
    expect(data.forecast.length).toBeGreaterThan(0);
    expect(data.forecast[0].label).toBeDefined();
  });

  it('returns empty array when query is less than 2 characters', async () => {
    const results = await searchLocations('a');
    expect(results).toEqual([]);
  });
});
