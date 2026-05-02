## ADDED Requirements

### Requirement: ClothingRecommendation type defined in domain
The domain SHALL export a `ClothingRecommendation` type with three values: `RECOMENDAR`, `CONDICIONAL`, and `EVITAR`.

#### Scenario: Type is importable from domain layer
- **WHEN** application service or UI code imports `ClothingRecommendation`
- **THEN** the type resolves from `src/core/domain/wash-decision.ts` without type errors

### Requirement: Recommendation exposed on forecast day DTO
The `ForecastDayDto` returned by `ForecastService` SHALL include a `clothingRecommendations` field containing a recommendation for every weight category.

#### Scenario: DTO includes all five categories
- **WHEN** `ForecastService.getForecast()` is called with valid coordinates
- **THEN** each item in the returned array has a `clothingRecommendations` object with keys `EXTRA_LIGHT`, `LIGHT`, `MEDIUM`, `HEAVY`, `EXTRA_HEAVY` and values that are valid `ClothingRecommendation` values

#### Scenario: Stub maps canWash to uniform recommendation
- **WHEN** the forecast day has `canWash: true` (precipitation probability below threshold)
- **THEN** all five categories receive `RECOMENDAR`

#### Scenario: Stub maps cannot-wash to EVITAR
- **WHEN** the forecast day has `canWash: false` (precipitation probability at or above threshold)
- **THEN** all five categories receive `EVITAR`

### Requirement: Clothing category tags rendered on each day card
The `DayCard` component SHALL render one tag per clothing weight category at the bottom of the card, showing the recommendation state for that category.

#### Scenario: Tags displayed in canonical order
- **WHEN** a `DayCard` is rendered with `clothingRecommendations` data
- **THEN** five tags appear in order: Extra Leve, Leve, Médio, Pesado, Extra Pesado

#### Scenario: RECOMENDAR state shown in green
- **WHEN** a category has `RECOMENDAR`
- **THEN** the tag displays a green indicator

#### Scenario: CONDICIONAL state shown in amber
- **WHEN** a category has `CONDICIONAL`
- **THEN** the tag displays an amber indicator

#### Scenario: EVITAR state shown in red
- **WHEN** a category has `EVITAR`
- **THEN** the tag displays a red indicator

#### Scenario: Tags wrap to multiple lines on narrow cards
- **WHEN** the card width cannot fit all five tags in one row
- **THEN** tags wrap to a second line without clipping or overflow

### Requirement: "Janelas do dia" section removed from DayCard
The morning and afternoon window pills SHALL be removed from the `DayCard` component.

#### Scenario: No window pills rendered
- **WHEN** a `DayCard` is rendered in any time state (morning, afternoon, night)
- **THEN** neither the morning window pill nor the afternoon window pill is present in the DOM
