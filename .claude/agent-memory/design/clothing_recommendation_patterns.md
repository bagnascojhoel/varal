---
name: Clothing Type Recommendation Design Patterns
description: Pill vocabulary, section structure, and scoring rationale for the US-01 per-clothing-type section inside DayCard
type: project
---

Established in v4 of the home DayCard design (US-01):

**Two clothing categories (only):** "Pesadas" (👖) and "Leves" (👕). Adding
delicates/wool/synthetic is deferred — expand in v5 once domain model is proven.

**Pill vocabulary reused, display text differs:**

| Value  | Pill class  | Text              |
|--------|-------------|-------------------|
| clear  | pill-clear  | "Ótimo dia"       |
| yes    | pill-yes    | "Pode estender"   |
| unsure | pill-unsure | "Com ressalvas"   |
| no     | pill-no     | "Não recomendado" |

**Section structure:** Single `glass-inner` panel grouping both rows, with a
thin inner divider (`rgba(255,255,255,0.06)`) — dimmer than the section divider
— to signal they are related outputs of the same classification.

**Supplement, not replace, window pills.** Window pills answer *when* to hang;
clothing pills answer *what* to wash. Both remain visible.

**No time-aware logic on clothing section.** Full-day classification only —
even in afternoon state when the morning window is hidden, the clothing verdict
still reflects the full day.

**Why:** How to apply: When adding further per-type recommendation features,
follow this same grouped glass-inner pattern and pill vocabulary. Keep
classifications to 2–3 types maximum per card.
