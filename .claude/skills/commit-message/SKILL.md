---
name: commit-message
description: Write conventional commit messages following the project's commit standards. Use when creating git commits to ensure correct type, scope, format, and breaking change notation.
---

# Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

## Types

| Type | When to use |
|------|-------------|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `refactor` | Code change that is neither fix nor feature |
| `style` | Formatting, whitespace, visual-only (no logic) |
| `chore` | Maintenance: deps, config, tooling, CI |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `revert` | Reverts a previous commit |

## Rules

- Use only types from the table — no custom types
- Summary: imperative mood, lowercase, no period, ≤72 chars
- Scope: recommended when clearly scoped (`domain`, `services`, `components`, `api`, `ui`, `.ai`, `config`)
- Body: optional, explain *why* not *what*
- Never amend published commits unless user explicitly asks

## Breaking Changes

Append `!` after type/scope + `BREAKING CHANGE:` footer:

```
feat(api)!: rename /wash-recommendation to /forecast

BREAKING CHANGE: the old route is removed; update all clients.
```

## Examples

```
feat(ui): add hourly precipitation timeline bars
fix(domain): correct stillUsable threshold from 2mm to 1mm
chore(deps): upgrade next to 16.1.0
docs(.ai): add semantic commit standard
refactor(services): extract open-meteo base URL to constant
```
