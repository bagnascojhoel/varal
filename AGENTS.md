# AGENTS.md — Devo Lavar Roupas?

Orientation file for AI coding agents. Read this before touching any code.

---

## What This App Does

**Devo Lavar Roupas?** ("Should I do laundry?") answers that question using a
rain forecast from the Open-Meteo API. The user shares their location (GPS or
Brazilian CEP postal code), the app fetches a 4-day precipitation forecast, and
displays YES/NO recommendations per day.

---

## Tech Stack

| Concern     | Choice                     |
| ----------- | -------------------------- |
| Framework   | Next.js 16, App Router     |
| Styling     | Tailwind CSS v4            |
| Language    | TypeScript (strict)        |
| Weather API | Open-Meteo (free, no auth) |
| Geocoding   | Nominatim (OpenStreetMap)  |
| CEP lookup  | ViaCEP                     |

---

## Repository Layout

```
app/
  page.tsx                        # Root server component — renders LocationPrompt or ForecastContent
  layout.tsx                      # Root layout — sets html[data-time] attribute
  globals.css                     # All CSS: Tailwind directives, custom variants, design tokens, component classes
  api/
    forecast/route.ts             # GET /api/forecast?latitude=&longitude=
    cep/route.ts                  # GET /api/cep?cep={8digits}

components/
  LocationPicker.tsx              # "use client" — GPS + CEP form, desktop modal
  WashResult.tsx                  # Server-renderable day cards
  LiveClock.tsx                   # "use client" — real-time clock in header
  CarouselTrack.tsx               # "use client" — mobile carousel / desktop grid

domain/
  wash-decision.ts                # Pure functions: determineWashDecision, determineTimeState

services/
  open-meteo.ts                   # fetchForecast(lat, lon, currentHour)
  geocoding.ts                    # fetchCityName(lat, lon) via Nominatim reverse geocode
  cep.ts                          # fetchCoordinatesFromCep(cep) via ViaCEP + Nominatim forward

types/
  api.ts                          # Shared response types (ForecastPageResponse, etc.)
  open-meteo.ts                   # Raw API response shapes

.ai/                              # AI agent documentation — see .ai/README.md
```

---

## Architecture Rules — Enforced, Non-Negotiable

```
Browser → Next.js page (server) → /api/* route → services/ → external APIs
                                                ↓
                                            domain/
```

| Layer             | Allowed to                                       | Forbidden from                           |
| ----------------- | ------------------------------------------------ | ---------------------------------------- |
| `domain/`         | Pure computation, type definitions               | `fetch`, React, Next.js imports          |
| `services/`       | `fetch`, throw typed errors                      | React, business decisions                |
| `components/`     | React, call API routes via `fetch`               | Direct `services/` calls, business logic |
| `app/page.tsx`    | Orchestrate server components, read searchParams | Business logic                           |
| `app/api/` routes | Call `services/` + `domain/`, validate with Zod  | React                                    |

Violations of these boundaries will be rejected.

---

## Coding Conventions

- **Named exports only.** Never `export default`.
- **Server components are the default.** Add `"use client"` only when browser
  APIs or React state/effects are required.
- **Path alias** `@/*` resolves to the repo root. Use it for all cross-directory
  imports.
- **No inline business logic** in components or routes. Decision logic belongs
  in `domain/`.
- **No direct `fetch` calls** in components. Components call `/api/*` routes;
  only `services/` calls external APIs.

---

## Theming System

The app has two visual themes driven by `html[data-time]`:

| `data-time` value       | Theme                                    | When        |
| ----------------------- | ---------------------------------------- | ----------- |
| `morning` / `afternoon` | **Day** — light blue sky, dark navy text | 6 am – 8 pm |
| `night` / _(absent)_    | **Night** — deep dark navy, white text   | 8 pm – 6 am |

### How to Apply Theming in CSS

The app has a **`@custom-variant day`** defined in `globals.css`:

```css
@custom-variant day {
  html:is([data-time='morning'], [data-time='afternoon']) & {
    @slot;
  }
}
```

**Always use the `day:` Tailwind variant** for text and foreground colors —
never write `html[data-time]` CSS selector rules for new color work:

```tsx
// Correct — Tailwind-first, theme-aware
<p className="text-white/[88%] day:text-ink/[88%]">

// Wrong — bypasses Tailwind, creates a new CSS block
<p style={{ color: "rgba(255,255,255,0.88)" }}>
```

### Design Token: `--color-ink`

The dark navy used throughout the day theme is available as a Tailwind color:

```css
/* globals.css — @theme */
--color-ink: 18 48 100; /* space-separated RGB, enables opacity modifiers */
```

Usage: `text-ink/[88%]`, `text-ink/[45%]`, `bg-ink/[10%]`, etc.

### Common Color Pairs

| Role                  | Night              | Day                   |
| --------------------- | ------------------ | --------------------- |
| Primary text          | `text-white/[88%]` | `day:text-ink/[88%]`  |
| Secondary text        | `text-white/[42%]` | `day:text-ink/[55%]`  |
| Muted / labels        | `text-white/[32%]` | `day:text-ink/[45%]`  |
| Interactive (buttons) | `text-white/[82%]` | `day:text-ink/[82%]`  |
| Error messages        | `text-red-300/90`  | `day:text-red-800/90` |

### Glass Surfaces

Use the `.glass` CSS class (defined in `globals.css`) for frosted-glass cards,
buttons, and inputs. It has built-in day-mode overrides — do not duplicate them.

### When Custom CSS Is Acceptable

Tailwind is the default. Custom CSS classes in `globals.css` are acceptable only
for:

- Structural/layout patterns that require complex selectors (e.g.,
  `.cards-track`, `.location-modal-backdrop`)
- Pseudo-element styling (e.g., `::before`, `::after`, `::webkit-scrollbar`)
- Anything that requires `@media` + multi-element coordination

Never add a CSS class just to set a text color or opacity. Use Tailwind
utilities + `day:` variant.

---

## Accessibility & Touch Targets

- **Minimum font size: 0.75rem (12px).** Smaller text is only acceptable for
  purely decorative micro-labels (chart axis ticks, etc.).
- **Minimum tap target: 44×44px** for all interactive elements. Use padding or
  `minWidth/minHeight` to expand small visual elements without breaking layout.
- Color contrast must meet WCAG 2.1 (4.5:1 normal text, 3:1 large text). Always
  verify both night and day themes.

---

## API Route Pattern

All routes follow this structure (see `app/api/forecast/route.ts` as the
reference):

1. Parse `searchParams` with a **Zod schema** — return `400` on failure.
2. Call the relevant `service` function.
3. Catch typed service errors and map to HTTP status codes.
4. Return `NextResponse.json(...)`.

Error response shapes:

```ts
{ error: string }                        // 4xx / 5xx
{ error: string; details: string[] }     // 400 validation failures
```

---

## Service Pattern

All services follow `services/geocoding.ts` and `services/cep.ts` as reference:

- Export a typed error class (e.g., `CepError`) with a `code` discriminant.
- Use `AbortSignal.timeout(5_000)` on every `fetch` call.
- Pass `User-Agent: devo-lavar-roupas/1.0` to Nominatim.
- Never return `null` for failures — throw the typed error instead.

---

## Verification

```bash
npm run typecheck   # Only automated check — must pass with zero errors before every commit
npm run dev         # Development server at http://localhost:3000
npm run build       # Production build
```

There are no lint or test scripts.

---

## Commits

All commits must follow the **Conventional Commits** standard. Full rules in
`.ai/docs/semantic-commits.md`.

```
feat(ui): add hourly precipitation timeline bars
fix(domain): correct stillUsable threshold from 2mm to 1mm
chore(deps): upgrade next to 16.1.0
```

Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`, `perf`,
`revert`. No others.

---

## AI Agent Documentation (`.ai/`)

| Task                                | Read first                                           |
| ----------------------------------- | ---------------------------------------------------- |
| Implementing any frontend feature   | `.ai/docs/ui-ux-rules.md`, `.ai/docs/style-guide.md` |
| Planning a multi-file feature       | `.ai/templates/implementation-plan.md`               |
| Recording an architectural decision | `.ai/templates/ADR.md`                               |
| Writing a commit                    | `.ai/docs/semantic-commits.md`                       |
| Reviewing past design decisions     | `.ai/features/<feature>/ADR-*.md`                    |
| Understanding visual design history | `.ai/design/`                                        |

Files in `.ai/docs/` are stable conventions — edit them only when a convention
genuinely changes, and always reflect the change in the code immediately.
