# Write an Implementation Plan

Guide for creating implementation plans for multi-file features or architectural changes.

## When to Create a Plan

- New features requiring multiple file changes
- Architectural changes affecting domain/application/infrastructure layers
- Breaking changes to existing interfaces
- Complex UI implementations requiring design system compliance

## File Location

```
.ai/features/<feature-name>/implementation-plan.md
```

Co-locate with the feature's ADR if one exists.

## Template

Use the template at `templates/implementation-plan.md` (relative to this skill folder). Copy it to the target location and fill in all sections.

## Section Guide

| Section | Purpose |
|---------|---------|
| Summary | 3–5 sentence overview + key architectural principles |
| Analysis — Current State | Existing files, behavior, limitations, dependencies |
| Analysis — Impact | Table: layer → components affected → change type |
| Domain Layer Changes | Interface/type changes, method signatures, breaking vs non-breaking |
| Infrastructure Layer Changes | Adapter implementation strategy, error handling, edge cases |
| Application Services Changes | Method updates, caching, orchestration logic |
| UI Layer Changes | Server vs client decisions, props, event handlers |
| Testing Strategy | Unit tests, integration tests, test cases to cover |
| Data/Configuration Changes | New files, env vars, naming conventions |
| Validation | Automated checks + manual verification checklist |

## Implementation Order

Always follow this layer order to minimize broken intermediate states:

1. **Domain** — entities, ports, domain services
2. **Infrastructure** — adapters implementing new/changed ports
3. **Application Services** — orchestration updates
4. **UI** — components, pages, API routes
5. **Tests** — unit, integration, e2e

## Rules

- Reference concrete file paths, not abstract descriptions
- Each task should be independently executable
- Include acceptance criteria per task
- Note breaking vs non-breaking changes explicitly
- Run tests after completing each layer
