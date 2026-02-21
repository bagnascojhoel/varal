# Style Guide — Devo Lavar Roupas?

Authoritative reference for visual design decisions. Read this before writing any CSS or color value.

---

## Theming System

The app has two themes driven by `html[data-time]`:

| `data-time` value       | Theme                                    | Hours       |
| ----------------------- | ---------------------------------------- | ----------- |
| `morning` / `afternoon` | **Day** — light blue sky, dark navy text | 6 am – 8 pm |
| `night` / _(absent)_    | **Night** — deep dark navy, white text   | 8 pm – 6 am |

**Always use the `day:` Tailwind variant** for color/opacity switches:

```tsx
// Correct
<p className="text-white/[88%] day:text-ink/[88%]">

// Wrong — bypasses Tailwind, not overridable
<p style={{ color: "rgba(255,255,255,0.88)" }}>
```

---

## Color Tokens

### Design Token: `--color-ink`

```css
/* globals.css @theme */
--color-ink: 18 48 100; /* dark navy, space-separated RGB for opacity modifiers */
```

Usage: `text-ink/[88%]`, `bg-ink/[10%]`, etc.

### Text Color Pairs

| Role                 | Night                          | Day                              |
| -------------------- | ------------------------------ | -------------------------------- |
| Primary text         | `text-white/[88%]`             | `day:text-ink/[88%]`             |
| Secondary text       | `text-white/[52%]`             | `day:text-ink/[62%]`             |
| Muted / labels       | `text-white/[32%]`             | `day:text-ink/[45%]`             |
| Very muted           | `text-white/[22%]`             | `day:text-ink/[32%]`             |
| Interactive elements | `text-white/[82%]`             | `day:text-ink/[82%]`             |
| Error messages       | `text-red-300/90`              | `day:text-red-800/90`            |
| Placeholder text     | `placeholder:text-white/[28%]` | `day:placeholder:text-ink/[35%]` |

### Background (CSS-only, not Tailwind)

Night: deep navy gradient (`#0b0d19` → `#181b2d`).
Day: light blue gradient (`#aac8f0` → `#c5dff5`).

These are applied by `.weather-bg::before` — do not duplicate elsewhere.

---

## Glass Surfaces

Use the `.glass` and `.glass-inner` CSS classes (defined in `globals.css`). They include built-in day-mode overrides — never duplicate them.

| Class          | Use case                                                             |
| -------------- | -------------------------------------------------------------------- |
| `.glass`       | Cards, modal dialogs, primary buttons                                |
| `.glass-inner` | Secondary surfaces inside a `.glass` card (window pills, inner rows) |

Night values: `background: rgba(255,255,255,0.07)`, `border: 1px solid rgba(255,255,255,0.12)`, `backdrop-filter: blur(24px)`.
Day values: `background: rgba(255,255,255,0.42)`, `border: 1px solid rgba(255,255,255,0.72)`.

---

## Typography

### Font Scale

| Role                 | Size            | Weight  | Class example                         |
| -------------------- | --------------- | ------- | ------------------------------------- |
| App title (header)   | 1.1rem          | 300     | CSS `.header-app-title`               |
| Body / interactive   | 0.875rem (14px) | 300–400 | `text-sm`                             |
| Day card phrase      | 1.25rem (20px)  | 600     | `text-xl font-semibold`               |
| Weekday label        | 0.75rem (12px)  | 300     | CSS `.label-weekday`                  |
| Subtitle / caption   | 0.75rem (12px)  | 300     | `text-xs` or CSS `.header-subtitle`   |
| Pill labels          | 0.62–0.68rem    | 500     | CSS `.pill`                           |
| Micro-labels (chart) | 0.5–0.55rem     | —       | CSS `.timeline-caption`, `.label-day` |

### Minimum Sizes

- **Hard floor: 0.75rem (12px)** for any text the user must read.
- Decorative micro-labels (chart axis ticks, pill text) may go as low as **0.625rem (10px)** only when purely supplementary.
- Interactive labels (button text, form labels): **0.875rem (14px) minimum**.

### Font Weight

| Context             | Weight                  |
| ------------------- | ----------------------- |
| Headings / emphasis | 600 (`font-semibold`)   |
| Body / UI labels    | 300 (`font-light`)      |
| Status pills        | 500 (`font-medium`)     |
| Display / clock     | 200 (`font-extralight`) |

---

## Breakpoints

| Name    | Range          | Tailwind prefix | Layout behavior                             |
| ------- | -------------- | --------------- | ------------------------------------------- |
| Mobile  | 0 – 639px      | _(default)_     | Single-column; cards carousel (snap-scroll) |
| Tablet  | 640px – 1023px | `sm:`           | Slightly larger pill font; still carousel   |
| Desktop | ≥ 1024px       | `lg:`           | 3-column card grid; modal dialog overlay    |

The app is **mobile-first**: styles without a breakpoint prefix apply to all screens; `lg:` overrides for desktop.

---

## Buttons

### Touch Target Rule (all screens)

**Minimum 44×44px tap target** for every interactive element — enforced via `minWidth/minHeight` or padding. When the visual element must stay small (e.g., icon button), expand the hit area with padding and compensate layout with a negative margin.

```tsx
// Icon button example
<button
  style={{ minWidth: "44px", minHeight: "44px" }}
  className="-ml-2" // compensate for the extra left padding
>
  ✎
</button>
```

### Button Sizes by Screen

| Screen  | Min height | Min width          | Padding (approx.) | Font size       |
| ------- | ---------- | ------------------ | ----------------- | --------------- |
| Mobile  | 44px       | 44px               | `px-5 py-3`       | 0.875rem (14px) |
| Tablet  | 44px       | 44px               | `px-6 py-3`       | 0.875rem (14px) |
| Desktop | 44px       | auto (content-fit) | `px-6 py-3`       | 0.875rem (14px) |

The 44px rule applies on **all** screen sizes. On desktop, buttons do not need to be larger — they just must not be smaller.

### Button Variants

All buttons in this project use the `.glass` surface class. There are no separate `.btn` variants — use Tailwind utilities directly:

```tsx
// Primary / action button (GPS, Buscar)
<button className="text-white/[82%] day:text-ink/[82%] glass px-6 py-3 rounded-2xl font-light text-sm cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">

// Icon / ghost button (close ✕, edit ✎)
<button
  className="text-white/[32%] day:text-ink/[35%] inline-flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
  style={{ minWidth: "44px", minHeight: "44px" }}
>
```

### Disabled State

Always use `disabled:opacity-50 disabled:cursor-not-allowed` for primary buttons, `disabled:opacity-20 disabled:cursor-not-allowed` for ghost/icon buttons.

---

## Spacing

The app uses Tailwind's default spacing scale. Common values in use:

| Token   | Value   | Usage                     |
| ------- | ------- | ------------------------- |
| `p-5`   | 1.25rem | Card inner padding        |
| `pb-4`  | 1rem    | Card bottom padding       |
| `p-8`   | 2rem    | Modal dialog padding      |
| `gap-2` | 0.5rem  | Window pill rows          |
| `gap-3` | 0.75rem | Form element gaps         |
| `gap-6` | 1.5rem  | Modal section gaps        |
| `mb-5`  | 1.25rem | Card section spacing      |
| `mb-3`  | 0.75rem | Divider → windows section |

---

## Border Radius

| Context          | Class                       | Value   |
| ---------------- | --------------------------- | ------- |
| Cards            | `rounded-2xl`               | 1rem    |
| Buttons          | `rounded-2xl`               | 1rem    |
| Modal dialog     | `rounded-3xl`               | 1.5rem  |
| Window pill rows | `rounded-xl`                | 0.75rem |
| Status pills     | `rounded-full`              | 9999px  |
| Timeline bars    | `rounded-sm` top-only (CSS) | 2px     |

---

## Accent Colors (Card Top Bars)

Each day card gets a color accent on its top edge, assigned by index:

| Index | Class            | Color             |
| ----- | ---------------- | ----------------- |
| 0     | `.accent-red`    | Red gradient      |
| 1     | `.accent-amber`  | Amber gradient    |
| 2     | `.accent-sky`    | Sky blue gradient |
| 3     | `.accent-indigo` | Indigo gradient   |

These are CSS classes — do not replicate with Tailwind.

---

## Accessibility

- **Color contrast**: WCAG 2.1 — 4.5:1 for normal text, 3:1 for large text. Always verify both night and day themes.
- **Touch targets**: 44×44px minimum for all interactive elements.
- **Font size floor**: 0.75rem (12px) for all readable text.
- **Semantic HTML**: `<article>` for cards, `role="dialog"` for modal, `role="group"` + `aria-roledescription="slide"` for carousel cards.
- **Keyboard navigation**: All interactive elements must be reachable and operable via keyboard.
- **Screen readers**: Use `aria-hidden="true"` on decorative icons/emojis; use `aria-label` on icon-only buttons.

---

## When Custom CSS Is Acceptable

Tailwind is the default. Custom CSS classes in `globals.css` are acceptable **only** for:

- Structural/layout patterns requiring complex selectors (`.cards-track`, `.location-modal-backdrop`)
- Pseudo-element styling (`::before`, `::after`, `::-webkit-scrollbar`)
- Multi-element coordination with `@media` queries
- Day-theme overrides that use `html[data-time]` selectors (glass backgrounds, header colors)

**Never** add a CSS class just to set a text color or opacity. Use Tailwind utilities + `day:` variant instead.
