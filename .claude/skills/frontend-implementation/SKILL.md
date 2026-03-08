---
name: frontend-implementation
description: Build UI components following the project's design system — theming, color tokens, typography, glass surfaces, buttons, spacing, breakpoints, and accessibility rules. Use when creating or modifying React components, styling with Tailwind, or reviewing UI for design system compliance.
---

# Frontend Implementation

Rules and tokens for building UI in this project. Combines the style guide, UI/UX rules, and atomic design standards.

## Theming

- Two themes driven by `html[data-time]`:
  - **Day** (`morning` / `afternoon`, 6am–8pm): light blue sky, dark navy text
  - **Night** (`night` / absent, 8pm–6am): deep dark navy, white text
- **Always use the `day:` Tailwind variant** for color/opacity switches
- Never use inline `style` for colors — use Tailwind utilities + `day:` variant

```tsx
// Correct
<p className="text-white/[88%] day:text-ink/[88%]">

// Wrong
<p style={{ color: "rgba(255,255,255,0.88)" }}>
```

## Color Tokens

### `--color-ink`

```css
--color-ink: 18 48 100; /* dark navy, space-separated RGB */
```

Usage: `text-ink/[88%]`, `bg-ink/[10%]`, etc.

### Text Color Pairs

| Role | Night | Day |
|------|-------|-----|
| Primary | `text-white/[88%]` | `day:text-ink/[88%]` |
| Secondary | `text-white/[52%]` | `day:text-ink/[62%]` |
| Muted | `text-white/[32%]` | `day:text-ink/[45%]` |
| Very muted | `text-white/[22%]` | `day:text-ink/[32%]` |
| Interactive | `text-white/[82%]` | `day:text-ink/[82%]` |
| Error | `text-red-300/90` | `day:text-red-800/90` |
| Placeholder | `placeholder:text-white/[28%]` | `day:placeholder:text-ink/[35%]` |

### Background

- Night: deep navy gradient (`#0b0d19` → `#181b2d`)
- Day: light blue gradient (`#aac8f0` → `#c5dff5`)
- Applied by `.weather-bg::before` — do not duplicate

## Glass Surfaces

Use `.glass` and `.glass-inner` CSS classes from `globals.css`. They include day-mode overrides — never duplicate them.

| Class | Use case |
|-------|----------|
| `.glass` | Cards, modal dialogs, primary buttons |
| `.glass-inner` | Secondary surfaces inside a `.glass` card |

## Typography

### Font Scale

| Role | Size | Weight | Class |
|------|------|--------|-------|
| App title | 1.1rem | 300 | CSS `.header-app-title` |
| Body / interactive | 0.875rem (14px) | 300–400 | `text-sm` |
| Day card phrase | 1.25rem (20px) | 600 | `text-xl font-semibold` |
| Weekday label | 0.75rem (12px) | 300 | CSS `.label-weekday` |
| Subtitle / caption | 0.75rem (12px) | 300 | `text-xs` |
| Pill labels | 0.62–0.68rem | 500 | CSS `.pill` |
| Micro-labels | 0.5–0.55rem | — | CSS `.timeline-caption` |

### Minimum Sizes

- **Hard floor: 0.75rem (12px)** for readable text
- Decorative micro-labels: **0.625rem (10px)** minimum, only when supplementary
- Interactive labels: **0.875rem (14px)** minimum

### Font Weight

| Context | Weight |
|---------|--------|
| Headings / emphasis | 600 (`font-semibold`) |
| Body / UI labels | 300 (`font-light`) |
| Status pills | 500 (`font-medium`) |
| Display / clock | 200 (`font-extralight`) |

## Buttons

### Touch Target Rule

**Minimum 44×44px tap target** on all screens, all interactive elements.

```tsx
// Icon button — expand hit area with padding, compensate with negative margin
<button
  style={{ minWidth: "44px", minHeight: "44px" }}
  className="-ml-2"
>
  ✎
</button>
```

### Variants

All buttons use `.glass` surface. No separate `.btn` variants.

```tsx
// Primary button
<button className="text-white/[82%] day:text-ink/[82%] glass px-6 py-3 rounded-2xl font-light text-sm cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">

// Icon / ghost button
<button
  className="text-white/[32%] day:text-ink/[35%] inline-flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
  style={{ minWidth: "44px", minHeight: "44px" }}
>
```

### Disabled State

- Primary: `disabled:opacity-50 disabled:cursor-not-allowed`
- Ghost/icon: `disabled:opacity-20 disabled:cursor-not-allowed`

## Breakpoints

| Name | Range | Prefix | Layout |
|------|-------|--------|--------|
| Mobile | 0–639px | _(default)_ | Single-column; cards carousel |
| Tablet | 640–1023px | `sm:` | Slightly larger pill font; carousel |
| Desktop | ≥1024px | `lg:` | 3-column card grid; modal overlay |

Mobile-first: styles without prefix apply to all screens; `lg:` overrides for desktop.

## Spacing & Border Radius

### Common Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `p-5` | 1.25rem | Card inner padding |
| `p-8` | 2rem | Modal dialog padding |
| `gap-2` | 0.5rem | Window pill rows |
| `gap-3` | 0.75rem | Form element gaps |
| `gap-6` | 1.5rem | Modal section gaps |

### Border Radius

| Context | Class | Value |
|---------|-------|-------|
| Cards, Buttons | `rounded-2xl` | 1rem |
| Modal dialog | `rounded-3xl` | 1.5rem |
| Window pill rows | `rounded-xl` | 0.75rem |
| Status pills | `rounded-full` | 9999px |

## Accent Colors (Card Top Bars)

| Index | Class | Color |
|-------|-------|-------|
| 0 | `.accent-red` | Red gradient |
| 1 | `.accent-amber` | Amber gradient |
| 2 | `.accent-sky` | Sky blue gradient |
| 3 | `.accent-indigo` | Indigo gradient |

CSS classes — do not replicate with Tailwind.

## When Custom CSS Is Acceptable

Tailwind is the default. Custom CSS in `globals.css` only for:
- Complex selectors (`.cards-track`, `.location-modal-backdrop`)
- Pseudo-elements (`::before`, `::after`, `::-webkit-scrollbar`)
- Multi-element `@media` coordination
- Day-theme overrides using `html[data-time]` selectors

**Never** add CSS class just for text color or opacity. Use Tailwind + `day:` variant.

## Accessibility Checklist

- Semantic HTML5 elements (`<article>` for cards, `role="dialog"` for modal)
- Color contrast: 4.5:1 normal text, 3:1 large text — verify both themes
- Touch targets: 44×44px minimum
- Font size floor: 0.75rem (12px)
- Keyboard navigation: all interactive elements reachable
- `aria-hidden="true"` on decorative icons/emojis
- `aria-label` on icon-only buttons
- `role="group"` + `aria-roledescription="slide"` for carousel cards

## Atomic Design Hierarchy

- **Atoms**: Smallest elements (buttons, inputs, colors, fonts) — context-agnostic
- **Molecules**: Groups of atoms forming a unit (search form, nav item) — reusable, not page-tied
- **Organisms**: Complex components from molecules + atoms (header, card section) — can be page-specific
- **Templates**: Page-level layouts arranging organisms — structure, not content
- **Pages**: Templates populated with real data

Rules:
- Each level independent and reusable
- BEM naming (`Block__Element--Modifier`) for custom CSS classes
- Tailwind utilities preferred over BEM when possible
