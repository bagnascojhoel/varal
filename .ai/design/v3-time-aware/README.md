# Design v3 — Time-Aware Cards

## What this designs

Extends v2 with three distinct time-of-day states that determine what
information is shown on today's card. The goal is to never surface stale or
irrelevant data: past time windows are hidden, and when the day is entirely over
the interface re-orientates toward the coming days.

## Time states

| State         | Trigger          | Behavior                                                                                                                                                                            |
| ------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **morning**   | `hour < 12`      | Today card shows both windows (Manhã + Tarde). All timeline bars visible. No marker.                                                                                                |
| **afternoon** | `12 ≤ hour < 21` | Morning window hidden. Past bars grayed. A thin vertical "now" line marks the current hour on the timeline.                                                                         |
| **night**     | `hour ≥ 21`      | Today card is dimmed (opacity 0.38) with "encerrado" badge. On mobile: carousel auto-scrolls to Tomorrow. On desktop: today hidden, Day+3 fills the grid. 4th carousel dot appears. |

"Late at night" threshold is **21:00** — after this time it is no longer
practical to wash clothes with enough daylight to dry them today.

## Design decisions

- **`body[data-time]` as the single source of truth**: One attribute controls
  the morning window visibility, past bar styling, now-marker visibility, today
  card dimming, day+3 card visibility, and the 4th dot. Easier to set
  server-side and avoids scattered logic.

- **Past bars gray, not removed**: Keeping the bars visible (but desaturated to
  `rgba(255,255,255,0.10)`) lets the user understand the full shape of the day
  at a glance. Removing them would make the chart jump in width.

- **Now-marker as a thin vertical line with dot cap**: Inspired by timeline
  scrubbers and audio waveform players. The dot cap at the top provides a clear
  focal point without being distracting. Visible only in afternoon state (when
  it is actionable).

- **Morning window hidden, not grayed**: Graying it out would still draw
  attention to unusable information. `display:none` is intentional — the
  afternoon "Tarde" window shifts up and the card remains clean.

- **Today card dimmed but not removed from the carousel**: At night, swiping
  left still reveals today's card. This lets users reference the day's data
  (e.g., to understand why tomorrow matters). The carousel starts at Tomorrow,
  not at a hidden position.

- **Desktop night: today column hidden, Day+3 appears**: On desktop there is no
  carousel, so hiding today frees a grid slot for Day+3 without changing the
  3-column layout. Mobile keeps today accessible via swipe.

- **"Encerrado" badge**: A subtle uppercase pill below the weekday label — not a
  banner or overlay. Avoids visual noise while still communicating the state.
  Rendered in DOM at all times; CSS controls visibility.

- **Server-side preferred for time state**: The mockup JS auto-detects time on
  load, but the implementation comment specifies that the server component
  should set `data-time` to avoid a hydration flash.

## Screens / files

| File         | Describes                                                              |
| ------------ | ---------------------------------------------------------------------- |
| `index.html` | All three time states. Use the **HORA** demo switcher to preview each. |

## Open questions for implementation

- [ ] What is the exact "late night" cutoff? 21:00 is a reasonable default but
      could be a configurable constant in `domain/wash-decision.ts`.
- [ ] Should the afternoon state also hide the morning window bars from the
      timeline, or just the window row? Currently only the row is hidden.
- [ ] Should the "now" marker show a tooltip with the current time on hover?
- [ ] On night state with tomorrow being a bad wash day, should the carousel
      auto-scroll to the first _good_ day instead of always Tomorrow?

## Next version ideas

- Animate the morning window row's disappearance (slide-up + fade) rather than
  instant `display:none`.
- Add a subtle cross-out effect on the morning icon (🌅 → strikethrough) as an
  additional visual cue.
- For the night state, consider a small dismissible banner: "Hoje já passou.
  Veja os próximos dias →" that auto-dismisses after 3 seconds.
