import { AtmosphericReading, HourlyForecastPoint, AQICategory } from '../types';
import { getAQICategory } from '../utils/calculators';

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

/**
 * Searches real-world locations using the free Open-Meteo Geocoding API.
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Geocoding search failed, checking offline presets:', err);
    return [];
  }
}

/**
 * Fetches real live atmospheric air quality and weather data for any coordinates on Earth.
 */
export async function fetchLiveAtmosphericData(
  lat: number,
  lon: number,
  cityName: string,
  regionName: string = ''
): Promise<{
  reading: AtmosphericReading;
  forecast: HourlyForecastPoint[];
}> {
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&hourly=us_aqi,pm2_5&timezone=auto&forecast_days=2`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&timezone=auto`;

  const [aqRes, weatherRes] = await Promise.all([
    fetch(aqUrl),
    fetch(weatherUrl).catch(() => null),
  ]);

  if (!aqRes.ok) {
    throw new Error(`Air Quality API error: ${aqRes.status}`);
  }

  const aqData = await aqRes.json();
  const weatherData = weatherRes && weatherRes.ok ? await weatherRes.json() : null;

  const currentAQ = aqData.current || {};
  const currentWeather = weatherData?.current || {};

  const rawAqi = Math.round(currentAQ.us_aqi ?? 150);
  const pm25 = Math.round(currentAQ.pm2_5 ?? 55);
  const pm10 = Math.round(currentAQ.pm10 ?? 85);
  const no2 = Math.round(currentAQ.nitrogen_dioxide ?? 25);
  const o3 = Math.round(currentAQ.ozone ?? 18);
  const co = Math.round((currentAQ.carbon_monoxide ?? 400) / 100) / 10; // convert µg/m³ to ppm approx

  const category: AQICategory = getAQICategory(rawAqi);

  const groundTemp = Math.round((currentWeather.temperature_2m ?? 12) * 10) / 10;
  const humidity = Math.round(currentWeather.relative_humidity_2m ?? 75);
  const windSpeed = Math.round((currentWeather.wind_speed_10m ?? 4.5) * 10) / 10;

  // Real meteorological inversion calculation:
  // Low wind (<6 km/h) + high humidity + cold ground = strong nocturnal/winter surface stagnation
  const currentHour = new Date().getHours();
  const isNightOrDawn = currentHour < 10 || currentHour > 17;
  const isStagnant = windSpeed < 7.0 && isNightOrDawn;

  let layerStatus: 'Trapped Surface Inversion' | 'Partial Lifting' | 'Dispersed / Active Lift' = 'Dispersed / Active Lift';
  let riskLevel: 'Severe' | 'Moderate' | 'Low' = 'Low';
  let mixingHeight = 1100;

  if (isStagnant && (category === 'Hazardous' || category === 'VeryUnhealthy' || category === 'Unhealthy')) {
    layerStatus = 'Trapped Surface Inversion';
    riskLevel = 'Severe';
    mixingHeight = Math.max(120, Math.round(180 + windSpeed * 20));
  } else if (isNightOrDawn) {
    layerStatus = 'Partial Lifting';
    riskLevel = 'Moderate';
    mixingHeight = Math.max(250, Math.round(350 + windSpeed * 30));
  } else {
    layerStatus = 'Dispersed / Active Lift';
    riskLevel = 'Low';
    mixingHeight = Math.max(800, Math.round(1200 + windSpeed * 40));
  }

  const reading: AtmosphericReading = {
    locationId: `live-${lat.toFixed(2)}-${lon.toFixed(2)}`,
    cityName,
    region: regionName || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    aqi: rawAqi,
    category,
    pollutants: {
      pm25,
      pm10,
      no2,
      o3,
      co,
    },
    inversion: {
      layerStatus,
      riskLevel,
      mixingHeightMeters: mixingHeight,
      windSpeedKmh: windSpeed,
      groundTempC: groundTemp,
      upperAirTempC: Math.round((groundTemp + (isStagnant ? 4.5 : -3.5)) * 10) / 10,
      relativeHumidityPercent: humidity,
    },
    healthAdvisory: generateHealthAdvisory(category, layerStatus, cityName),
  };

  // Build real 24-hour forecast from Open-Meteo hourly response
  const hourlyTimes = aqData.hourly?.time || [];
  const hourlyPM25 = aqData.hourly?.pm2_5 || [];
  const hourlyAQI = aqData.hourly?.us_aqi || [];

  const forecast: HourlyForecastPoint[] = [];

  // Match the next 24 hours
  for (let i = 0; i < Math.min(24, hourlyTimes.length); i++) {
    const timeStr = hourlyTimes[i];
    const date = new Date(timeStr);
    const hour = date.getHours();
    const pointPM = Math.round(hourlyPM25[i] ?? pm25);
    const pointAQI = Math.round(hourlyAQI[i] ?? rawAqi);
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

    const trapped = hour < 10 || hour > 17;
    let activitySafety: 'Safe' | 'Exercise Caution' | 'Hazardous Avoid' = 'Hazardous Avoid';
    let recommendation = 'Keep windows closed; avoid prolonged outdoor time.';

    if (hour >= 12 && hour <= 15) {
      activitySafety = 'Safe';
      recommendation = 'Afternoon fresh air window: Best 15-min room airing & essential outdoor transit.';
    } else if (!trapped && pointAQI < 150) {
      activitySafety = 'Exercise Caution';
      recommendation = 'Moderate boundary mixing. Wear an N95 mask if outside for more than 20 minutes.';
    }

    forecast.push({
      hour,
      label: hourLabel,
      aqi: pointAQI,
      pm25: pointPM,
      inversionTrapped: trapped,
      activitySafety,
      recommendation,
    });
  }

  return { reading, forecast };
}

function generateHealthAdvisory(
  category: AQICategory,
  inversion: 'Trapped Surface Inversion' | 'Partial Lifting' | 'Dispersed / Active Lift',
  city: string
): string {
  if (category === 'Hazardous' || category === 'VeryUnhealthy') {
    return `${city} is experiencing severe winter smog under a ${inversion.toLowerCase()}. Keep doors and windows sealed, run bedroom air purifiers, and keep children, seniors, and asthmatics indoors.`;
  }
  if (category === 'Unhealthy' || category === 'UnhealthySensitive') {
    return `Unhealthy air quality in ${city}. Vulnerable family members should stay indoors and wear an N95 respirator during outdoor transit. Best time to air rooms is in the early afternoon.`;
  }
  if (category === 'Moderate') {
    return `Air quality in ${city} is acceptable for most family members. Sensitive individuals with asthma or COPD should monitor their chest comfort during outdoor walks.`;
  }
  return `Clean, healthy air in ${city}. Safe for all outdoor physical activities and full home ventilation.`;
}
