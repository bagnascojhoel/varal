## Context

Varal's UI components live in `src/app/_components/`, collocated with Next.js App Router. Many of them mix presentational rendering with data-fetching concerns (server components, `searchParams`, `"use client"` for GPS). This coupling makes it impossible to develop or review UI in isolation. There is currently no component catalogue or visual documentation.

The proposal introduces `src/ui/` as a dedicated layer for design-system-level components — presentational, data-agnostic, and renderable outside the Next.js request/response cycle. Storybook provides the isolated render environment.

## Goals / Non-Goals

**Goals:**
- Install and configure Storybook 8 with Next.js integration
- Establish `src/ui/` as the home for pure UI primitives and composites
- Provide a story file (`*.stories.tsx`) for every component added to `src/ui/`
- Ensure Storybook resolves Tailwind CSS v4 styles and the `@/*` path alias

**Non-Goals:**
- Migrating all existing `app/_components/` components immediately — only the presentational parts that make sense to extract are in scope
- Adding visual regression testing (e.g. Chromatic) — deferred to a future change
- Adding a11y addon automation beyond what `@storybook/addon-essentials` provides by default

## Decisions

### 1. Use `@storybook/nextjs` as the Storybook framework

`@storybook/nextjs` wraps `@storybook/react-vite` with Next.js-specific mocks (Image, Link, navigation hooks, font optimization). It handles the `@/*` alias automatically from `tsconfig.json` and supports Tailwind CSS v4 via the Vite pipeline.

**Alternatives:**
- `@storybook/react-webpack5`: Older, slower, requires manual alias config and Tailwind PostCSS setup. Rejected.
- `@storybook/react-vite` (bare): Faster than webpack but requires manually mocking Next.js internals. Rejected in favour of the official Next.js integration.

### 2. Place design-system components in `src/ui/`, not `src/app/_components/`

`app/_components/` is inside the Next.js App Router boundary. Components there are subject to server/client rules and can access routing context. `src/ui/` is outside `app/`, making it framework-neutral: importable from app components, API routes, or Storybook with no Next.js assumptions baked in.

**Alternatives:**
- Keep everything in `app/_components/` and co-locate stories: Storybook would still work, but the component boundary remains implicit. Harder to enforce the no-data-dependency rule for presentational pieces. Rejected.
- A separate package/monorepo: Overkill for a single-app project. Rejected.

### 3. Storybook 8 with `@storybook/addon-essentials`

Storybook 8 is the current stable release; it ships with Vite 5 by default and has first-class React 19 support. The `essentials` addon bundle (controls, actions, docs, viewport) covers the core developer workflow without additional config.

**Alternatives:**
- Storybook 7: Still widely used but no longer receives feature updates. React 19 support is partial. Rejected.

### 4. Story naming convention: `UI/<ComponentName>`

Stories are titled `UI/Button`, `UI/DayCard`, etc. This creates a clean `UI` group in the Storybook sidebar, separate from any future `App` or `Domain` story groups.

**Alternatives:**
- Flat namespace (e.g. `Button`): Works but doesn't scale when stories from different layers are added. Rejected.

## Risks / Trade-offs

- **Tailwind v4 + Storybook**: Tailwind CSS v4 uses a Vite plugin (`@tailwindcss/vite`) rather than PostCSS. `@storybook/nextjs` uses Vite internally, so the plugin should compose correctly, but may require explicit addition to `.storybook/main.ts` `viteFinal`. → Mitigation: test the setup end-to-end before marking implementation complete; document the config in `.storybook/main.ts`.
- **Partial extraction of `app/_components/`**: Not all components will move to `src/ui/` in this change. Mixed placement may be confusing temporarily. → Mitigation: document the rule in CLAUDE.md — "pure presentational components belong in `src/ui/`; components with routing or data concerns stay in `app/_components/`".
- **Story maintenance burden**: Stories go stale when component APIs change. → Mitigation: TypeScript ensures story args match the component's prop types at compile time. Include `npm run typecheck` in the verification step.

## Open Questions

- Should `DayCard` be extracted to `src/ui/` in this change, or is its coupling to `DayForecast` DTO too strong? Lean toward extracting it as a presentational component that accepts plain props — if it is, it's a good first story.
