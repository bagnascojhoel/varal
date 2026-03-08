# US-01 — Clothing-Type Recommendation

## Story

As a Washer, I want to receive a recommendation that distinguishes between types
of clothes — not just a single YES/NO — So that I can decide what goes in the
machine rather than whether to do laundry at all.

## Technical Description

The current domain model (`wash-decision.ts`) produces a single classification
for the day. This story requires extending the classification logic in
`core/domain/` to produce a per-clothing-type result. Each clothing category
(e.g. light cotton, heavy knitwear, bed sheets, delicates) has different drying
time requirements and sensitivities to humidity, UV index, wind speed, and
temperature. The `DayForecast` entity must carry a collection of per-category
recommendations. The `DayCard` component must render this breakdown. No changes
to external data sources are required — Open-Meteo already provides the
necessary variables.

> ⚠️ **Open question**: Which clothing categories should be supported in the
> initial version, and what are their domain names? The story examples (bed
> sheets, heavy knitwear, light cotton, delicates) are candidates but have not
> been formally confirmed.

---

## Tasks

### Design

Define the visual layout for the per-clothing-category recommendation breakdown
within the day card. Specify how each category's result (recommended / not
recommended / borderline) is communicated at a glance without overwhelming the
Washer. Produce the component design and any new iconography needed for each
clothing category.

### Front-End

Update the `DayCard` component to receive and render the per-clothing-category
recommendation breakdown from the domain layer. Replace (or extend) the current
single-outcome display with the categorised view produced by the design task.

### Back-End

Extend `wash-decision.ts` in `core/domain/` to classify each clothing category
independently based on weather variables, replacing the current single YES/NO
output. Introduce a domain type (e.g. `ClothingCategoryRecommendation`) to carry
per-category results within `DayForecast`.

#### Test Scenarios

**Scenario 1: All categories recommended on a clear day** Given the day's
forecast shows low rain probability, low humidity, high UV, and moderate wind
When the classification runs Then all clothing categories are classified as
recommended

**Scenario 2: No category recommended on a rainy day** Given the day's forecast
shows high rain probability When the classification runs Then all clothing
categories are classified as not recommended

**Scenario 3: Partial recommendation on a borderline day** Given the day has
moderate humidity unsuitable for heavy knitwear but acceptable for light cotton
When the classification runs Then light cotton is classified as recommended and
heavy knitwear is classified as not recommended

**Scenario 4: Each category is classified independently** Given clothing
categories have different weather sensitivities When the classification runs
Then the result carries a distinct outcome per category, not a single aggregated
result

### Weather Research

Determine the weather variable thresholds (humidity %, wind speed km/h, UV
index, temperature °C) for each clothing category that separate "will dry
adequately" from "won't dry in time" under typical Brazilian conditions.
Document these thresholds so they can be encoded into the domain classification
logic.
