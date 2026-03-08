# Varal

**Varal** is a Next.js 16 (App Router) web app that answers one question:
_should I wash my clothes today?_ It fetches a 4-day rain forecast from the
Open-Meteo API and classifies each day into a wash recommendation, giving you
morning and afternoon laundry windows at a glance.

## Features

- **4-day forecast cards** — Today, tomorrow, and two more days ahead
- **Wash recommendation** — `canWash` decision based on precipitation
  probability and daily rainfall sum
- **Hourly bar chart** — Precipitation probability from 6h–20h, inverted to show
  "chance of drying naturally"
- **Morning / Afternoon windows** — Quick summary pills (Clear / Unsure / Rain)
  per half-day
- **Time-aware UI** — Day/night theming and "past" bars greyed out as the day
  progresses
- **Location input** — GPS detection or Brazilian CEP (postal code) lookup via
  ViaCEP
- **Live clock** — Displays current time in the header (client component)
- **OpenAPI / Swagger docs** — Available at `/api/docs`

## Tech Stack

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| Framework            | Next.js 16, React 19 (App Router)    |
| Styling              | Tailwind CSS v4                      |
| Dependency Injection | Inversify                            |
| Validation           | Zod                                  |
| Language             | TypeScript 5                         |
| Weather data         | [Open-Meteo](https://open-meteo.com) |
| Geocoding            | Nominatim (OpenStreetMap)            |
| CEP lookup           | [ViaCEP](https://viacep.com.br)      |

## Getting Started

```bash
npm install
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build (runs Prettier, then next build)
npm run start        # Run the production server
npm run typecheck    # TypeScript type check
```

## Architecture

The project follows a **Ports & Adapters (Hexagonal)** architecture with
Inversify for dependency injection.

```
src/
  core/
    domain/                        # Pure business logic — no fetch, no React
      day-forecast.ts              # DayForecast entity (static build() factory)
      wash-decision.ts             # WashDecision interface + classifier functions
      location.ts                  # Location aggregate root
      weather-repository.ts        # WeatherRepository port interface + DI token
      localization-repository.ts   # LocalizationRepository port interface + DI token
      time-state.ts / weather-state.ts / window-state.ts / bar-state.ts
    application-services/
      forecast-service.ts          # Orchestrates weather + geocoding, returns ForecastPageResponse
      localization-service.ts      # CEP/coordinate resolution
    infrastructure/
      rest/
        weather-repository-open-meteo-adapter.ts  # Implements WeatherRepository
        location-repository-adapter.ts            # Implements LocalizationRepository
        geocoding-client-service.ts               # Nominatim HTTP helper
        viacep-client-service.ts                  # ViaCEP HTTP helper
    ContainerConfig.ts             # Inversify container bindings
  app/                             # Next.js App Router (driving adapter)
    page.tsx                       # Server component: resolves DI container directly
    _components/                   # React components
      DayCard.tsx                  # Per-day forecast card
      LocationPicker.tsx           # GPS / CEP location input
      CarouselTrack.tsx            # Horizontal swipeable carousel
      LiveClock.tsx                # Client-side live clock
      LocationDetector.tsx         # Browser geolocation helper
    api/
      forecast/route.ts            # GET /api/forecast
      wash-recommendation/route.ts # GET /api/wash-recommendation
      cep/route.ts                 # GET /api/cep
      docs/route.ts                # Swagger UI
      openapi/route.ts             # OpenAPI spec
```

### Request Flow

1. User visits `/?lat=X&lon=Y` (or is prompted to pick a location).
2. `page.tsx` (server component) resolves `ForecastService` from the Inversify
   container.
3. `ForecastService.getForecast(lat, lon)` calls **Open-Meteo** and
   **Nominatim** in parallel.
4. `DayForecast.build()` classifies each day's weather and wash recommendation.
5. `DayCard` renders the result inside a `CarouselTrack`.

### Key Conventions

- **No default exports** — named exports throughout.
- **Business logic lives in `core/domain/`** — components and routes contain no
  decision logic.
- **Fetch calls live in `core/infrastructure/`** — domain and components never
  call `fetch` directly.
- **Server components by default** — `"use client"` only when browser APIs are
  needed.
- **DI tokens as `Symbol.for()`** — defined alongside their port interface.
- **Conventional Commits** — see `.ai/docs/semantic-commits.md`.

## Business Logic

Wash decisions are computed in `src/core/domain/wash-decision.ts`:

| Condition                                               | Result              |
| ------------------------------------------------------- | ------------------- |
| `precipProbabilityMax < 40%` **and** `precipSum < 1 mm` | ✅ `canWash: true`  |
| Otherwise                                               | ❌ `canWash: false` |

Weather state thresholds:

| Threshold                                  | State  |
| ------------------------------------------ | ------ |
| `precipProb >= 60%` or `precipSum >= 5 mm` | Rainy  |
| `precipProb >= 20%` or `precipSum >= 1 mm` | Cloudy |
| Below both                                 | Sunny  |

## API Routes

| Route                                    | Description                        |
| ---------------------------------------- | ---------------------------------- |
| `GET /api/forecast?lat=&lon=`            | 4-day forecast with wash decisions |
| `GET /api/wash-recommendation?lat=&lon=` | Single wash recommendation         |
| `GET /api/cep?cep=`                      | CEP → coordinates lookup           |
| `GET /api/docs`                          | Swagger UI                         |
| `GET /api/openapi`                       | Raw OpenAPI JSON spec              |

## AI Agent Documentation

The `.ai/` directory contains project-specific standards for AI agents:

- `.ai/AGENTS.md` — directory overview
- `.ai/docs/ui-ux-rules.md` — UI/UX rules (read before any frontend work)
- `.ai/docs/style-guide.md` — visual style guide
- `.ai/templates/ADR.md` — architecture decision record template
- `.ai/templates/implementation-plan.md` — multi-file feature planning template
