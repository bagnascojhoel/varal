# Style Guide

> **Template instructions** (delete this block after filling in):
> Replace every `{{PLACEHOLDER}}` with project-specific values.
> Remove sections that don't apply. Keep tokens consistent with your CSS variables.

## Principle Colors

- **Primary**: `{{PRIMARY_COLOR}}` — {{Usage: e.g., accents, borders, interactive elements}}
- **Primary Variant**: `{{PRIMARY_VARIANT_COLOR}}` — {{Usage: e.g., hover states, highlights}}
- **Background**: `{{BACKGROUND_COLOR}}` — {{Usage: e.g., page background}}
- **Surface**: `{{SURFACE_COLOR}}` — {{Usage: e.g., cards, panels}}
- **On-Primary (text on primary bg)**: `{{ON_PRIMARY_COLOR}}`
- **On-Background (body text)**: `{{ON_BACKGROUND_COLOR}}`

## Design Tokens

### Spacing

- `--spacing-xs`: {{value, e.g. 0.25rem}}
- `--spacing-sm`: {{value, e.g. 0.5rem}}
- `--spacing-md`: {{value, e.g. 1rem}}
- `--spacing-lg`: {{value, e.g. 1.5rem}}
- `--spacing-xl`: {{value, e.g. 2rem}}
- `--spacing-2xl`: {{value, e.g. 3rem}}

### Typography

- **Font Family**: `{{font stack, e.g. Inter, system-ui, sans-serif}}`
- **Font Sizes**:
  - `--font-size-xs`: {{e.g. 0.75rem}}
  - `--font-size-sm`: {{e.g. 0.875rem}}
  - `--font-size-base`: {{e.g. 1rem}}
  - `--font-size-lg`: {{e.g. 1.25rem}}
  - `--font-size-xl`: {{e.g. 1.5rem}}
  - `--font-size-2xl`: {{e.g. 2rem}}
  - `--font-size-3xl`: {{e.g. 3rem}}
- **Line Height**: {{e.g. 1.6}}
- **Font Weight — Normal**: {{e.g. 400}}
- **Font Weight — Medium**: {{e.g. 500}}
- **Font Weight — Bold**: {{e.g. 700}}

### Borders & Shadows

- `--border-radius-sm`: {{e.g. 0.25rem}}
- `--border-radius`: {{e.g. 0.5rem}}
- `--border-radius-lg`: {{e.g. 1rem}}
- `--border-radius-full`: {{e.g. 9999px}}
- `--box-shadow-sm`: {{e.g. 0 1px 2px rgba(0,0,0,0.05)}}
- `--box-shadow`: {{e.g. 0 2px 4px rgba(0,0,0,0.1)}}
- `--box-shadow-lg`: {{e.g. 0 8px 24px rgba(0,0,0,0.12)}}

### Breakpoints

- **Mobile**: < {{e.g. 640px}}
- **Tablet**: {{e.g. 640px}} – {{e.g. 1024px}}
- **Desktop**: ≥ {{e.g. 1024px}}

## Component Patterns

### Buttons

- Base class: `{{e.g. .btn}}`
- Primary variant: `{{e.g. .btn--primary}}` — uses `{{PRIMARY_COLOR}}`
- Secondary variant: `{{e.g. .btn--secondary}}`
- Minimum tap target: 44×44px (mobile)

### Navigation

- Class: `{{e.g. .nav}}`
- Mobile toggle: `{{e.g. .nav__toggle}}` + `{{e.g. .is-active}}` on the list

### Cards

- Class: `{{e.g. .card}}`
- Consistent padding, border-radius, and box-shadow

### Dark Mode _(if applicable)_

- Toggle mechanism: `{{e.g. body class .dark | prefers-color-scheme media query | data-theme attribute}}`
- Inverts: `{{describe what changes — background, text colors, etc.}}`
