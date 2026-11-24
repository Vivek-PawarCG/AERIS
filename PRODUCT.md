# AERIS — Atmospheric Exposure & Resilient Indoor Strategy

## 1. Product Purpose & Problem Context
Severe winter smog and urban air pollution pose an acute public health emergency in dense metropolitan regions (e.g., Indo-Gangetic Plain, Salt Lake Basin, Central Valley, Beijing, Eastern Europe). During winter, meteorological temperature inversions trap high concentrations of fine particulate matter ($PM_{2.5}$ and $PM_{10}$), nitrogen dioxide ($NO_2$), and volatile organic compounds ($VOCs$) close to the ground.

Most current air quality apps only report passive numbers ("AQI is 342 - Hazardous"). Families and communities are left helpless, not knowing:
1. When is the diurnal peak and when does the inversion layer lift?
2. What are the highest-ROI, low-cost indoor interventions (e.g. Corsi-Rosenthal boxes, wet-mopping vs vacuuming, door threshold sealing)?
3. How to safely schedule daily routines (school commutes, grocery trips, ventilation)?
4. What is the quantified, direct physiological and community impact of choosing low-emission alternatives?

AERIS bridges this gap by acting as an intelligent, evidence-based atmospheric resilience companion that provides:
- Live scientific atmospheric diagnostics (inversion layer risk, diurnal forecast, hazardous pollutant breakdown).
- Vulnerability-tailored household profiling (infants, asthmatic elders, pets, home ventilation characteristics).
- Dynamic exposure minimization routine optimizer.
- DIY Indoor Air Quality (IAQ) engineering lab with a verified Clean Air Delivery Rate (CADR) & Corsi-Rosenthal calculator.
- Quantified impact telemetry (respiratory particulate avoided, community emissions prevented).
- Context-grounded GenAI atmospheric assistant with zero slop and high-reliability local offline fallback.

---

## 2. User Personas
1. **Priya & Arjun (Urban Family with Infant and Grandparent)**
   - Lives in an urban apartment building during winter inversions.
   - Needs: Exact times to seal/open windows, non-toxic infant room protection, safe commuting windows for grandparent's morning walks.
2. **Community & Resident Welfare Organizer (RWA)**
   - Manages localized residential cluster or housing cooperative.
   - Needs: Low-cost indoor filtration guidance (DIY CR-box setups), communal carpooling/clean commute coordination, aggregate neighborhood pollution avoidance metrics.
3. **Active Urban Commuter / Asthmatic Individual**
   - High personal vulnerability to bronchial irritation.
   - Needs: Real-time route and routine alternatives, N95 seal reminders, exercise reschedule advice.

---

## 3. Core Functional Pillars
1. **Atmospheric Monitor & Inversion Analysis**: Real-time multi-pollutant breakdown ($PM_{2.5}$, $PM_{10}$, $NO_2$, AQI) with diurnal diurnal prediction curve.
2. **Household Vulnerability Profiler**: Customizes recommendations based on vulnerable occupants, home sealing level, cooking fuel type, and heating sources.
3. **Daily Routine Exposure Optimizer**: Time-blocked schedule highlighting peak danger zones vs thermal lift mitigation windows.
4. **Indoor Air Quality (IAQ) Engineering Lab**: Evidence-based DIY mitigation guides, Corsi-Rosenthal Box builder, CADR room sizing tool, and wet-mopping protocols.
5. **Sustainable Alternatives & Impact Engine**: Quantifies avoided lung intake ($\mu g$ of $PM_{2.5}$) and prevented greenhouse emissions ($g\ CO_2e$, $g\ NO_x$) with explicit mathematical models.
6. **GenAI Environmental Health Assistant**: Context-aware assistant grounded in WHO and EPA air quality guidelines, with full offline scientific fallback and Gemini API support.

---

## 4. Evaluation Alignment
- **Code Quality**: Strictly typed TypeScript, modular domain logic, reusable atomic components, zero bloated abstractions.
- **Security**: No hardcoded API keys; safe client storage; sanitization of user prompts; zero remote code execution.
- **Efficiency**: Pure CSS/Tailwind layout, lightweight client-side computation, zero unnecessary re-renders, fast bundle.
- **Testing**: Complete Vitest test suite covering mathematical impact formulas, AQI risk calculators, and critical UI interactions.
- **Accessibility**: Strict WCAG 2.1 AA compliance, keyboard navigation, semantic regions, ARIA labels, high contrast ratios.
- **Problem Statement Alignment**: Direct, zero-slop solution built specifically for severe winter smog and urban air pollution resilience.
