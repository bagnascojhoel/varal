---
name: product-context
description:
  Understand Varal's product vision, audience, scope boundaries, and feature
  validation criteria. Use when evaluating whether a feature belongs in Varal,
  writing PRDs, writing user stories, or making UX decisions that need product
  alignment.
---

# Product Context — Varal

Core product knowledge for making aligned decisions.

## When to Use This Skill

- Evaluating whether a proposed feature belongs in Varal
- Writing or reviewing PRDs and user stories
- Making UX decisions that need product alignment
- Prioritizing work or scoping an MVP

## One-Liner

**"Should I wash my clothes today?"** — a web app that gives a clear YES/NO
recommendation based on weather data.

## Core Values

| Value             | Meaning                                             |
| ----------------- | --------------------------------------------------- |
| **Clarity**       | One question, one answer, no clutter                |
| **Trust**         | Decisions backed by real weather data               |
| **Accessibility** | Works for non-technical users; GPS or Brazilian CEP |
| **Delight**       | Small moments of personality make it memorable      |

## Feature Validation Checklist

Before approving any feature, verify ALL of these:

1. **Audience fit** — Would a person who air-dries clothes in a Brazilian
   apartment understand and benefit from this?
2. **Scope fit** — Does it serve laundry-day decisions? (wash forecast, label
   decoder, or laundry knowledge base)
3. **Simplicity** — Does the UI stay clean? Is the user journey ≤ 3
   interactions?
4. **Data integrity** — Does it work within existing data sources (Open-Meteo,
   Nominatim, ViaCEP) or require a justified new one?
5. **Zero-friction** — Does it preserve the no-sign-up, instant-answer
   experience?

If any check fails, the feature is out of scope or needs redesign.

## Product Docs Reference

All detailed product documentation lives in `.ai/product/`:

| Document            | Path                                  | Contains                                                  |
| ------------------- | ------------------------------------- | --------------------------------------------------------- |
| Lean Canvas         | `.ai/product/lean-canvas.md`          | Problem, audience, UVP, revenue model, key metrics        |
| User Stories        | `.ai/product/user-stories.md`         | All user stories grouped by feature, with MoSCoW priority |
| Per-feature stories | `.ai/product/user-stories/<feature>/` | Detailed stories for specific features                    |
| Existing PRDs       | `.ai/product/PRD-*.md`                | Approved PRDs (use as examples)                           |

**Always read the lean canvas before writing a new PRD or evaluating a
feature.**

## Feature Status

| Feature                | Status        | Docs                                                                                |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------- |
| Wash Forecast          | Shipped (MVP) | `.ai/features/refactor-ports-and-adapters/`                                         |
| Drying Session Tracker | In Progress   | `.ai/features/drying-session-tracker/`, `.ai/product/PRD-drying-session-tracker.md` |
| Label Decoder          | Not Started   | —                                                                                   |
| Laundry Knowledge Base | Not Started   | —                                                                                   |

## Writing User Stories

- Format: `As a [persona], I want [goal] so that [reason].`
- Add to `.ai/product/user-stories.md` under the appropriate feature group
- Include task tags: `design`, `front-end`, `back-end`, `weather research`
- Number sequentially (continue from the last number in the file)
- Personas: **user** (end-user) or **Laundry Expert** (developer/backoffice)

## Writing PRDs

Use the template at `templates/PRD.md` (relative to this skill folder).

Reference the existing PRD at `.ai/product/PRD-drying-session-tracker.md` as a
concrete example of the template filled in.

### PRD Checklist

- [ ] Problem statement references lean canvas problems
- [ ] Personas match or refine the audience from lean canvas
- [ ] User stories have MoSCoW priority
- [ ] Scope explicitly lists what's OUT
- [ ] Technical considerations reference the Ports & Adapters architecture
- [ ] Saved to `.ai/product/PRD-<feature-name>.md`
