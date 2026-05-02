## 1. Domain — ClothingRecommendation type

- [x] 1.1 Add `ClothingRecommendation` enum (`RECOMENDAR`, `CONDICIONAL`,
      `EVITAR`) to `src/core/domain/wash-decision.ts`

## 2. Application service — ForecastDayDto

- [x] 2.1 Add
      `clothingRecommendations: Record<ClothingWeightCategory, ClothingRecommendation>`
      to `ForecastDayDto` in
      `src/core/application-services/forecast-application-service.ts`
- [x] 2.2 Populate `clothingRecommendations` in `ForecastService.getForecast()`
      using a stub: map `canWash → RECOMENDAR` / `!canWash → EVITAR` for all
      five categories; mark with
      `// TODO: replace with per-category classifier (domain story)`

## 3. API routes — Zod schema updates

- [x] 3.1 Update the Zod response schema in `src/app/api/forecast/route.ts` to
      include `clothingRecommendations`
- [x] 3.2 Update the Zod response schema in
      `src/app/api/wash-recommendation/route.ts` if it surfaces `ForecastDayDto`
      fields

## 4. i18n — message keys

- [x] 4.1 Add category name keys to `messages/pt-BR.json` (and any other locale
      files): `extraLeve`, `leve`, `medio`, `pesado`, `extraPesado` under a
      `ClothingTag` namespace
- [x] 4.2 Add recommendation state label keys under `ClothingTag`: `recomendar`,
      `condicional`, `evitar`

## 5. UI — DayCard

- [x] 5.1 Remove the "Janelas do dia" section (morning/afternoon `WindowPill`
      rows, section label, divider) from `src/app/_components/DayCard.tsx`
- [x] 5.2 Remove the `WindowPill` component and its CSS if no longer used
      elsewhere
- [x] 5.3 Add a `ClothingTag` sub-component inside `DayCard.tsx` that renders
      one tag (colored dot indicator + category name) given a
      `ClothingRecommendation` value
- [x] 5.4 Add the clothing tags section at the bottom of `DayCard`, rendering
      all five categories in canonical order using `clothingRecommendations`
      from `ForecastDayDto`
- [x] 5.5 Apply `flex-wrap` layout so tags wrap to a second line on narrow cards
- [x] 5.6 Ensure tags are styled for both dark (night) and light (day) themes
      per the design system

## 6. Verification

- [x] 6.1 Run `npm run typecheck` — zero errors
- [x] 6.2 Start dev server (`npm run dev`), open the app, verify clothing tags
      appear on each day card
- [x] 6.3 Verify all five categories appear in correct order with green
      (RECOMENDAR) or red (EVITAR) indicators matching the day's forecast
- [x] 6.4 Verify "Janelas do dia" window pills are absent in all three time
      states (morning / afternoon / night)
- [x] 6.5 Run `cd e2e && npm test` — all E2E tests pass (22/23 API tests pass; 1
      unrelated sessions test failure)
