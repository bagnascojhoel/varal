# Product Roadmap

This folder is the **living roadmap** for Varal. It contains future features
waiting to enter an openspec change.

## How It Works

- **Each file is a future feature** — not yet designed or specified
- **Presence = Not done** — if the file exists, the feature hasn't shipped
- **Removal = Done** — when a feature enters an openspec change, delete the file
  from here (it now lives in `openspec/changes/`)

## Folder Structure

### `wash-forecast/`

The active development area. Contains stories for the core Wash Forecast feature
(recommendation engine, forecasts, user personalization).

- `US-XX.md` — individual feature files
- `assets/` — mockups, wireframes, diagrams, and screenshots

### `future-features/`

Post-MVP features and experimental directions. Most features here do not yet
have individual story files.

- `overview.md` — summary table of all future epics (US-15 to US-45)
- `assets/` — supporting materials

## Story Format

Each story file follows this structure (no frontmatter, no status field):

```markdown
# US-XX — Feature Title

## História

Como [Persona], quero [ação], para que [benefício].

## Contexto

Why this feature matters; what pain it solves.

## Questões em Aberto

- Open questions for the explore session
- Key tradeoffs to consider

## Restrições

- Known technical constraints
- Product requirements or guardrails

## Relacionados

US-XX, US-YY — other stories that naturally go together
```

**Before an explore session**, enrich the `Contexto`, `Questões em Aberto`, and
`Restrições` sections. Add mockups or diagrams to `assets/`.

## Adding a New Feature

1. Create a `US-XX.md` file in the appropriate folder (usually `wash-forecast/`
   for MVP features, `future-features/` for post-MVP)
2. Fill in the story statement and add placeholders for the other sections
3. Before explore: add context, open questions, and supporting assets

## Removing a Feature (When It Ships)

When a feature enters an openspec change:

1. The openspec change lives in `openspec/changes/`
2. Delete the corresponding `US-XX.md` file from here
3. The feature is now officially designed; the roadmap no longer tracks it

## Assets

All supporting materials (mockups, diagrams, reference images) live in the
`assets/` subfolder of the relevant feature area. Reference them from the story
file:

```markdown
## Ativos

- assets/login-flow-sketch.png
- assets/drying-conditions-matrix.xlsx
```

## Other Files

- `varal-prd.md` — Product Requirements Document. Core vision, personas, scope,
  and domain glossary. Keep updated as the product evolves.
