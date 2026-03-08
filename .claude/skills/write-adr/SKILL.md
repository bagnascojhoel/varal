---
name: write-adr
description: Write Architecture Decision Records documenting significant technical choices. Use when a new feature, refactor, or infrastructure change requires recording the decision context, alternatives considered, and trade-offs.
---

# Write an ADR

Guide for writing Architecture Decision Records in this project.

## When to Write an ADR

- New feature requiring architectural choices
- Significant refactor affecting multiple layers
- Infrastructure/integration changes
- Any decision with trade-offs worth documenting

## Scope — What an ADR Is and Isn't

An ADR records **the decision and its rationale**, not the full feature spec.

| Concern | Where it belongs |
|---------|-----------------|
| Product requirements, user stories, acceptance criteria | `product-context` skill / `.ai/product/` |
| Step-by-step file changes, implementation order, test strategy | `write-implementation-plan` skill |
| The architectural choice, alternatives, trade-offs, consequences | **This ADR** |

If the ADR needs acceptance criteria or detailed implementation steps, reference the PRD or implementation plan rather than duplicating them.

## File Location

```
.ai/features/<feature-name>/ADR-YYYY-MM-DD.md
```

Use kebab-case for `<feature-name>`.

## Template

Use the template at `templates/ADR.md` (relative to this skill folder). Copy it to the target location and fill in all sections.

## Section Guide

| Section | Purpose | Detail Level |
|---------|---------|-------------|
| Title & Metadata | Identify the decision, status, date, decision makers | One-liners; status must be Draft/Approved/Rejected |
| Context | Problem statement, constraints, user journey | 1-2 paragraphs; constraints as bullet list; journey only if it clarifies the problem |
| Decision | Chosen approach, why, alternatives considered | 1-2 paragraphs + comparison table for alternatives |
| Architectural Design | Component diagrams, data flow | ASCII diagrams + brief prose; NO implementation code |
| File Inventory | Files to create/modify | File list with [NEW]/[MODIFY] and one-line intent; NO code snippets |
| Consequences | Positive, negative, risks with mitigations | Bullet lists; risks in a table with concrete mitigations |
| References | Related files, external docs | All paths must be verified as valid |

## Typical Workflow

1. Read the relevant user story or PRD from `.ai/product/`
2. Research existing code to understand current architecture
3. Write the ADR using this template
4. Follow up with `write-implementation-plan` if the change is multi-layered

## Rules

- One ADR per significant decision — don't combine unrelated decisions
- State the recommended solution clearly and justify it
- List alternatives considered with pros/cons
- Keep diagrams as ASCII art for version control friendliness
- Reference concrete file paths, not abstract layer names
- No implementation code in the ADR — save that for the implementation plan
- Before finalizing, verify all file paths in the References section exist
