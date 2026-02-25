# Architecture: Ports & Adapters for Next.js

This document describes how this project adapts the Ports & Adapters (Hexagonal)
architecture pattern to a Next.js 14 App Router application.

## Why Ports & Adapters in Next.js?

Next.js blurs the line between server and client, framework and application.
Without boundaries, domain logic leaks into API routes, data-fetching hooks, and
React components. Ports & Adapters draws a hard line: the **domain dictates
interfaces**, and everything else — frameworks, databases, external APIs — plugs
in as an adapter.

The payoff:

- Domain logic is testable without Next.js, React, or any HTTP layer.
- Swapping an external dependency means writing a new adapter, not rewriting
  business logic.
- The DI container makes wiring explicit and environment-aware (e.g., different
  adapters per environment).

## Layer Overview

```
src/
  core/                          # Framework-agnostic application core
    domain/                      # Ports (interfaces) + entities + domain services
    application-services/        # Use cases / orchestration
    infrastructure/              # Adapters implementing domain ports
    ContainerConfig.ts           # DI wiring (Inversify)
  app/                           # Next.js App Router (driving adapter)
    _components/                 # React components
    _lib/                        # Client-side hooks and utilities
  middleware.ts                  # Next.js middleware
```

## The Three Rings

### 1. Domain (innermost)

Location: `src/core/domain/`

The domain contains:

- **Entities** — plain TypeScript classes with no framework dependencies. They
  model the core concepts of the application and carry domain behaviour (e.g.,
  visibility rules, validation).
- **Ports** — interfaces that define what the domain _needs_ from the outside
  world. Each port is co-located with a DI token (`Symbol.for(...)`) in the same
  file.
- **Domain services** — classes that orchestrate multiple ports to fulfill a
  domain operation. They depend only on port interfaces, never on concrete
  adapters.

Ports fall into two categories:

- **Repository ports** — abstract data access (e.g., `FooRepository` with a
  `fetchAll()` method).
- **Infrastructure ports** — abstract cross-cutting concerns like HTTP
  (`HttpClient`) or logging (`Logger`).

### 2. Application Services (middle ring)

Location: `src/core/application-services/`

Application services are thin orchestrators that sit between the driving adapter
(Next.js pages) and the domain. They add cross-cutting concerns — such as
**caching**, **authorization checks**, or **error translation** — without
polluting domain logic.

### 3. Infrastructure (outermost — driven adapters)

Location: `src/core/infrastructure/`

Each adapter implements exactly one domain port. The naming convention is
`<PortName><Technology>Adapter`.

Examples of what adapters can back:

- A repository port backed by a REST API
- A repository port backed by static JSON files
- An `HttpClient` port backed by native `fetch` with logging
- A `Logger` port backed by a third-party error tracking SDK in production and
  `console` in development

The container selects which adapter to bind based on runtime environment,
keeping that decision outside the domain entirely.

## The Driving Adapter: Next.js App Router

The Next.js `app/` directory acts as the **driving adapter** — it is the entry
point that triggers domain operations. This is the key adaptation of Ports &
Adapters for Next.js:

```
Page (Server Component)
  → container.get(ApplicationService)
    → ApplicationService calls Domain Service
      → Domain Service calls Ports (interfaces)
        → Inversify resolves to Infrastructure Adapters
```

Page components know only about application service interfaces and domain types.
They have no knowledge of databases, external APIs, or caching internals.

### Why Server Components work well here

Next.js Server Components run on the server, where the DI container lives. There
is no need for a REST API layer between the UI and the domain — the page
directly resolves services from the container. This eliminates an entire layer
of boilerplate (API routes, fetch calls from the client) while still maintaining
architectural boundaries.

## Dependency Injection with Inversify

All wiring lives in `src/core/ContainerConfig.ts`. The container is a singleton
module-level instance.

### How a port gets wired

1. Define the interface and token in `src/core/domain/`:

   ```typescript
   export interface FooRepository {
     fetchAll(): Promise<Foo[]>;
   }
   export const FooRepositoryToken = Symbol.for('FooRepository');
   ```

2. Implement the adapter in `src/core/infrastructure/`:

   ```typescript
   @injectable()
   export class FooRestAdapter implements FooRepository { ... }
   ```

3. Bind in `ContainerConfig.ts`:

   ```typescript
   container.bind<FooRepository>(FooRepositoryToken).to(FooRestAdapter);
   ```

4. Inject in any domain or application service:
   ```typescript
   constructor(@inject(FooRepositoryToken) private fooRepository: FooRepository) {}
   ```

### Environment-aware bindings

The container selects adapters based on runtime environment:

```typescript
container
  .bind<Logger>(LoggerToken)
  .to(isProduction ? ProductionLoggerAdapter : ConsoleLoggerAdapter)
  .inSingletonScope();
```

## Data Flow: End to End

```
Browser request
  → Next.js middleware
    → Server Component (page)
      → container.get(ApplicationService)
        → ApplicationService (cross-cutting concerns, e.g. caching)
          → Domain Service
            → Ports resolved to Infrastructure Adapters
        → domain entities returned to page
      → React renders domain entities as components
```

## Key Design Decisions

### Domain entities are plain classes

Entities are simple TypeScript classes with no decorators and no framework
coupling. When an entity has many optional fields assembled from multiple
sources, use a Builder pattern to keep construction readable and enforce
required fields at build time.

### Partial failure tolerance

When multiple data sources are fetched in parallel, use `Promise.allSettled`
instead of `Promise.all`. This way, a failure in one source does not prevent the
rest from rendering. Each failed source should be logged and return an
empty/default value rather than crashing the page.

### Flat domain types with discriminated unions

Rather than deep class hierarchies for variant domain types, prefer
discriminated unions:

```typescript
type DomainItem = { itemType: ItemType } & (Foo | Bar | Baz);
```

This keeps the domain flat and lets React components switch on `itemType` with
simple conditional rendering.

## Adding a New Feature

To add a new domain concept end-to-end:

1. Create the entity in `src/core/domain/`.
2. Define the port interface and token in `src/core/domain/`.
3. Implement the adapter in `src/core/infrastructure/`.
4. Register the binding in `ContainerConfig.ts`.
5. Inject the port into the relevant domain service or application service.
6. Consume the application service from the relevant page component.
