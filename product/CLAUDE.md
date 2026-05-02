# Product Roadmap — Guide for AI Agents

This document explains how to read and use the product roadmap folder during openspec explore sessions.

## What This Folder Is

This folder contains the **product roadmap** — future features that have not yet been formally specified in openspec. Each file is a user story representing a single feature or closely related feature group.

## Lifecycle

1. **Roadmap phase** (now): Story lives in `product/`. Minimal initial content.
2. **Before explore**: User enriches the story with context, open questions, and supporting assets.
3. **Explore session**: AI reads the story (and all assets) as the starting context for a conversation about the feature. The goal is to move from "what should this do?" to "how should we build it?"
4. **Specification phase**: A formal openspec change is created in `openspec/changes/`. The story is **deleted** from here.
5. **Implementation phase**: The change is worked through; once archived in `openspec/changes/archive/`, the feature is officially done.

## How to Use During an Explore Session

When launching an explore session for a feature:

1. **Load the story file** — this is the core context. It explains what the user needs and what questions remain.
2. **Load the assets** — if `assets/` contains mockups, diagrams, or wireframes, they are part of the explore conversation.
3. **Use the "Questões em Aberto" section as an agenda** — these are the key things to figure out.
4. **Enrich the story during the session** — as you explore, update the story with new insights, constraints, or refined open questions.

The story is not a finished spec; it's a conversation starter.

## Story File Format

Each `US-XX.md` file has these sections (in order):

### `# US-XX — Title`
The user story number and a one-line feature name.

### `## História`
Standard user story format: `Como [Persona], quero [ação], para que [benefício].`

This section is pre-filled and should not change unless the core need shifts.

### `## Contexto`
Why this feature exists. What pain does it address? What is the business or user value? One paragraph. This section may have a `<!-- TODO -->` placeholder for exploration.

### `## Questões em Aberto`
A bullet list of questions that the explore session should answer. Examples:
- "Should this feature be per-session or global?"
- "How does this interact with the X flow?"
- "What are the acceptance criteria for success?"

These questions drive the explore conversation.

### `## Restrições`
Known constraints — hard technical requirements, privacy rules, product guardrails, or scope boundaries. Examples:
- "Must work without authentication"
- "No server-side persistence (localStorage only)"
- "Cannot add a new external API"

### `## Relacionados`
References to other US numbers that are closely related (dependencies, shared context, should be done together).

## Enriching a Story

Before an explore session, a user may provide:

1. **Mockups or wireframes** — add to `assets/`, reference in `Contexto` or add new `## Ativos` section
2. **Additional context** — expand the `Contexto` section
3. **Known constraints** — populate `Restrições`
4. **Explicit questions** — add to `Questões em Aberto`

Do not invent context. If a section is unclear or missing, ask the user to fill it in, or keep the `<!-- TODO -->` placeholder and note that it will be addressed during explore.

## Adding a New Story to the Roadmap

When the user asks to add a new feature to the roadmap:

1. Create a new file: `product/<epic-folder>/US-XX-kebab-case-name.md`
2. Fill in the `História` section (the core user need)
3. Add placeholders for the other sections:

```markdown
# US-XX — Feature Name

## História
Como [Persona], quero [ação], para que [benefício].

## Contexto
<!-- TODO: add context before explore session -->

## Questões em Aberto
- <!-- TBD -->

## Restrições
<!-- TODO: list known constraints -->

## Relacionados
<!-- None yet, or link to related US -->
```

## Removing a Story (When It Ships)

When a story enters an openspec change:

1. The formal specification is created in `openspec/changes/<feature-name>/`
2. Delete the `US-XX.md` file from here
3. The roadmap no longer tracks it; openspec owns it now

## Current Folders

- **`wash-forecast/`** — MVP feature stories (US-04 to US-14, US-53). Actively evolving.
- **`future-features/overview.md`** — Summary of post-MVP epics (US-15 to US-45). Most don't have individual files yet.

## Key Patterns

- **No status field**: If the story exists, it's not done. Don't track `status: draft` or `status: in-progress` here.
- **No frontmatter**: Clean Markdown. Just the sections above.
- **Assets are co-located**: Mockups and diagrams live in the same folder as the story (`assets/`). Keep them together.
- **Personas are defined in PRD**: Don't repeat persona definitions. Reference them from `varal-prd.md`.
- **Related stories stay in the roadmap together**: If US-XX and US-YY should be done in the same openspec change, keep them both in the roadmap until that change is created, then delete both.

## How This Differs from Openspec

- **Roadmap** (`product/`): Informal, evolving, decision-making phase. Questions outnumber answers.
- **Openspec** (`openspec/`): Formal, settled specification. Decisions are documented; implementation tasks are enumerated.

The roadmap feeds into openspec. Once explore reaches answers and the feature is scoped, that is when an openspec change is created.
