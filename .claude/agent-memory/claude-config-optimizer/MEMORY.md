# Claude Config Optimizer — Agent Memory

## Project Product Docs Layout
- `.ai/product/` — lean canvas, user stories, PRDs
- `.ai/features/<name>/` — per-feature ADRs and implementation plans
- `.claude/skills/` — AI-targeted skill docs and templates
- `.ai/product/PRD-template.md` is a duplicate of `.claude/skills/product-context/templates/PRD.md` (identical)

## Stale References Found
- `.claude/agent-memory/product-owner/MEMORY.md` references `.human/` paths that no longer exist (migrated to `.ai/product/`)

## Skill Writing Patterns
- Skills should reference existing docs, not duplicate their content
- "When to use this skill" section at the top helps agents know when to consult it
- Cross-reference tables (Document → Path → Contains) are high-signal for navigation
- Feature status tables help agents understand what's shipped vs planned
- Checklists > prose for validation/review guidance
