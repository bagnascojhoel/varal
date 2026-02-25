# Presentation Layer: `src/app/`

The `src/app/` directory is the **driving adapter** (presentation layer) of this
Ports & Adapters architecture. It contains no business logic — it translates
between the outside world (HTTP requests, browser UI) and the application core.

## Two Types of Adapters

### REST API Adapters — `src/app/api/`

Each route under `src/app/api/` is a **REST API port adapter**. Its sole
responsibilities are:

1. Parse and validate the incoming HTTP request (Zod).
2. Resolve the relevant application service from the DI container.
3. Call the service and serialize the result as an HTTP response.

No domain logic, no data transformation beyond serialization, no direct
infrastructure calls.

```
src/app/api/
  forecast/route.ts           # GET /api/forecast
  wash-recommendation/route.ts # GET /api/wash-recommendation
  cep/route.ts                # GET /api/cep
```

### UI Adapters — `src/app/**/*.tsx`

Every `.tsx` file under `src/app/` is a **UI port adapter**. Server components
resolve the DI container directly and pass plain objects to client components.
Client components (`"use client"`) handle browser-specific concerns (events,
browser APIs) but contain no domain decisions.

```
src/app/
  page.tsx                  # Server component: entry point, resolves container
  layout.tsx                # Root layout
  _components/              # React component adapters
    DayCard.tsx
    LocationPicker.tsx
    LiveClock.tsx
    ...
```

## Rules for This Layer

- **No domain logic** — decisions belong in `src/core/domain/` or
  `src/core/application-services/`.
- **No direct fetch calls** — data access belongs in
  `src/core/infrastructure/`.
- **No class instantiation** — components work with plain destructurable
  objects; class instances come from the DI container.
- **Server components by default** — add `"use client"` only when browser APIs
  or interactivity require it.
- **Zod at the boundary** — API routes validate all inputs with Zod before
  passing them to the core.
