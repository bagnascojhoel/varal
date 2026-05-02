## Why

Today Varal answers "can I wash today?" with a single binary decision. US-01
reframes the core question to "what can I wash today?" — scaffolding the
clothing category recommendation surface in the application, API, and UI layers
so users see per-category tags on each day card. The domain classifier that
differentiates recommendations by category weight is intentionally deferred to a
follow-up story.

## What Changes

- Introduce a `ClothingRecommendation` type (`RECOMENDAR` / `CONDICIONAL` /
  `EVITAR`) as a domain type.
- Expose
  `clothingRecommendations: Record<ClothingWeightCategory, ClothingRecommendation>`
  on `ForecastDayDto`. The application service populates it with a stub derived
  from the existing binary `WashDecision` (all categories receive `RECOMENDAR`
  when `canWash` is true, `EVITAR` otherwise) until the domain classifier story
  is complete.
- Update API route Zod schemas to include `clothingRecommendations` in the
  response.
- Render clothing category tags at the bottom of each `DayCard` in the carousel
  — one tag per category, showing a color indicator and the category name in
  Portuguese.
- **Remove** the "Janelas do dia" (morning / afternoon window pills) section
  from `DayCard`.

## Out of Scope

- Per-category classifier algorithm and weather thresholds (deferred to domain
  story).
- New Open-Meteo fields (`relative_humidity_2m`, `wind_speed_10m`,
  `sunshine_duration`) and corresponding `DayForecast` entity changes (deferred
  to domain story).
- Click/tap actions on clothing tags (display-only in this US).
- Delicate / fabric-specific categories beyond the five weight tiers.
- User-configurable drying environment (`Ambiente de Secagem`) — later US.
- User-configurable pickup window (`Janela de Recolhimento`) — later US.
- The weather art / atmospheric phrase overhaul — separate US.

## Capabilities

### New Capabilities

- `clothing-type-recommendation`: Clothing category tags on each day card
  showing `RECOMENDAR`/`CONDICIONAL`/`EVITAR` per `ClothingWeightCategory`. Stub
  implementation in this story; real classifier added in a follow-up.

### Modified Capabilities

_(none — no existing spec files exist yet)_

## UI / UX Design

The reference mockup is at `product/design/home/latest/index.html` (v5). Key
points:

- Clothing tags appear at the bottom of each day card, below the hourly
  timeline.
- Five tags in canonical order: Extra Leve → Leve → Médio → Pesado → Extra
  Pesado.
- Tags are small chips with `flex-wrap` layout (two lines on narrow cards).
- Each tag: a colored dot indicator (green / amber / red) + category name label.
- Three visual states: `RECOMENDAR` → green, `CONDICIONAL` → amber, `EVITAR` →
  red.
- Tags are display-only; no tap action defined.
- The "Janelas do dia" section (morning / afternoon window pills) is removed
  from `DayCard`.

## Impact

- **Domain**: `src/core/domain/wash-decision.ts` — new `ClothingRecommendation`
  type only (no classifier).
- **Application service**:
  `src/core/application-services/forecast-application-service.ts` — add
  `clothingRecommendations` to `ForecastDayDto`; stub computation from existing
  `WashDecision`.
- **UI**: `src/app/_components/DayCard.tsx` — add clothing tag section, remove
  window pills.
- **i18n**: `messages/` — add keys for five category names and recommendation
  state labels.
- **API routes**: `/api/forecast` and `/api/wash-recommendation` — Zod schema
  updates.
