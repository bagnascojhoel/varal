# .ai/ — AI Agent Documentation

This directory contains per-feature decisions, design mockups, product docs, and
historical references. Project-level guidelines and templates have been migrated
to `.claude/skills/`.

## Directory Structure

```
.ai/
  design/         # Visual design iterations (HTML/CSS mockups), organized by version
  features/       # Per-feature ADRs, implementation plans, and summaries
  product/        # Lean canvas, PRDs, user stories
  references/     # Old code kept for historical context (not production code)
```

## When to Use Each Directory

| Task | Where to look |
|------|---------------|
| Understanding past design decisions | `features/<feature-name>/ADR-*.md` |
| Understanding the visual history of the UI | `design/` |
| Understanding the previous version of the app | `references/` |
| Product vision and user stories | `product/` |

## Conventions

- **ADR files** are named `ADR-YYYY-MM-DD.md` and live in `features/<feature-name>/`.
- **Implementation plans** are named `implementation-plan.md` and live alongside the ADR.
- **Summaries** (`SUMMARY.md`, `IMPLEMENTATION-COMPLETE.md`) are written after a feature ships.
- Files in `design/` and `references/` are read-only historical context.

## Skills (migrated)

The following docs and templates have been migrated to `.claude/skills/`:

| Former location | Skill |
|-----------------|-------|
| `docs/style-guide.md`, `docs/ui-ux-rules.md`, `docs/atomic-design-standards.md` | `frontend-implementation` |
| `docs/next-architecture.md`, `docs/presentation-layer.md` | `ports-and-adapters` |
| `docs/semantic-commits.md` | `commit-message` |
| `templates/ADR.md` | `write-adr` |
| `templates/implementation-plan.md` | `write-implementation-plan` |
| `templates/product-requirements-description.md` | `product-context` |
