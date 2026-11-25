import '@testing-library/jest-dom';

// In-memory Storage mock for consistent cross-environment testing
class StorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

const mockLocalStorage = new StorageMock();
const mockSessionStorage = new StorageMock();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// Polyfill scrollTo / scrollIntoView for headless DOM
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  window.scrollTo = function() {};
}

// Global fetch mock for testing environment
const originalFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();

  if (url.includes('geocoding-api.open-meteo.com')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          { id: 101, name: 'New Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
          { id: 102, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
        ],
      }),
    } as Response;
  }

  if (url.includes('air-quality-api.open-meteo.com')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        current: { us_aqi: 220, pm2_5: 98, pm10: 160, nitrogen_dioxide: 42, ozone: 15, carbon_monoxide: 650 },
        hourly: {
          time: Array.from({ length: 24 }, (_, i) => `2026-11-24T${i.toString().padStart(2, '0')}:00`),
          pm2_5: Array.from({ length: 24 }, () => 98),
          us_aqi: Array.from({ length: 24 }, () => 220),
        },
      }),
    } as Response;
  }

  if (url.includes('api.open-meteo.com/v1/forecast')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        current: { temperature_2m: 8.5, relative_humidity_2m: 82, wind_speed_10m: 3.2 },
      }),
    } as Response;
  }

  if (url.includes('generativelanguage.googleapis.com')) {
    if (url.includes('invalid_key')) {
      return {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify({ error: { message: 'API key not valid. Please pass a valid API key.' } }),
      } as Response;
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Live Gemini response for atmospheric questions.' }],
            },
          },
        ],
      }),
    } as Response;
  }

  if (originalFetch) {
    return originalFetch(input, init);
  }

  return {
    ok: true,
    status: 200,
    json: async () => ({}),
  } as Response;
}) as typeof fetch;
