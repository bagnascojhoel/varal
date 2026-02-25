# Implementation Plan: Ports & Adapters Architecture

## Summary

Migrate the project from its current flat structure (`domain/`, `services/`,
`components/`, `types/` at root) to the Ports & Adapters (hexagonal)
architecture described in `.ai/docs/next-architecture.md`. This introduces
domain entity classes, port interfaces, infrastructure adapters, application
services, and an Inversify DI container — decoupling business logic from
external APIs and framework concerns. Everything moves under `src/`, and the
server component switches from a self-calling API fetch to direct container
resolution.

**Key Architectural Principles:**

- **Domain dictates interfaces** — ports define what the domain needs; adapters
  plug in
- **Inversify for DI** — full container with `@injectable()` decorators,
  `@inject()` tokens, and environment-aware bindings, matching the architecture
  doc
- **`core/` uses classes, interfaces, and enums** — entities and value objects
  are classes; port contracts are interfaces; discriminated states are enums
- **`app/` (excluding `api/`) uses plain JS objects** — components work with
  plain destructurable objects for easier React state handling; no class
  instantiation in UI code
- **Flat domain folder** — no subfolders under `domain/`; files organized by
  business meaning
- **Server components resolve from container directly** — eliminates the
  self-fetch round-trip in `page.tsx`

---

## Analysis

### Current State

- **`domain/wash-decision.ts`** — Pure functions (determineWashDecision,
  determineTimeState, buildDayForecast, etc.) with no external dependencies
- **`services/open-meteo.ts`** — `fetchTodayPrecipitation()`, `fetchForecast()`
  calling Open-Meteo API directly
- **`services/geocoding.ts`** — `fetchCityName()` calling Nominatim reverse
  geocoding
- **`services/cep.ts`** — `fetchCoordinatesFromCep()` calling ViaCEP + Nominatim
- **`types/api.ts`** — Mix of domain types, value objects, and DTOs as plain
  interfaces (WashDecision, DayForecast, ForecastPageResponse, etc.)
- **`types/open-meteo.ts`** — OpenMeteoResponse (infrastructure-specific type)
- **`components/`** — WashResult (DayCard), LocationPicker, CarouselTrack,
  LiveClock, LocationDetector
- **`app/page.tsx`** — Server component that self-calls `/api/forecast` via
  `fetch()` with header sniffing
- **`app/api/`** — forecast, wash-recommendation, cep, docs, openapi routes
- **No DI** — all modules use direct imports; no container, no factory, no
  injection

### Impact Analysis

| Layer                    | Components Affected                                                  | Change Type                                                             |
| ------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Domain**               | `wash-decision.ts`, `types/api.ts`                                   | Entities become classes; state types become enums; simple types stay    |
| **Ports**                | NEW: WeatherRepository, LocalizationRepository                       | GeocodingRepository + CepRepository merged into LocalizationRepository  |
| **Infrastructure**       | `services/open-meteo.ts`, `services/geocoding.ts`, `services/cep.ts` | One adapter per port; geocoding/viacep become internal client services  |
| **Application Services** | NEW: ForecastService, LocalizationService                            | New orchestrator classes                                                |
| **Container**            | NEW: `ContainerConfig.ts`                                            | Inversify container wiring                                              |
| **UI**                   | `app/page.tsx`, all components, all API routes                       | Moved under `src/`, imports updated; components work with plain objects |
| **Config**               | `tsconfig.json`                                                      | Path alias, `experimentalDecorators`, `emitDecoratorMetadata`           |
| **Dependencies**         | `package.json`                                                       | Add `inversify`, `reflect-metadata`                                     |

---

## Target Structure

```
src/
  core/
    domain/
      day-forecast.ts                                ← NEW entity class (replaces DayForecast interface + buildDayForecast + pickPhrase)
      location.ts                                    ← NEW aggregate root class (lat, lon, cityName)
      wash-decision.ts                               ← WashDecision interface + classifier functions + determineTimeState
      time-state.ts                                  ← enum TimeState
      weather-state.ts                               ← enum WeatherState
      window-state.ts                                ← enum WindowState
      bar-state.ts                                   ← enum BarState
      weather-repository.ts                          ← WeatherRepository interface + token
      localization-repository.ts                     ← LocalizationRepository interface + token (replaces geocoding + cep ports)
    application-services/
      forecast-service.ts                            ← NEW (ForecastPageResponse interface lives here)
      localization-service.ts                        ← NEW (replaces CepLookupService)
    infrastructure/
      rest/
        weather-repository-open-meteo-adapter.ts     ← from services/open-meteo.ts
        location-repository-adapter.ts               ← NEW: implements LocalizationRepository, orchestrates both client services
        geocoding-client-service.ts                  ← from services/geocoding.ts (internal, not a port adapter)
        viacep-client-service.ts                     ← from services/cep.ts (internal, not a port adapter)
        types/
          open-meteo.ts                              ← from types/open-meteo.ts
    ContainerConfig.ts                               ← NEW Inversify wiring
  app/
    page.tsx
    layout.tsx
    globals.css
    _components/
      DayCard.tsx                                    ← from components/WashResult.tsx
      LocationPicker.tsx
      CarouselTrack.tsx
      LiveClock.tsx
      LocationDetector.tsx
    api/
      forecast/route.ts
      wash-recommendation/route.ts
      cep/route.ts
      docs/route.ts
      openapi/route.ts
```

---

## Proposed Solution

### Overview

Move all source code under `src/`. Establish three-ring architecture: domain
(innermost, entity classes + port interfaces + enums, all flat), infrastructure
REST adapters, application services. Wire via Inversify in `ContainerConfig.ts`.
API routes become thin controllers; the server component calls the container
directly.

### 1. Domain Layer Changes

#### 1.1 Entity: `DayForecast` class

**New file:** `src/core/domain/day-forecast.ts`

**Replaces:** `DayForecast` interface in `types/api.ts` + `buildDayForecast()` +
`pickPhrase()` in `wash-decision.ts`

`DayForecast` is the primary domain entity. It becomes a class with a
`static build()` factory.

```typescript
export class DayForecast {
  readonly date: string;
  readonly precipitationSum: number;
  readonly precipitationProbabilityMax: number;
  readonly decision: WashDecision;
  readonly weatherState: WeatherState;
  readonly hourlyPrecipitationProbability: number[];
  readonly morningWindow: WindowState;
  readonly afternoonWindow: WindowState;
  readonly stillUsable: boolean;
  readonly phrase: string; // computed at build time — NOT a getter, serializes to JSON correctly

  private constructor(fields: { ... }) { Object.assign(this, fields); }

  static build(
    date: string,
    precipSum: number,
    precipMax: number,
    hourly6to20: number[],
    stillUsable: boolean
  ): DayForecast { ... }
}
```

**Key decision:** `phrase` is a `readonly` own property, not a prototype getter.
`JSON.stringify()` serializes own properties only — getters on the prototype are
silently skipped.

#### 1.2 Aggregate root: `Location` class

**New file:** `src/core/domain/location.ts`

`Location` is the aggregate root returned by `LocalizationRepository`. It
represents a resolved geographic location with all data the application needs.

```typescript
export class Location {
  constructor(
    readonly lat: number,
    readonly lon: number,
    readonly cityName: string,
  ) {}
}
```

Replaces the old `CepCoordinates` interface. Both `fetchLocationByCep` and
`fetchLocationByCoordinates` return this type, giving the domain a single
concept for "a resolved place."

#### 1.3 Value object: `WashDecision`

**File:** `src/core/domain/wash-decision.ts`

`WashDecision` stays as a plain interface
(`{ canWash: boolean; reason: string }`). The stateless classifier functions
(`determineWashDecision`, `determineWeatherState`, `determineBarState`,
`determineWindowState`, `determineTimeState`) remain as module-level functions
in the same file.

#### 1.4 State types → enums, each in its own file

- `src/core/domain/time-state.ts` →
  `export enum TimeState { Morning = "morning", Afternoon = "afternoon", Night = "night" }`
- `src/core/domain/weather-state.ts` →
  `export enum WeatherState { Rainy = "rainy", Cloudy = "cloudy", Sunny = "sunny" }`
- `src/core/domain/window-state.ts` →
  `export enum WindowState { Clear = "clear", Unsure = "unsure", Rain = "rain" }`
- `src/core/domain/bar-state.ts` →
  `export enum BarState { Good = "good", Warn = "warn", Bad = "bad" }`

String enum values match the current literal strings exactly — CSS selectors and
API responses are unchanged.

No `types.ts` file. Every type lives co-located with what owns it:

- `WashDecision` → `wash-decision.ts`
- `ForecastPageResponse` → `forecast-service.ts`
- `Location` → `location.ts`

#### 1.5 Port: `LocalizationRepository` (merges geocoding + CEP)

**New file:** `src/core/domain/localization-repository.ts`

```typescript
export interface LocalizationRepository {
  fetchLocationByCep(cep: string): Promise<Location>;
  fetchLocationByCoordinates(lat: number, lon: number): Promise<Location>;
}

export const LOCALIZATION_REPOSITORY = Symbol.for('LocalizationRepository');
```

Replaces the former separate `GeocodingRepository` and `CepRepository` ports.
Both concerns share the same aggregate root (`Location`) and belong to the same
domain concept — geographic localization.

#### 1.6 Port: `WeatherRepository` (unchanged)

**New file:** `src/core/domain/weather-repository.ts`

- `fetchTodayPrecipitation(lat, lon)` →
  `Promise<{ precipitationSum: number; precipitationProbabilityMax: number }>`
- `fetchForecast(lat, lon, currentHour)` → `Promise<DayForecast[]>`
- Export: `WEATHER_REPOSITORY = Symbol.for("WeatherRepository")`

---

### 2. Infrastructure Layer Changes

#### 2.1 WeatherRepositoryOpenMeteoAdapter

**File:**
`src/core/infrastructure/rest/weather-repository-open-meteo-adapter.ts`

`@injectable()` class implementing `WeatherRepository`. Wraps current
`services/open-meteo.ts` logic. Calls `DayForecast.build()` instead of
`buildDayForecast()`.

- `OpenMeteoError` stays here (infrastructure concern)
- `types/open-meteo.ts` → `src/core/infrastructure/rest/types/open-meteo.ts`

#### 2.2 LocationRepositoryAdapter

**File:** `src/core/infrastructure/rest/location-repository-adapter.ts`

`@injectable()` class implementing `LocalizationRepository`. Orchestrates the
two internal client services.

```typescript
@injectable()
export class LocationRepositoryAdapter implements LocalizationRepository {
  private readonly geocodingClient = new GeocodingClientService();
  private readonly viacepClient = new ViacepClientService();

  async fetchLocationByCoordinates(
    lat: number,
    lon: number,
  ): Promise<Location> {
    const cityName = await this.geocodingClient.fetchCityName(lat, lon);
    return new Location(lat, lon, cityName ?? '');
  }

  async fetchLocationByCep(cep: string): Promise<Location> {
    const result = await this.viacepClient.fetchCoordinatesFromCep(cep);
    return new Location(result.lat, result.lon, result.cityName);
  }
}
```

#### 2.3 GeocodingClientService (internal)

**File:** `src/core/infrastructure/rest/geocoding-client-service.ts`

Plain class (not `@injectable()` — not a port, just an HTTP client helper).
Wraps current `services/geocoding.ts` logic. Used only by
`LocationRepositoryAdapter`.

#### 2.4 ViacepClientService (internal)

**File:** `src/core/infrastructure/rest/viacep-client-service.ts`

Plain class (not `@injectable()`). Wraps current `services/cep.ts` logic.
`CepError` stays here. Used only by `LocationRepositoryAdapter`.

---

### 3. Application Services + Container

#### 3.1 ForecastService

**File:** `src/core/application-services/forecast-service.ts`

`@injectable()` class. Constructor: `@inject(WEATHER_REPOSITORY)`,
`@inject(LOCALIZATION_REPOSITORY)`.

**`ForecastPageResponse` interface** lives in this file (co-located with the
service that produces it).

**Method:** `getForecast(lat, lon)` → `Promise<ForecastPageResponse>`

- `Promise.all([weatherRepository.fetchForecast(...), localizationRepository.fetchLocationByCoordinates(...)])`
- Calls `determineTimeState()` from domain
- Returns assembled `ForecastPageResponse` (uses `location.cityName` for
  display)

Export: `FORECAST_SERVICE = Symbol.for("ForecastService")`

#### 3.2 LocalizationService

**File:** `src/core/application-services/localization-service.ts`

Replaces the old `CepLookupService`. `@injectable()` class. Constructor:
`@inject(LOCALIZATION_REPOSITORY)`.

**Method:** `lookupByCep(cep)` → `Promise<Location>`

Export: `LOCALIZATION_SERVICE = Symbol.for("LocalizationService")`

The `/api/cep` route uses this to resolve a CEP to a `Location` and returns
`{ lat, lon, cityName }` to the client.

#### 3.3 ContainerConfig

**File:** `src/core/ContainerConfig.ts`

```typescript
import 'reflect-metadata';
import { Container } from 'inversify';

const container = new Container();

container
  .bind<WeatherRepository>(WEATHER_REPOSITORY)
  .to(WeatherRepositoryOpenMeteoAdapter)
  .inSingletonScope();
container
  .bind<LocalizationRepository>(LOCALIZATION_REPOSITORY)
  .to(LocationRepositoryAdapter)
  .inSingletonScope();
container
  .bind<ForecastService>(FORECAST_SERVICE)
  .to(ForecastService)
  .inSingletonScope();
container
  .bind<LocalizationService>(LOCALIZATION_SERVICE)
  .to(LocalizationService)
  .inSingletonScope();

export { container };
```

---

### 4. UI Layer Changes

#### 4.1 Move files

- `app/` → `src/app/`
- `components/` → `src/app/_components/`
- `WashResult.tsx` renamed to `DayCard.tsx`

#### 4.2 Update `tsconfig.json`

- Path alias: `"@/*": ["./*"]` → `"@/*": ["./src/*"]`
- Add `"experimentalDecorators": true`, `"emitDecoratorMetadata": true`

#### 4.3 Update `page.tsx` — direct container call

`ForecastContent` drops its self-fetch:

```typescript
import { container } from '@/core/ContainerConfig';
import {
  FORECAST_SERVICE,
  ForecastService,
} from '@/core/application-services/forecast-service';
const data = await container
  .get<ForecastService>(FORECAST_SERVICE)
  .getForecast(lat, lon);
```

Removes: `headers()`, URL construction, internal `fetch()`.

#### 4.4 Components work with plain objects

`DayCard` receives a `DayForecast` class instance as a prop. All fields are
`readonly` own properties — destructuring works normally. No class instantiation
in UI code.

#### 4.5 API routes become thin controllers

Parse/validate (Zod) → `container.get(TOKEN)` → call method → return response.

---

### 5. Configuration Changes

**New dependencies:** `inversify`, `reflect-metadata`

**Files moved (old → new):**

| Old                       | New                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `types/api.ts`            | Split: enums → own files; `WashDecision` → `wash-decision.ts`; `ForecastPageResponse` → `forecast-service.ts` |
| `types/open-meteo.ts`     | `src/core/infrastructure/rest/types/open-meteo.ts`                                                            |
| `domain/wash-decision.ts` | `src/core/domain/wash-decision.ts` (WashDecision interface + classifier fns)                                  |
| —                         | `src/core/domain/day-forecast.ts` (NEW entity class)                                                          |
| —                         | `src/core/domain/location.ts` (NEW aggregate root class)                                                      |
| `services/open-meteo.ts`  | `src/core/infrastructure/rest/weather-repository-open-meteo-adapter.ts`                                       |
| `services/geocoding.ts`   | `src/core/infrastructure/rest/geocoding-client-service.ts` (internal helper)                                  |
| `services/cep.ts`         | `src/core/infrastructure/rest/viacep-client-service.ts` (internal helper)                                     |
| `components/*`            | `src/app/_components/*`                                                                                       |
| `app/*`                   | `src/app/*`                                                                                                   |

**Directories deleted:** `domain/`, `services/`, `types/`, `components/`

---

## Implementation Order

1. **Phase 1** — Install `inversify` + `reflect-metadata`; update tsconfig (path
   alias, decorator flags)
2. **Phase 2** — Move `app/` → `src/app/`, `components/` →
   `src/app/_components/`; fix imports; typecheck
3. **Phase 3** — Create `src/core/domain/`:
   - `day-forecast.ts` entity class
   - `location.ts` aggregate root
   - `wash-decision.ts` (WashDecision interface + classifier functions)
   - `time-state.ts`, `weather-state.ts`, `window-state.ts`, `bar-state.ts`
   - `weather-repository.ts`, `localization-repository.ts`
   - Delete old `domain/` + `types/`
4. **Phase 4** — Create `src/core/infrastructure/rest/`:
   - `weather-repository-open-meteo-adapter.ts` (`@injectable()`)
   - `geocoding-client-service.ts` (plain class)
   - `viacep-client-service.ts` (plain class)
   - `location-repository-adapter.ts` (`@injectable()`, orchestrates both client
     services)
   - Delete old `services/`
5. **Phase 5** — Create `src/core/application-services/` +
   `src/core/ContainerConfig.ts`
6. **Phase 6** — Update API routes and `page.tsx` to use container; update
   component imports
7. **Phase 7** — Delete remaining old dirs; update CLAUDE.md; typecheck + build

---

## Validation

**Automated:**

1. `npm run typecheck` — zero errors
2. `npm run build` — clean production build

**Manual:**

- [ ] GPS location flow → forecast cards render (cityName shown correctly)
- [ ] CEP input flow → location resolves, forecast displays
- [ ] `GET /api/forecast?latitude=-23.5&longitude=-46.6` — same response
      (including `phrase` field)
- [ ] `GET /api/wash-recommendation?latitude=-23.5&longitude=-46.6` — same
      response
- [ ] `GET /api/cep?cep=01001000` — returns `{ lat, lon, cityName }`
- [ ] Day/night theming works (`data-time` attribute still set to enum string
      value)

---

## References

- [Next Architecture Doc](../../.ai/docs/next-architecture.md)
- [Style Guide](../../.ai/docs/style-guide.md)
- [UI/UX Rules](../../.ai/docs/ui-ux-rules.md)
- [Semantic Commits](../../.ai/docs/semantic-commits.md)
