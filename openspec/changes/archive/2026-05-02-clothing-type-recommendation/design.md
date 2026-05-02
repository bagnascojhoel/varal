## Context

Varal currently classifies each day with a single binary `WashDecision`
(`canWash: boolean`) based on precipitation probability and sum. The domain
already has `ClothingWeightCategory` (EXTRA_LIGHT → EXTRA_HEAVY) defined but
unused in recommendations.

This change scopes to the **application, API, and UI layers only**. The domain
classifier (thresholds, new weather signals, `DayForecast` entity changes) is
deferred to a follow-up story. The goal here is to scaffold the full surface —
DTO field, API schema, UI tags — so the domain story can drop in real logic
without touching the presentation layer.

## Goals / Non-Goals

**Goals:**

- Define the `ClothingRecommendation` type needed by DTO and UI.
- Add `clothingRecommendations` to `ForecastDayDto` with a stub derived from the
  existing binary decision.
- Update API route Zod schemas to reflect the new DTO field.
- Render clothing category tags on each `DayCard` and remove the "Janelas do
  dia" window pills.

**Non-Goals:**

- Per-category classifier algorithm and weather thresholds (deferred — domain
  story).
- New Open-Meteo fields and `DayForecast` entity changes (deferred — domain
  story). See Decision #2 below.
- User-configurable drying environment (US-04).
- User-configurable pickup window (US-06).
- Tap/click action on category tags.

## Decisions

### 1. `ClothingRecommendation` defined as a domain type, not in the application service

`ClothingRecommendation` (`RECOMENDAR | CONDICIONAL | EVITAR`) is placed in
`src/core/domain/wash-decision.ts` alongside `WashDecision`. It is a domain
concept — it describes the outcome of a classification of washing conditions —
even though the classifier function that produces it is deferred.

**Alternatives:**

- _Define in the application service_: avoids touching the domain before the
  classifier exists, but puts a domain concept in the wrong layer. The type
  would need to move later, causing churn. Rejected.

### 2. Stub implementation in the application service

`ForecastService` maps the existing `WashDecision.canWash` uniformly to all five
categories: `canWash → RECOMENDAR`, `!canWash → EVITAR`. `CONDICIONAL` will not
appear until the domain classifier story replaces this stub.

This is intentional scaffolding. The comment
`// TODO: replace with per-category classifier (domain story)` marks the stub
clearly in code.

**Alternatives:**

- _Hardcode per-category thresholds here_: moves domain logic into the
  application service. Rejected — contradicts the architectural rule that
  business logic lives in `core/domain/`.
- _Omit `clothingRecommendations` from the DTO until the classifier exists_:
  delays UI work, requiring the UI to change again in the domain story. Rejected
  — scaffolding now lets the domain story be a pure domain change.

### 3. Remove `WindowPill` / "Janelas do dia" from `DayCard`

The morning/afternoon window pills are superseded by the clothing category tags
as the primary decision-support element. Keeping both adds visual clutter. The
hourly timeline bars remain — they answer _when_ conditions are good without
duplicating the tag section.

**Alternatives:**

- _Keep window pills and add tags below_: original v4 design intent. Rejected
  based on the updated product direction decided during the explore session
  (design v5).

### 4. `ForecastDayDto` gains `clothingRecommendations` as a `Record`

```ts
clothingRecommendations: Record<ClothingWeightCategory, ClothingRecommendation>;
```

All five categories always present. `DayCard` iterates in canonical order
without needing to handle missing keys.

**Alternatives:**

- _Separate endpoint_: adds a network round-trip for data always needed
  alongside the forecast. Rejected.
- _Array of `{category, recommendation}` tuples_: less ergonomic for lookups;
  canonical order is enforced by the renderer anyway. Rejected.

## Risks / Trade-offs

- **Stub produces no `CONDICIONAL` state** → The amber/yellow tag will not
  appear in production until the domain story ships. The UI handles it
  correctly; users will just see all-green or all-red tags in this interim
  period. Acceptable given the scaffolding intent.
- **No afternoon-aware adjustment** → Full-day verdict even when only remaining
  hours matter. Deliberate simplification; future US can refine.
- **i18n surface grows** → 8 new message keys. Low risk.

## Open Questions

- Are the five category display names (`Extra Leve`, `Leve`, `Médio`, `Pesado`,
  `Extra Pesado`) final, or do they need shortening for narrow tag chips?
