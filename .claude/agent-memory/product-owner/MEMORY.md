# Product Owner — Agent Memory

See topic files for details. This file is loaded into every session (keep under
200 lines).

## Personas

- **Washer** — primary persona. Brazilian household user, non-technical,
  mobile-first. Wants a zero-friction wash recommendation. Uses the public app.
- **Laundry Expert** — secondary persona. Domain expert in washing/drying. Uses
  the backoffice only. Currently registers drying sessions (training data).
  Future: will adjust classification thresholds.
- Full definitions: `.human/personas.md`

## Key Scope Decisions

- Varal's core value: one question ("should I wash today?"), one answer.
- Backoffice is exclusively for Laundry Expert — never exposed to Washers.
- Laundry Expert work improves recommendation accuracy over time but has no
  immediate effect on what the Washer sees (for now).
- Threshold management by Laundry Expert is explicitly deferred (future
  iteration).

## Persona Naming

- "product owner" in early user stories was a placeholder — replaced with
  "Laundry Expert" in `.human/user-stories.md` (stories 46–52).
- Do NOT use "product owner" as a persona in any requirement document.

## Product Documents Location

- `.human/` — product docs (user-stories.md, personas.md, PRD-template.md)
- `.ai/` — technical/agent docs
- `.claude/agent-memory/product-owner/` — this memory directory

## Links to Topic Files

_(none yet — add as topics grow)_
