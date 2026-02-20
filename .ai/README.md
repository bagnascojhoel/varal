# .ai/ — AI Agent Documentation

This directory contains project-specific standards, templates, and context for AI coding agents
(Claude Code and similar tools). It is the single source of truth for project conventions that
agents should follow.

## Directory Structure

```
.ai/
  docs/           # Permanent project-level guidelines — read before implementing features
  design/         # Visual design iterations (HTML/CSS mockups), organized by version
  features/       # Per-feature ADRs, implementation plans, and summaries
  references/     # Old code kept for historical context (not production code)
  templates/      # Document templates — copy when starting a new feature or decision
```

## When to Use Each Directory

| Task | Where to look |
|------|---------------|
| Implementing a frontend feature | `docs/ui-ux-rules.md`, `docs/style-guide.md` |
| Applying the component/design system | `docs/atomic-design-standards.md` |
| Writing a commit message | `docs/semantic-commits.md` |
| Starting a new multi-file feature | `templates/implementation-plan.md` |
| Recording a significant architectural decision | `templates/ADR.md` |
| Understanding past design decisions | `features/<feature-name>/ADR-*.md` |
| Understanding the visual history of the UI | `design/` |
| Understanding the previous version of the app | `references/` |

## Conventions

- **ADR files** are named `ADR-YYYY-MM-DD.md` and live in `features/<feature-name>/`.
- **Implementation plans** are named `implementation-plan.md` and live alongside the ADR.
- **Summaries** (`SUMMARY.md`, `IMPLEMENTATION-COMPLETE.md`) are written after a feature ships.
- Files in `docs/` are stable guidelines — edit them only when conventions genuinely change.
- Files in `design/` and `references/` are read-only historical context.

## Reusable Templates

The following files are project-agnostic and can be copied to new projects:

| Template | Purpose |
|----------|---------|
| `templates/ADR.md` | Blank ADR with all standard sections and placeholder text |
| `templates/implementation-plan.md` | Blank implementation plan for multi-layer features |
| `docs/style-guide.template.md` | Style guide skeleton with `{{PLACEHOLDER}}` values |
| `docs/ui-ux-rules.md` | Generic mobile-first, accessibility, and performance rules |
| `docs/atomic-design-standards.md` | Generic BEM + atomic design component rules |
| `docs/semantic-commits.md` | Conventional Commits standard and rules for AI agents |
| `CLAUDE.md.template` _(root)_ | Minimal CLAUDE.md scaffold for new projects |
