# DESIGN.md — AERIS Atmospheric Intelligence System

## 1. Direction & World
- **Product**: Atmospheric resilience and indoor air companion for urban communities navigating severe winter smog.
- **Character**: Calm, exact, scientific, civic, deeply intentional. No hype, no fear-mongering, zero decorative slop.
- **World**: Atmospheric science, air filtration laboratories, high-altitude meteorological observatories. High-contrast deep slate and obsidian backgrounds, precise hairlines, crisp data typography, and scientifically calibrated air quality hazard indicators.
- **Moments**:
  1. The 24-Hour Atmospheric Inversion & AQI Timeline: A live telemetry strip showing diurnal temperature inversion dynamics and particulate concentration.
  2. The Quantified Impact Telemetry: Physical mass reduction meters ($\mu g\ PM_{2.5}$ avoided from lungs, $g\ CO_2e$ and $NO_x$ reduced).
- **Signature**: Atmospheric status indicator displaying real-time inversion state (Trapped / Dispersing / Clear) with precise particulate density metrics.

---

## 2. Color System
Strictly adhering to `unslop` and `impeccable` craft floor:
- **Base Chrome (Slate/Graphite Ramp)**:
  - Background: `#0b0f17` (Deep Atmospheric Obsidian)
  - Surface: `#111726` (Clean Slate Panel)
  - Raised Surface: `#182032` (Interactive Elements & Tables)
  - Surface Overlay: `#1f2a40` (Modals / Flyouts)
  - Hairline Borders: `#243048` (1px subtle separation)
  - Primary Text: `#f1f5f9` (Slate 100, contrast > 11:1)
  - Secondary Text: `#cbd5e1` (Slate 300, contrast > 7:1)
  - Muted/Caption Text: `#8b9bb4` (Slate 400, contrast > 4.5:1)
- **Scientific Atmospheric Metric Colors (EPA / WHO calibrated)**:
  - Good (0–50): `#22c55e` (Forest Pine / Emerald)
  - Moderate (51–100): `#eab308` (Ochre / Amber)
  - Unhealthy for Sensitive Groups (101–150): `#f97316` (Muted Terracotta)
  - Unhealthy (151–200): `#ef4444` (Crimson Brick)
  - Very Unhealthy (201–300): `#a855f7` (Muted Deep Plum)
  - Hazardous (301+): `#be123c` (Atmospheric Maroon)
- **Primary Functional Accent**:
  - Sky Cyan: `#38bdf8` (Active selection, key data point focus)

---

## 3. Typography
- **Primary Interface**: Inter / system-ui, regular (400) and medium (500), semibold (600) for section titles.
- **Data & Physical Units**: JetBrains Mono / SF Mono (`342 µg/m³`, `CADR: 210 CFM`, `ACH: 4.8`).
- **Hierarchy Rules**:
  - No eyebrows or kickers above headings.
  - No gradient text.
  - High contrast on all viewports.

---

## 4. Craft Floor Compliance Checklist
- [x] Body text contrast ≥ 4.5:1.
- [x] No gradient text or decorative multi-color blobs.
- [x] No zero-offset colored glow or neon halos.
- [x] Clean 4px grid spacing (paddings: 12px, 16px, 20px, 24px; gaps: 8px, 12px, 16px, 24px).
- [x] Real stroke icons (Lucide React, 1.5px stroke), zero arbitrary emojis in badges or headings.
- [x] Every state handled: Default, Loading, Empty, Error, Active.
- [x] Full keyboard accessibility and visible focus rings (`focus-visible:ring-2 focus-visible:ring-aeris-accent`).
