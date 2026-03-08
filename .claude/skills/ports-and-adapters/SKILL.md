---
name: ports-and-adapters
description: Implement features following the project's hexagonal architecture with Inversify DI. Use when adding new domain entities, ports, infrastructure adapters, application services, or DI bindings, and when understanding the data flow between layers.
---

# Ports & Adapters Architecture

How this Next.js 16 project implements Hexagonal Architecture with Inversify DI.

## The Three Rings

```
src/
  core/                          # Framework-agnostic application core
    domain/                      # Ring 1 (innermost): ports, entities, domain services
    application-services/        # Ring 2: use-case orchestrators
    infrastructure/              # Ring 3: adapters implementing domain ports
    ContainerConfig.ts           # Inversify DI wiring
  app/                           # Driving adapter (Next.js App Router)
```

### Ring 1 — Domain (`src/core/domain/`)

- **Entities**: plain TypeScript classes, no framework deps
- **Ports**: interfaces defining what the domain needs from outside
  - Repository ports: abstract data access
  - Infrastructure ports: abstract cross-cutting concerns
- **DI tokens**: `Symbol.for(...)` co-located with port interface in same file
- **Domain services**: orchestrate multiple ports, depend only on interfaces

### Ring 2 — Application Services (`src/core/application-services/`)

- Thin orchestrators between driving adapter and domain
- Add cross-cutting concerns: caching, authorization, error translation
- Never contain domain logic

### Ring 3 — Infrastructure (`src/core/infrastructure/`)

- Each adapter implements exactly one domain port
- Naming: `<PortName><Technology>Adapter`
- Container selects adapter by runtime environment

## Driving Adapter — Next.js App Router (`src/app/`)

Two types of adapters:

### REST API adapters (`src/app/api/`)
1. Parse + validate HTTP request (Zod)
2. Resolve service from DI container
3. Call service, serialize response

### UI adapters (`src/app/**/*.tsx`)
- Server components resolve container directly: `container.get(SERVICE)`
- Pass plain objects to client components
- Client components (`"use client"`) only for browser APIs

### Rules for `app/` layer
- No domain logic
- No direct fetch calls
- No class instantiation — plain destructurable objects only
- Server components by default
- Zod at every API boundary

## DI Wiring Pattern

### 1. Define port + token in `src/core/domain/`

```typescript
export interface FooRepository {
  fetchAll(): Promise<Foo[]>;
}
export const FooRepositoryToken = Symbol.for('FooRepository');
```

### 2. Implement adapter in `src/core/infrastructure/`

```typescript
@injectable()
export class FooRestAdapter implements FooRepository { ... }
```

### 3. Bind in `ContainerConfig.ts`

```typescript
container.bind<FooRepository>(FooRepositoryToken).to(FooRestAdapter);
```

### 4. Inject in service

```typescript
constructor(@inject(FooRepositoryToken) private fooRepository: FooRepository) {}
```

### Environment-aware bindings

```typescript
container
  .bind<Logger>(LoggerToken)
  .to(isProduction ? ProductionLoggerAdapter : ConsoleLoggerAdapter)
  .inSingletonScope();
```

## Data Flow

```
Browser request
  → Next.js middleware
    → Server Component (page)
      → container.get(ApplicationService)
        → ApplicationService (caching, error handling)
          → Domain Service
            → Ports → Infrastructure Adapters
        → domain entities returned to page
      → React renders as components
```

## Adding a New Feature (Checklist)

1. Create entity in `src/core/domain/`
2. Define port interface + token in `src/core/domain/`
3. Implement adapter in `src/core/infrastructure/`
4. Register binding in `ContainerConfig.ts`
5. Inject port into domain/application service
6. Consume service from page component or API route

## Key Design Decisions

- **Entities are plain classes** — no decorators, no framework coupling
- **Builder pattern** for entities with many optional fields from multiple sources
- **`Promise.allSettled`** over `Promise.all` for parallel fetches — partial failure tolerance
- **Discriminated unions** over class hierarchies: `type Item = { itemType: ItemType } & (Foo | Bar)`
