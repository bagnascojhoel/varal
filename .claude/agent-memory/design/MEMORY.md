# Design Agent Memory

## Design System Tokens (established in v3, confirmed in v4)

- **Background**:
  `linear-gradient(170deg, #0b0d19 0%, #131726 25%, #1c2033 50%, #20243e 75%, #181b2d 100%)`
- **Glass**: `rgba(255,255,255,0.07)` bg, `blur(24px)`,
  `1px solid rgba(255,255,255,0.12)` border
- **Glass-inner**: `rgba(255,255,255,0.05)` bg, `blur(8px)`,
  `1px solid rgba(255,255,255,0.08)` border
- **Text primary**: `rgba(255,255,255,0.90)` — **secondary**:
  `rgba(255,255,255,0.55)` — **muted**: `rgba(255,255,255,0.32)`
- **Status green**: `#4ade80` — **status amber**: `#fbbf24` — **status red**:
  `#f87171`
- **Font**: Inter 200–400 from Google Fonts CDN
- **Min touch target**: 56px for primary rows, 44px for all interactive elements
- **Border radius**: `rounded-2xl` (1rem) for cards/buttons, `rounded-3xl`
  (1.5rem) for modals

## Established Patterns

- **Checked-state accent**: 3px green `border-left` on selected tiles (mirrors
  day-card accent bars)
- **Session group collapse**: chevron `rotate(-90deg)` = collapsed,
  `rotate(0deg)` = expanded
- **Modal layout**: bottom-sheet on mobile (`align-items:flex-end`), centered on
  `>= 480px`
- **Background dimming when modal open**: `filter:brightness(0.35) blur(1px)` on
  page content
- **CTA buttons**: full-width, `min-height:52px`, colored glass variant (green
  for start, red for danger)
- **Toggle pill groups**: flex row, each pill `min-height:44px`, one active
  (colored), others muted

## Version History — Home feature

- v1 — initial layout
- v2 — gif-bg carousel
- v3 — time-aware (night/day theme, live clock, timeline bars) → archived to
  `product/design/home/archive/v3/`
- v4 (current) — clothing type recommendation (US-01): "Por tipo de roupa"
  section in DayCard → `product/design/home/latest/`

## Version History — Drying Session Tracker

- latest — start-session, active-session, end-session-modal →
  `product/design/drying-session-tracker/latest/`

## Key Files

- Design versions: `product/design/<feature>/latest/` (current),
  `product/design/<feature>/archive/v<N>/`
- Skill reference: `.claude/skills/frontend-implementation/SKILL.md`
- Feature ADRs: `product/user-stories/<feature>/`

## Cross-Session Design Patterns

- [Clothing Type Recommendation Patterns](clothing_recommendation_patterns.md) —
  pill vocab and section structure for US-01
