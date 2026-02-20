# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — run the production server
- `npm run typecheck` — TypeScript type check (no lint or test scripts exist)

## Architecture

**"Devo Lavar Roupas?"** — a Next.js (App Router) app that answers "should I wash my clothes today?" based on the day's rain forecast from the Open-Meteo API.

### Directory layout

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router: `page.tsx` (server component), `layout.tsx`, and `api/wash-recommendation/route.ts` |
| `components/` | React components: `LocationDetector` (client), `WashResult` (server-renderable) |
| `domain/` | Pure business logic: `wash-decision.ts` |
| `services/` | External API calls: `open-meteo.ts` |
| `types/` | Shared TypeScript interfaces: `api.ts`, `open-meteo.ts` |

Path alias `@/*` resolves to the repo root (e.g., `@/domain/wash-decision`).

### Request flow

1. `LocationDetector` (client component) calls `navigator.geolocation` and pushes `/?lat=X&lon=Y`.
2. `app/page.tsx` (server component) reads `searchParams`, calls `fetchTodayPrecipitation(lat, lon)` from `services/open-meteo.ts`.
3. `determineWashDecision(precipitationProbabilityMax, precipitationSum)` in `domain/wash-decision.ts` applies thresholds: rain probability < 40% **and** precipitation sum < 1 mm → `canWash: true`.
4. `WashResult` renders a YES/NO answer with an emoji and reason string.

The API route `GET /api/wash-recommendation?latitude=&longitude=` exposes the same `services` + `domain` logic as a standalone JSON endpoint, validated with Zod.

## Conventions

- No default exports — use named exports throughout.
- Server components are the default; add `"use client"` only when browser APIs are needed.
- Business logic lives exclusively in `domain/`; components and routes must not contain decision logic.
- External API calls are isolated in `services/`; domain and components must not call fetch directly.
- All commits must follow the Conventional Commits standard — see `.ai/docs/semantic-commits.md`.

## AI Agent Documentation

The `.ai/` directory contains project-specific standards and documentation for AI agents.

**Before implementing a frontend feature**: read `.ai/docs/ui-ux-rules.md` and `.ai/docs/style-guide.md`.

**Before planning a multi-file feature**: use `.ai/templates/ADR.md` and `.ai/templates/implementation-plan.md`.

**Feature decisions are persisted in** `.ai/features/<feature-name>/`.

Directory overview:
- `.ai/docs/` — permanent project-level guidelines (UI/UX rules, style guide, atomic design)
- `.ai/templates/` — document templates (ADR, implementation plan)
- `.ai/features/` — per-feature ADRs, implementation plans, and summaries
- `.ai/design/` — visual design iterations (HTML/CSS mockups)
- `.ai/references/` — old code kept for historical context
