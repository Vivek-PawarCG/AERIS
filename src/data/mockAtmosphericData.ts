import { AtmosphericReading, HourlyForecastPoint } from '../types';

export const LOCATION_PRESETS: AtmosphericReading[] = [
  {
    locationId: 'delhi-ncr',
    cityName: 'New Delhi (Anand Vihar)',
    region: 'Indo-Gangetic Plain',
    timestamp: 'Today, 07:30 AM',
    aqi: 388,
    category: 'Hazardous',
    pollutants: {
      pm25: 342,
      pm10: 488,
      no2: 84,
      o3: 18,
      co: 3.2,
    },
    inversion: {
      layerStatus: 'Trapped Surface Inversion',
      riskLevel: 'Severe',
      mixingHeightMeters: 180,
      windSpeedKmh: 3.4,
      groundTempC: 11.2,
      upperAirTempC: 16.5,
      relativeHumidityPercent: 88,
    },
    healthAdvisory: 'Heavy winter smog is trapped near the ground this morning. Keep doors and windows tightly closed, run an air filter in bedrooms, and avoid morning outdoor walks or runs.',
  },
  {
    locationId: 'salt-lake-basin',
    cityName: 'Salt Lake Valley',
    region: 'Intermountain West Basin',
    timestamp: 'Today, 06:45 AM',
    aqi: 172,
    category: 'Unhealthy',
    pollutants: {
      pm25: 96,
      pm10: 130,
      no2: 44,
      o3: 12,
      co: 1.4,
    },
    inversion: {
      layerStatus: 'Trapped Surface Inversion',
      riskLevel: 'Severe',
      mixingHeightMeters: 320,
      windSpeedKmh: 4.1,
      groundTempC: -3.5,
      upperAirTempC: 2.1,
      relativeHumidityPercent: 74,
    },
    healthAdvisory: 'Cold valley air has trapped smoke and vehicle exhaust. Vulnerable family members (kids, seniors, asthmatics) should stay indoors and wear an N95 mask if stepping out.',
  },
  {
    locationId: 'lahore-central',
    cityName: 'Lahore (Gulberg)',
    region: 'Punjab Basin',
    timestamp: 'Today, 07:00 AM',
    aqi: 412,
    category: 'Hazardous',
    pollutants: {
      pm25: 385,
      pm10: 520,
      no2: 92,
      o3: 14,
      co: 3.8,
    },
    inversion: {
      layerStatus: 'Trapped Surface Inversion',
      riskLevel: 'Severe',
      mixingHeightMeters: 150,
      windSpeedKmh: 2.8,
      groundTempC: 12.0,
      upperAirTempC: 17.8,
      relativeHumidityPercent: 91,
    },
    healthAdvisory: 'Extremely thick smog is locked in place. Keep all family members indoors as much as possible and seal door and window gaps to keep indoor air clean.',
  },
  {
    locationId: 'bakersfield-valley',
    cityName: 'Central Valley (Bakersfield)',
    region: 'San Joaquin Valley',
    timestamp: 'Today, 07:15 AM',
    aqi: 148,
    category: 'UnhealthySensitive',
    pollutants: {
      pm25: 54,
      pm10: 82,
      no2: 32,
      o3: 20,
      co: 1.1,
    },
    inversion: {
      layerStatus: 'Partial Lifting',
      riskLevel: 'Moderate',
      mixingHeightMeters: 450,
      windSpeedKmh: 6.2,
      groundTempC: 6.8,
      upperAirTempC: 8.5,
      relativeHumidityPercent: 79,
    },
    healthAdvisory: 'Winter fog is slowly clearing. Sensitive family members should limit prolonged outdoor time until afternoon sunshine helps clear the air.',
  },
];

export function generateDiurnalForecast(baseAQI: number, basePM25: number): HourlyForecastPoint[] {
  const diurnalMultipliers = [
    1.15, // 00:00 (Midnight)
    1.20, // 01:00
    1.25, // 02:00
    1.30, // 03:00
    1.38, // 04:00
    1.45, // 05:00 - Dawn peak
    1.50, // 06:00 - Worst smog trap
    1.48, // 07:00 - Morning school & work rush
    1.35, // 08:00
    1.15, // 09:00
    0.90, // 10:00 - Sun starts warming ground
    0.75, // 11:00
    0.60, // 12:00 - Air starts clearing
    0.50, // 13:00 - Best time to air out home
    0.48, // 14:00 - Best air of the day
    0.55, // 15:00
    0.70, // 16:00 - Sunset starts
    0.95, // 17:00 - Evening commute rush
    1.10, // 18:00
    1.20, // 19:00 - Smog builds back up
    1.25, // 20:00
    1.22, // 21:00
    1.18, // 22:00
    1.15, // 23:00
  ];

  return diurnalMultipliers.map((multiplier, hour) => {
    const pm25 = Math.round(basePM25 * multiplier);
    const aqi = Math.round(baseAQI * (0.85 + multiplier * 0.15));
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    let activitySafety: 'Safe' | 'Exercise Caution' | 'Hazardous Avoid' = 'Hazardous Avoid';
    let recommendation = 'Keep windows closed; stay indoors.';
    const inversionTrapped = hour < 10 || hour > 17;

    if (multiplier < 0.65) {
      activitySafety = 'Safe';
      recommendation = 'Best window: Quick 10-15 min room airing & necessary errands.';
    } else if (multiplier < 1.0) {
      activitySafety = 'Exercise Caution';
      recommendation = 'Smog is clearing. Wear a mask if outside for longer than 15 mins.';
    }

    return {
      hour,
      label: hourLabel,
      aqi,
      pm25,
      inversionTrapped,
      activitySafety,
      recommendation,
    };
  });
}
