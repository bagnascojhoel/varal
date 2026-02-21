# Semantic Commit Standard

All commits in this project follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

- **type** — required; what kind of change (see table below)
- **scope** — optional; the area of the codebase affected (e.g. `domain`, `api`, `ui`, `deps`)
- **summary** — required; imperative, lower-case, no period, ≤ 72 chars
- **body** — optional; free prose explaining *why*, not *what*
- **footer** — optional; `BREAKING CHANGE:`, `Closes #N`, co-authors, etc.

## Types

| Type | When to use |
|------|-------------|
| `feat` | Adds a new user-facing feature |
| `fix` | Fixes a bug |
| `refactor` | Code change that is neither a fix nor a feature |
| `style` | Formatting, whitespace, or visual-only changes (no logic) |
| `chore` | Maintenance tasks: deps, config, tooling, CI |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `revert` | Reverts a previous commit |

## Breaking Changes

Append `!` after the type/scope, and add a `BREAKING CHANGE:` footer:

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

## Rules for AI Agents

- Always use one of the types from the table above — no custom types.
- Keep the summary in the imperative mood ("add", "fix", "remove" — not "added" or "fixes").
- Scope is recommended when the change is clearly scoped to one layer (`domain`, `services`, `components`, `api`, `ui`, `.ai`, `config`).
- Body is optional but encouraged when the *why* is not obvious from the summary.
- Never amend published commits unless the user explicitly asks.
