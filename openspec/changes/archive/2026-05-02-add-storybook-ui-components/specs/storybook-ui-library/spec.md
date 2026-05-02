## ADDED Requirements

### Requirement: Storybook is runnable
The project SHALL have a working Storybook instance that can be started locally and serves a component catalogue in the browser.

#### Scenario: Developer starts Storybook
- **WHEN** the developer runs `npm run storybook`
- **THEN** Storybook starts on a local port and opens in the browser without errors

#### Scenario: Storybook builds statically
- **WHEN** the developer runs `npm run build-storybook`
- **THEN** a static build is produced in `storybook-static/` without errors

### Requirement: Storybook resolves project styles and aliases
The Storybook instance SHALL render components with full Tailwind CSS v4 styles and resolve the `@/*` TypeScript path alias.

#### Scenario: Tailwind styles apply in Storybook
- **WHEN** a component using Tailwind utility classes is rendered in a story
- **THEN** the correct styles are applied and visible in the Storybook canvas

#### Scenario: Path alias resolves
- **WHEN** a component imports a module using `@/` prefix
- **THEN** Storybook resolves the import without a build error

### Requirement: src/ui/ is the home for design-system components
The project SHALL have a `src/ui/` directory that contains purely presentational React components with no dependency on Next.js routing, server context, or application services.

#### Scenario: Component in src/ui/ has no Next.js data dependencies
- **WHEN** a component is placed in `src/ui/`
- **THEN** it MUST NOT import from `next/navigation`, `next/server`, or any application service

#### Scenario: Component in src/ui/ is importable from app/_components/
- **WHEN** an app component in `app/_components/` imports a component from `src/ui/`
- **THEN** the import resolves correctly and TypeScript reports no errors

### Requirement: Every src/ui/ component has a story file
Each component added to `src/ui/` SHALL have a co-located `*.stories.tsx` file that documents its visual states.

#### Scenario: Story file exists for each component
- **WHEN** a new component is added to `src/ui/`
- **THEN** a corresponding `ComponentName.stories.tsx` file MUST exist in the same directory

#### Scenario: Story exposes component states via controls
- **WHEN** a developer opens a component story in Storybook
- **THEN** the Controls panel shows the component's props and allows interactive changes

#### Scenario: Story title follows naming convention
- **WHEN** a story file is opened in Storybook
- **THEN** it appears under the `UI/` group in the sidebar (e.g., `UI/DayCard`)
