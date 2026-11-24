import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Clock, 
  ShieldAlert, 
  Sun,
  ChevronDown,
  ChevronUp,
  Home,
  Baby,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryBadgeClasses, getCategoryLabel } from '../utils/calculators';

export const AtmosphericTelemetry: React.FC = () => {
  const { atmospheric, hourlyForecast } = useApp();
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const currentHourData = hourlyForecast.find((h) => h.hour === selectedHour) || hourlyForecast[7];
  const maxPM = Math.max(...hourlyForecast.map((h) => h.pm25), 350);

  const isHazardousOrSevere = atmospheric.category === 'Hazardous' || atmospheric.category === 'VeryUnhealthy';

  return (
    <div className="space-y-6">
      {/* Responsive Two-Column Grid on Desktop, Single-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Hero Card: Simple Air Status */}
          <section 
            className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 sm:p-6 text-aeris-body shadow-sm space-y-4"
            aria-labelledby="hero-air-status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold ${getCategoryBadgeClasses(atmospheric.category)}`}>
                    AQI {atmospheric.aqi}
                  </span>
                  <span className="text-aeris-heading font-semibold text-xs">
                    {getCategoryLabel(atmospheric.category).split('(')[0].trim()}
                  </span>
                </div>
                <h1 id="hero-air-status" className="text-xl sm:text-2xl font-bold text-aeris-heading tracking-tight">
                  {isHazardousOrSevere ? 'Smog Alert: Keep Windows Sealed' : 'Air Quality Update'}
                </h1>
                <p className="text-xs text-aeris-muted mt-1">
                  Station: {atmospheric.cityName} • {atmospheric.timestamp}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-aeris-surface-raised border border-aeris-border flex items-center justify-center text-aeris-accent shrink-0">
                <Wind className="w-6 h-6" />
              </div>
            </div>

            {/* Quick Weather Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-aeris-border-subtle text-center text-xs">
              <div className="p-2.5 rounded-xl bg-aeris-bg border border-aeris-border/60">
                <div className="text-[10px] text-aeris-muted">Temperature</div>
                <div className="font-semibold text-aeris-heading mt-0.5 flex items-center justify-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                  {atmospheric.inversion.groundTempC}°C
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-aeris-bg border border-aeris-border/60">
                <div className="text-[10px] text-aeris-muted">Relative Humidity</div>
                <div className="font-semibold text-aeris-heading mt-0.5 flex items-center justify-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  {atmospheric.inversion.relativeHumidityPercent}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-aeris-bg border border-aeris-border/60">
                <div className="text-[10px] text-aeris-muted">Surface Wind</div>
                <div className="font-semibold text-aeris-heading mt-0.5 flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-aeris-accent" />
                  {atmospheric.inversion.windSpeedKmh} km/h
                </div>
              </div>
            </div>

            {/* Health Advisory */}
            <div className="p-3.5 rounded-xl bg-aeris-bg border border-aeris-border-subtle flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-aeris-heading leading-relaxed">
                {atmospheric.healthAdvisory}
              </p>
            </div>
          </section>

          {/* 2. Hourly Air Quality Guide */}
          <section 
            className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 space-y-4 text-xs"
            aria-labelledby="hourly-guide-title"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 id="hourly-guide-title" className="text-sm font-semibold text-aeris-heading">
                  Hourly Smog Guide
                </h2>
                <p className="text-[11px] text-aeris-muted">
                  Tap any hour to see the safest times to run errands or open windows
                </p>
              </div>

              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50">
                Best Air: 1 PM – 3 PM
              </span>
            </div>

            {/* Scrollable Hourly Visual Bar */}
            <div className="pt-2 pb-1 overflow-x-auto">
              <div className="min-w-[500px] flex items-end gap-1.5 h-28 border-b border-aeris-border px-1">
                {hourlyForecast.map((point) => {
                  const heightPercent = Math.max(16, Math.round((point.pm25 / maxPM) * 100));
                  const isSelected = point.hour === selectedHour;
                  const isSafe = point.activitySafety === 'Safe';

                  return (
                    <button
                      key={point.hour}
                      onClick={() => setSelectedHour(point.hour)}
                      className="flex-1 flex flex-col items-center justify-end h-full group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aeris-accent rounded"
                      aria-label={`Hour ${point.label}, PM2.5 ${point.pm25} µg/m³`}
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all ${
                          isSelected
                            ? 'bg-aeris-accent ring-2 ring-aeris-accent'
                            : isSafe
                            ? 'bg-emerald-500/80 hover:bg-emerald-400'
                            : point.inversionTrapped
                            ? 'bg-rose-500/80 hover:bg-rose-400'
                            : 'bg-amber-500/80 hover:bg-amber-400'
                        }`}
                      />
                      <span className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-aeris-accent font-bold' : 'text-aeris-muted'}`}>
                        {point.hour % 3 === 0 ? point.label.slice(0, 2) : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Hour Details */}
            <div className="p-3.5 rounded-xl bg-aeris-surface-raised border border-aeris-border flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-aeris-accent" />
                  <span className="font-semibold text-aeris-heading">
                    {currentHourData.label} Status:
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    currentHourData.activitySafety === 'Safe'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : currentHourData.activitySafety === 'Exercise Caution'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentHourData.activitySafety}
                  </span>
                </div>
                <p className="text-aeris-body text-[11px] leading-relaxed">
                  {currentHourData.recommendation}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-aeris-muted">Air Index</div>
                <div className="text-base font-bold font-mono text-aeris-heading">
                  AQI {currentHourData.aqi}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (5 cols on lg) - Family Summary & Inversion Dynamics */}
        <div className="lg:col-span-5 space-y-5">
          {/* At a Glance for Your Family */}
          <section 
            className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 space-y-3 text-xs shadow-sm"
            aria-labelledby="family-advice-title"
          >
            <div className="flex items-center justify-between pb-2 border-b border-aeris-border">
              <h2 id="family-advice-title" className="text-sm font-semibold text-aeris-heading">
                At a Glance for Your Family
              </h2>
              <span className="text-[10px] text-emerald-400 font-medium">Updated for Today</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 space-y-1">
                <div className="flex items-center gap-2 text-aeris-heading font-medium">
                  <div className="w-6 h-6 rounded-lg bg-rose-950/60 text-rose-400 flex items-center justify-center shrink-0">
                    <Baby className="w-3.5 h-3.5" />
                  </div>
                  <span>Kids, Babies & Seniors</span>
                </div>
                <p className="text-aeris-muted leading-relaxed text-[11px]">
                  Keep outdoor exercise and playground time indoors. Winter smog sits thickest near ground level where children breathe.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 space-y-1">
                <div className="flex items-center gap-2 text-aeris-heading font-medium">
                  <div className="w-6 h-6 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <span>Window & Ventilation Rule</span>
                </div>
                <p className="text-aeris-muted leading-relaxed text-[11px]">
                  Keep windows sealed this morning. Open opposite windows for a quick 10–15 min cross-breeze only between <strong>1:00 PM – 3:00 PM</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border/60 space-y-1">
                <div className="flex items-center gap-2 text-aeris-heading font-medium">
                  <div className="w-6 h-6 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <span>Stepping Outside</span>
                </div>
                <p className="text-aeris-muted leading-relaxed text-[11px]">
                  Wear an <strong>N95/FFP2 respirator</strong> if waiting at transit stops. Set vehicle air vents to <strong>Recirculate</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Simple Explanation of the Smog Trap */}
          <section 
            className="rounded-2xl bg-aeris-surface border border-aeris-border p-5 space-y-3 text-xs"
            aria-labelledby="inversion-simple-title"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-950/60 text-aeris-accent flex items-center justify-center">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <h2 id="inversion-simple-title" className="text-sm font-semibold text-aeris-heading">
                Why is Smog Trapped Near the Ground?
              </h2>
            </div>

            <p className="text-aeris-body leading-relaxed text-xs">
              On cold winter nights, ground air cools rapidly and gets trapped under a warm air layer above — exactly like putting a tight lid on a pot. Smoke and vehicle exhaust have nowhere to escape until afternoon sun breaks the lid.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-aeris-bg border border-aeris-border">
                <span className="text-rose-400 font-semibold block text-[10px]">Morning & Night</span>
                Heavy smog ceiling: <strong>{atmospheric.inversion.mixingHeightMeters}m</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-aeris-bg border border-aeris-border">
                <span className="text-emerald-400 font-semibold block text-[10px]">Afternoon Sun</span>
                Lid lifts up to: <strong>1,200m+</strong>
              </div>
            </div>
          </section>

          {/* Collapsible Deep Sensor Data */}
          <section className="rounded-2xl bg-aeris-surface border border-aeris-border text-xs overflow-hidden">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-3.5 text-left flex items-center justify-between text-aeris-heading hover:bg-aeris-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aeris-accent"
              aria-expanded={showTechnicalDetails}
            >
              <span className="font-medium text-xs flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-aeris-accent" />
                <span>View Full Sensor Telemetry (PM2.5, PM10, NO2)</span>
              </span>
              {showTechnicalDetails ? (
                <ChevronUp className="w-4 h-4 text-aeris-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-aeris-muted" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="p-3.5 pt-0 border-t border-aeris-border-subtle space-y-2">
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2 rounded-lg bg-aeris-bg border border-aeris-border text-center">
                    <span className="text-[10px] text-aeris-muted block">PM2.5</span>
                    <span className="font-mono font-bold text-rose-300 text-sm">
                      {atmospheric.pollutants.pm25} µg/m³
                    </span>
                    <span className="text-[9px] text-aeris-subtle block">WHO limit: 15</span>
                  </div>

                  <div className="p-2 rounded-lg bg-aeris-bg border border-aeris-border text-center">
                    <span className="text-[10px] text-aeris-muted block">PM10</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {atmospheric.pollutants.pm10} µg/m³
                    </span>
                    <span className="text-[9px] text-aeris-subtle block">WHO limit: 45</span>
                  </div>

                  <div className="p-2 rounded-lg bg-aeris-bg border border-aeris-border text-center">
                    <span className="text-[10px] text-aeris-muted block">NO2 Gas</span>
                    <span className="font-mono font-bold text-orange-300 text-sm">
                      {atmospheric.pollutants.no2} ppb
                    </span>
                    <span className="text-[9px] text-aeris-subtle block">Stove/vehicle exhaust</span>
                  </div>

                  <div className="p-2 rounded-lg bg-aeris-bg border border-aeris-border text-center">
                    <span className="text-[10px] text-aeris-muted block">Upper vs Ground</span>
                    <span className="font-mono font-bold text-rose-300 text-sm">
                      +{Math.round((atmospheric.inversion.upperAirTempC - atmospheric.inversion.groundTempC) * 10) / 10}°C
                    </span>
                    <span className="text-[9px] text-aeris-subtle block">Thermal lid</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
