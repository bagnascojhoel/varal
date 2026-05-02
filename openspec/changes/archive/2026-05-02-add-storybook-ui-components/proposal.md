## Why

UI components in `app/_components/` are tightly coupled to Next.js routing and
server data, making them hard to develop and test in isolation. Storybook
provides a dedicated environment to build, document, and visually verify UI
components without needing a running backend or specific app state.

## What Changes

- Add Storybook 8 (with Next.js integration via `@storybook/nextjs`) to the
  project
- Create `src/ui/` as the new home for design-system-level components
  (primitives, composites) that can be developed independently of app logic
- Migrate or extract presentational parts of existing `app/_components/` into
  `src/ui/` as appropriate
- Add `.storybook/` configuration directory
- Add story files (`*.stories.tsx`) alongside each `src/ui/` component

## Capabilities

### New Capabilities

- `storybook-ui-library`: A Storybook-powered component library under `src/ui/`
  with stories for each UI primitive and composite component, enabling isolated
  development, visual documentation, and interaction testing.

### Modified Capabilities

<!-- No existing capability specs are changing their requirements -->

## Impact

- **New directory**: `src/ui/` — design-system components (no Next.js data
  dependencies)
- **New directory**: `.storybook/` — Storybook config (`main.ts`, `preview.ts`)
- **`package.json`**: New devDependencies (`storybook`, `@storybook/nextjs`,
  `@storybook/addon-essentials`, etc.)
- **`app/_components/`**: Presentational components may be extracted to
  `src/ui/`; container logic stays in `app/_components/`
- **No changes** to domain, application services, infrastructure, or API routes

## UI/UX Design

Components in `src/ui/` should follow the existing Tailwind CSS design tokens
(colors, typography, spacing) already established in `app/globals.css` and
`tailwind.config.ts`. Stories should demonstrate all visual states: default,
hover, active, disabled, and error. Use Storybook controls to expose component
props for interactive exploration. Keep story titles namespaced under
`UI/<ComponentName>`.
