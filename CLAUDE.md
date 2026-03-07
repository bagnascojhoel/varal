# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Run the production server
npm run typecheck    # TypeScript type check (no lint or test scripts exist)
```

## Running E2E Tests

After completing a major change (new feature, significant refactor, API change), run the API e2e tests:

```bash
cd e2e && npm test
```

This requires the Next.js dev server to be running (Playwright starts it automatically via `webServer` config).

**Exception**: The `rapid-prototyper` agent is exempt from this requirement.

## Architecture

**"Varal"** — a Next.js 16 (App Router) app that answers "should I
wash my clothes today?" based on the day's rain forecast from the Open-Meteo
API.

### Layer Structure (Ports & Adapters / Hexagonal)

```
src/
  core/
    domain/                        # Pure business logic (no fetch, no React)
      day-forecast.ts              # DayForecast entity class with static build()
      location.ts                  # Location aggregate root class
      wash-decision.ts             # WashDecision interface + classifier functions
      time-state.ts                # enum TimeState
      weather-state.ts             # enum WeatherState
      window-state.ts              # enum WindowState
      bar-state.ts                 # enum BarState
      weather-repository.ts        # WeatherRepository port interface + token
      localization-repository.ts   # LocalizationRepository port interface + token
    application-services/
      forecast-service.ts          # ForecastService (@injectable) + ForecastPageResponse
      localization-service.ts      # LocalizationService (@injectable)
    infrastructure/
      rest/
        weather-repository-open-meteo-adapter.ts  # @injectable, implements WeatherRepository
        location-repository-adapter.ts            # @injectable, implements LocalizationRepository
        geocoding-client-service.ts               # internal HTTP helper (not a port)
        viacep-client-service.ts                  # internal HTTP helper (not a port)
        types/
          open-meteo.ts                           # Open-Meteo API response types
    ContainerConfig.ts             # Inversify DI container bindings
  app/                             # Next.js App Router (driving adapter)
    page.tsx                       # Server component: resolves container directly
    layout.tsx                     # Root layout
    globals.css
    _components/                   # React components
      DayCard.tsx                  # Forecast card (was WashResult.tsx)
      LocationPicker.tsx
      CarouselTrack.tsx
      LiveClock.tsx
      LocationDetector.tsx
    api/
      forecast/route.ts            # GET /api/forecast
      wash-recommendation/route.ts # GET /api/wash-recommendation
      cep/route.ts                 # GET /api/cep
      docs/route.ts                # Swagger UI
      openapi/route.ts             # OpenAPI spec
```

Path alias `@/*` resolves to `./src/`.

### Key Patterns

- **Ports & Adapters**: Domain defines port interfaces; infrastructure adapters
  implement them; Inversify wires everything in `ContainerConfig.ts`.
- **Inversify DI**: `@injectable()` on adapter/service classes; `@inject(TOKEN)`
  in constructors; container resolved at route/page boundaries.
- **`core/` uses classes, interfaces, enums** — entities are classes; port
  contracts are interfaces; discriminated states are enums.
- **`app/` uses plain JS objects** — components work with plain destructurable
  objects; no class instantiation in UI code.
- **Server components resolve container directly** — `page.tsx` calls
  `container.get(FORECAST_SERVICE).getForecast(lat, lon)` with no self-fetch.
- **Server Components First**: `app/page.tsx` is a server component;
  client components (`"use client"`) only when browser APIs are needed.
- **Type Safety**: All API boundaries validated with Zod (`app/api/`).

### Data Sources

- **Open-Meteo API**: Weather data fetched by `WeatherRepositoryOpenMeteoAdapter`.
- **Nominatim (OpenStreetMap)**: Reverse geocoding in `GeocodingClientService`.
- **ViaCEP**: Brazilian postal code lookup in `ViacepClientService`.

## Request Flow

1. User visits page → `src/app/page.tsx` (server component).
2. `LocationPicker` (client) resolves GPS or CEP and pushes `/?lat=X&lon=Y`.
3. `page.tsx` reads `searchParams` and calls
   `container.get(FORECAST_SERVICE).getForecast(lat, lon)`.
4. `ForecastService` calls `WeatherRepository.fetchForecast()` and
   `LocalizationRepository.fetchLocationByCoordinates()` in parallel.
5. `DayForecast.build()` classifies each day; `DayCard` renders the results.

API routes (`/api/forecast`, `/api/wash-recommendation`, `/api/cep`) are thin
Zod → container → response controllers.

## Conventions

- **No default exports** — use named exports throughout.
- **Server components by default** — add `"use client"` only when browser APIs
  are needed.
- **Business logic in `core/domain/`** — components and routes must not contain
  decision logic.
- **Fetch calls in `core/infrastructure/`** — domain and components must not
  call fetch directly.
- **DI tokens as `Symbol.for()`** — defined alongside their port interface.
- **Conventional Commits** — all commits follow the standard.

## Branch Workflow

At the start of every new work session, ask the user whether they want to switch to a new branch before making any changes.

Branch naming convention:
- `<developer-username>/<short-work-description>` — for general work (e.g. `bagnascojhoel/add-location-picker`)
- `<developer-username>/<story-number>` — when there is a numbered US/task (e.g. `bagnascojhoel/US-42`)

Never work directly on `main`.

## Skills

Project knowledge is available as skills in `.claude/skills/`. Key skills:
- `frontend-implementation` — theming, colors, typography, buttons, accessibility
- `ports-and-adapters` — architecture, DI wiring, adding new features
- `write-adr` — ADR template and writing guide
- `write-implementation-plan` — implementation plan template and guide
- `commit-message` — conventional commits quick-reference
- `product-context` — product vision, audience, scope boundaries, PRD template

## Branch Workflow

At the start of every new work session, ask the user whether they want to switch to a new branch before making any changes.

Branch naming convention:
- `<developer-username>/<short-work-description>` — for general work (e.g. `bagnascojhoel/add-location-picker`)
- `<developer-username>/<story-number>` — when there is a numbered US/task (e.g. `bagnascojhoel/US-42`)

Never work directly on `main`.

## AI Agent Documentation

The `.ai/` directory contains per-feature ADRs, design mockups, and product docs.
See `.ai/AGENTS.md` for the directory overview.

**Feature decisions are persisted in** `.ai/features/<feature-name>/`.
