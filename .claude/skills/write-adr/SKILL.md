# Write an ADR

Guide for writing Architecture Decision Records in this project.

## When to Write an ADR

- New feature requiring architectural choices
- Significant refactor affecting multiple layers
- Infrastructure/integration changes
- Any decision with trade-offs worth documenting

## File Location

```
.ai/features/<feature-name>/ADR-YYYY-MM-DD.md
```

Use kebab-case for `<feature-name>`.

## Template

Use the template at `templates/ADR.md` (relative to this skill folder). Copy it to the target location and fill in all sections.

## Section Guide

| Section | Purpose | Quality Check |
|---------|---------|---------------|
| Title & Metadata | Identify the decision, status, date, decision makers | Status must be Draft/Approved/Rejected |
| Feature Analysis | User-facing goal, type, functional + UI/UX requirements | Requirements are testable statements |
| Context | Problem statement, user journey, acceptance criteria | Criteria are checkboxable |
| Decision | Chosen approach + why, alternatives considered | Advantages justify the choice over alternatives |
| Architectural Design | Component diagrams, data flow, UI states | ASCII diagrams showing structure |
| Implementation Details | File structure (NEW/MODIFY), non-obvious constraints | Every file listed with intent |
| Consequences | Positive, negative, risks with mitigations | Risks have concrete mitigations |
| References | Related files, external docs | All paths are valid |

## Rules

- One ADR per significant decision — don't combine unrelated decisions
- State the recommended solution clearly and justify it
- List alternatives considered with pros/cons
- Keep diagrams as ASCII art for version control friendliness
- Reference concrete file paths, not abstract layer names
