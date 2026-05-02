# UI Components — Development Guide

This guide provides constraints, patterns, and design tokens for building
presentational components in `src/ui/`. These components are pure, stateless,
and renderable in Storybook without Next.js context.

## Guardrails

**No Next.js dependencies.** Components in `src/ui/` must NOT import from:

- `next/navigation`, `next/server`, `next/link`, `next/image`
- Application services, repositories, or DI container
- `next-intl` or i18n hooks

All translations and dynamic values must be passed as props. See
[Labels & i18n](#labels--i18n).

**No side effects.** Components are pure functions — no `useEffect`, `useState`,
or external API calls. Wrap with container components in `app/_components/` if
hooks are needed.

**One component per file.** Colocate helper functions in the same file. Export
the main component as a named export.

**Every component needs a Storybook story.** Co-locate `Component.tsx` with
`Component.stories.tsx` in the same directory.

---

## Labels & i18n

Components accept all labels and enum mappings as props. **Never hardcode text
or use `next-intl`.**

### Pattern: Pass labels as `labels` prop

```typescript
interface ComponentProps {
  labels: any;  // Full messages object, or a shape with your namespace
  // ... other props
}

function MyComponent({ labels, ... }: ComponentProps) {
  return <div>{labels.MyNamespace.someKey}</div>;
}
```

In Storybook stories, construct labels from the actual project messages:

```typescript
import messages from '../../../../messages/pt-BR.json';

const meta: Meta<typeof MyComponent> = {
  args: {
    labels: messages, // Pass full messages object
  },
};
```

### Pattern: Enum-based lookups

If a component needs to map enum values (like
`ClothingRecommendation.Recomendar`) to labels, add keys to
`messages/pt-BR.json` that match the enum values exactly:

```json
{
  "MyNamespace": {
    "EnumValue": "Display text"
  }
}
```

Then access via: `labels.MyNamespace[enumValue]`.

---

## Typography

**Font:** Inter — weights 200, 300, 400, 500. System-ui fallback.

```css
font-family: 'Inter', system-ui, sans-serif;
```

### Scale

| Role                | Size          | Weight  | Notes                                                           |
| ------------------- | ------------- | ------- | --------------------------------------------------------------- |
| Live clock          | 2.2rem        | 200     | `letter-spacing: -0.03em`, `font-variant-numeric: tabular-nums` |
| Page title (h1)     | 1.55rem       | 300     | `letter-spacing: -0.02em`, `line-height: 1.2`                   |
| App brand (h1)      | 1.1rem        | 300     | `letter-spacing: -0.01em`                                       |
| Modal title (h2)    | 1.2rem        | 300     | `letter-spacing: -0.015em`                                      |
| Body / tile labels  | 0.9375rem     | 300     | Default content text                                            |
| Secondary body      | 0.9rem        | 300     | Category row names, group headers                               |
| Small body          | 0.875rem      | 300     | Toggle pills                                                    |
| Subtitles           | 0.8–0.8125rem | 300     | Page subtitles, breadcrumb                                      |
| Captions / metadata | 0.72–0.75rem  | 300     | Tile descriptions, timers, badges                               |
| Micro labels        | 0.65–0.7rem   | 300     | Weather metric labels, section labels                           |
| Tiny caps           | 0.5–0.62rem   | 300–500 | Uppercase section headers, pill text                            |

### Uppercase labels

Section labels always uppercase with wide letter-spacing:

```css
text-transform: uppercase;
letter-spacing: 0.14em–0.20em;
font-size: 0.55rem–0.7rem;
font-weight: 300;
```

---

## Colors

### Text hierarchy (night / dark mode)

All colors are white with opacity against dark background:

| Level         | Value                         | Usage                                    |
| ------------- | ----------------------------- | ---------------------------------------- |
| High emphasis | `rgba(255,255,255,0.90)`      | Headlines, primary content               |
| Medium-high   | `rgba(255,255,255,0.82)`      | Active state text, values                |
| Medium        | `rgba(255,255,255,0.62–0.72)` | Secondary labels, group headers          |
| Low-medium    | `rgba(255,255,255,0.45–0.52)` | Subtitles, weekday names                 |
| Muted         | `rgba(255,255,255,0.32–0.38)` | Captions, breadcrumb, dried states       |
| Very muted    | `rgba(255,255,255,0.22–0.28)` | Divider-adjacent labels, timeline labels |
| Decorative    | `rgba(255,255,255,0.10–0.18)` | Disabled, footer text                    |

### Text hierarchy (morning / afternoon — light mode)

Dark blue base `rgba(18,48,100,x)` replaces white. Use the `day:` Tailwind
prefix:

```html
<span class="text-white/[52%] day:text-ink/[62%]">Text</span>
```

Map `day:text-ink/[x]` to `rgba(18,48,100, x/100)`.

### Semantic status colors

| Semantic                       | Hex / Base                       | Usage                                                         |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------- |
| Good / confirmed               | `#4ade80` / `rgba(74,222,128,x)` | Clear weather, dried, selected state, positive CTAs           |
| Warning / in-progress          | `#fbbf24` / `rgba(251,191,36,x)` | Amber timeline bars, active session timer, uncertain forecast |
| Bad / negative                 | `rgba(239,68,68,x)`              | Red timeline bars, "Chuva" pill                               |
| Destructive action             | `rgba(248,113,113,x)`            | "Encerrar Sessão" button, pill-no                             |
| Sky / alternative positive     | `rgba(56,189,248,x)`             | Clear day accent, pill-clear                                  |
| Indigo / future / neutral info | `rgba(129,140,248,x)`            | Day+3 card accent                                             |

---

## Glass Surfaces

### Primary surfaces (cards, containers)

```css
background: rgba(255, 255, 255, 0.07);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.12);
```

Day mode override (`day:` prefix):

```css
day:background: rgba(255,255,255,0.42);
day:border-color: rgba(255,255,255,0.72);
```

Tailwind class:
`.bg-[rgba(255,255,255,0.07)] ... day:bg-[rgba(255,255,255,0.42)]`

### Nested panels (glass-inner)

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

Day mode:

```css
day:background: rgba(255,255,255,0.38);
day:border-color: rgba(255,255,255,0.55);
```

### Modal surface

```css
background: rgba(20, 24, 44, 0.92);
backdrop-filter: blur(32px);
border: 1px solid rgba(255, 255, 255, 0.14);
```

---

## Spacing & Layout

### Common gaps

| Pattern                     | Value                                   |
| --------------------------- | --------------------------------------- |
| Card grid gap               | `1rem` (desktop), `0.75rem` (mobile)    |
| Section spacing inside card | `0.75rem–1.25rem`                       |
| Window rows gap             | `0.5rem`                                |
| Row separator               | `1px solid rgba(255,255,255,0.06–0.08)` |

---

## Border Radius

| Element                            | Radius                 |
| ---------------------------------- | ---------------------- |
| Cards, containers                  | `rounded-2xl` (1rem)   |
| Modals                             | `rounded-3xl` (1.5rem) |
| Inner panels, toggle pills (large) | `rounded-xl` (0.75rem) |
| Buttons (CTA)                      | `1rem`                 |
| Pills, dots, checkboxes            | `9999px` (full round)  |
| Small toggle pills                 | `0.625rem`             |
| Checkbox indicator                 | `6px`                  |

---

## Accent Bars

A 3px top bar on cards signals status. Gradient: solid at left, transparent at
right.

```css
height: 3px;
background: linear-gradient(90deg, <color-solid>, <color-faded>);
```

| State          | Color                                                    |
| -------------- | -------------------------------------------------------- |
| Bad            | Red `rgba(248,113,113,0.9)` → `rgba(239,68,68,0.15)`     |
| Warn           | Amber `rgba(251,191,36,0.9)` → `rgba(245,158,11,0.15)`   |
| Clear          | Sky `rgba(56,189,248,0.9)` → `rgba(34,211,238,0.15)`     |
| Night / future | Indigo `rgba(129,140,248,0.9)` → `rgba(99,102,241,0.15)` |

---

## Status Pills

Inline badge buttons for forecast and status indicators.

```css
display: inline-flex;
font-size: 0.62rem;
padding: 0.18rem 0.5rem;
border-radius: 9999px;
font-weight: 500;
white-space: nowrap;
```

| Variant       | Background               | Text                     | Border                   |
| ------------- | ------------------------ | ------------------------ | ------------------------ |
| `pill-no`     | `rgba(239,68,68,0.15)`   | `rgb(252,165,165)`       | `rgba(239,68,68,0.25)`   |
| `pill-yes`    | `rgba(251,191,36,0.15)`  | `rgb(253,230,138)`       | `rgba(251,191,36,0.25)`  |
| `pill-clear`  | `rgba(56,189,248,0.15)`  | `rgb(125,211,252)`       | `rgba(56,189,248,0.25)`  |
| `pill-unsure` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.38)` | `rgba(255,255,255,0.10)` |

---

## Buttons

### Full-width CTA (primary action)

```css
width: 100%;
min-height: 52px;
border-radius: 1rem;
font-size: 0.9375rem;
font-weight: 400;
transition: opacity 0.18s;
```

| Variant  | Background                   | Border                       | Text                     |
| -------- | ---------------------------- | ---------------------------- | ------------------------ |
| Green    | `rgba(74,222,128,0.12–0.14)` | `rgba(74,222,128,0.28–0.30)` | `rgba(74,222,128,0.95)`  |
| Red      | `rgba(248,113,113,0.10)`     | `rgba(248,113,113,0.25)`     | `rgba(248,113,113,0.90)` |
| Disabled | `rgba(255,255,255,0.05)`     | `rgba(255,255,255,0.08)`     | `rgba(255,255,255,0.28)` |

Disabled: `opacity: 0.45; cursor: not-allowed`. Hover (enabled):
`opacity: 0.80`.

### Small action pill

```css
padding: 0.3rem 0.75rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 500;
min-height: 32px;
background: rgba(74, 222, 128, 0.1);
border: 1px solid rgba(74, 222, 128, 0.25);
color: #4ade80;
```

---

## Timeline Bars

Hourly drying-chance bars (6h–20h, 15 bars).

```css
display: flex;
align-items: flex-end;
gap: 2px;
height: 48px;
padding-bottom: 4px;
border-bottom: 1px solid rgba(255, 255, 255, 0.08);
position: relative; /* required for now-marker */
```

Bar element:

```css
flex: 1;
min-width: 0;
min-height: 2px;
border-radius: 2px 2px 0 0;
transition:
  opacity 0.15s,
  background 0.3s;
```

| State | Color                    |
| ----- | ------------------------ |
| Good  | `rgba(56,189,248,0.65)`  |
| Warn  | `rgba(251,191,36,0.65)`  |
| Bad   | `rgba(239,68,68,0.65)`   |
| Past  | `rgba(255,255,255,0.10)` |

Day mode uses darker versions: good `rgba(2,132,199,0.45)`, warn
`rgba(217,119,6,0.50)`, bad `rgba(185,28,28,0.45)`.

---

## Now Marker (Timeline)

Thin vertical line showing current time. Visible only in afternoon state.

```css
position: absolute;
top: 0;
bottom: 4px;
width: 1.5px;
background: rgba(255, 255, 255, 0.6);
border-radius: 1px;
pointer-events: none;
```

Dot cap (pseudo-element):

```css
width: 5px;
height: 5px;
background: rgba(255, 255, 255, 0.75);
border-radius: 9999px;
```

Position formula: `left = ((currentHour + min/60 - 6) / 14 * 100)%` — clamped to
0–100%.

---

## Checkboxes & Toggle Pills

### Checkbox tiles (category selection)

```css
min-height: 56px;
padding: 0 1.25rem;
border-radius: 1rem;
transition:
  background 0.18s,
  border-color 0.18s;
```

| State     | Background               | Border                                                                   |
| --------- | ------------------------ | ------------------------------------------------------------------------ |
| Unchecked | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.08)`                                                 |
| Checked   | `rgba(74,222,128,0.07)`  | `rgba(74,222,128,0.20)` + `border-left: 3px solid rgba(74,222,128,0.75)` |
| Hover     | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.14)`                                                 |

Checkbox indicator (20×20px, `rounded-[6px]`):

- Unchecked: `border: 1.5px solid rgba(255,255,255,0.22)`
- Checked: `background: rgba(74,222,128,0.85)` + white SVG checkmark

### Toggle pills (binary choice)

```css
flex: 1;
min-height: 44px;
border-radius: 0.75rem;
font-size: 0.875rem;
font-weight: 300;
```

| State      | Background               | Border                   | Text                     |
| ---------- | ------------------------ | ------------------------ | ------------------------ |
| Off        | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.48)` |
| On (green) | `rgba(74,222,128,0.12)`  | `rgba(74,222,128,0.30)`  | `rgba(74,222,128,0.92)`  |
| On (red)   | `rgba(248,113,113,0.12)` | `rgba(248,113,113,0.25)` | `rgba(248,113,113,0.90)` |

Use `aria-pressed="true/false"`.

---

## Carousel Dots

Visual dots (6px → 20px on active) inside 44×44px button tap targets.

```css
.dot::after {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.28);
  transition:
    width 0.25s ease,
    background 0.25s ease;
}
.dot.active::after {
  width: 20px;
  background: rgba(255, 255, 255, 0.85);
}
```

Day mode: use `rgba(18,48,100,x)` in place of white.

---

## Animations & Transitions

| Pattern                      | Duration   | Easing            |
| ---------------------------- | ---------- | ----------------- |
| Color / background / opacity | 0.15–0.18s | ease              |
| Card hover lift (desktop)    | 0.3s       | ease              |
| Card fade-in                 | 0.4s       | ease              |
| Dot width (carousel active)  | 0.25s      | ease              |
| Chevron rotate               | 0.2s       | ease              |
| Modal backdrop filter        | 0.25s      | ease              |
| Pulse ring (live dot)        | 1.8s       | ease-out infinite |

Card hover on desktop only:

```css
@media (min-width: 1024px) {
  .card:hover {
    transform: translateY(-3px);
  }
}
```

---

## Accessibility

**Touch targets:** 44px minimum for all interactive elements.

- Timer values: `aria-live="polite"`
- Carousels: `role="region"`, `aria-roledescription="carrossel"`, cards
  `role="group"` + `aria-roledescription="slide"`
- Carousel dots: `role="tablist"` / `role="tab"` + `aria-selected`
- Toggle buttons: `aria-pressed`
- Collapsibles: `aria-expanded` + `aria-controls`
- Decorative elements: `aria-hidden="true"`
- Hidden inputs: `class="sr-only"`
- Icon buttons: `aria-label` with descriptive text
- Modals: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + focus
  trap + Escape key

---

## Responsive Strategy

- **Mobile-first:** default styles target narrow viewports
- **Breakpoint `lg` (1024px):** carousel → grid; dots hidden; card hover enabled
- **Breakpoint `480px`:** modal shifts from bottom-sheet to centered dialog
- **Card width mobile:** `min(88vw, 320px)` — leaves ~6% of next card visible as
  scroll hint

---

## Language

All UI text is **Brazilian Portuguese**. Texts must be passed as props from
`messages/pt-BR.json`. No hardcoded English or Portuguese strings.
