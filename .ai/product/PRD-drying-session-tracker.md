# PRD: Drying Session Tracker (Backoffice)

> **Status:** Draft **Author:** bagnascojhoel **Date:** 2026-02-28 **Version:**
> 0.1

---

## 1. Problem Statement

Varal's wash recommendations are currently driven by heuristic thresholds
(`precipitationProbabilityMax`, `precipitationSum`). These thresholds were
chosen by intuition — no empirical dataset links actual weather conditions to
real drying outcomes.

Without real data:

- Accuracy cannot be measured objectively.
- Thresholds cannot be tuned or replaced with learned models.
- Edge cases (high humidity but no rain, strong wind, covered balcony) are
  guessed rather than observed.

This PRD defines a backoffice tool that lets the developer record real drying
sessions: what was hung, when it dried, and what the weather was doing
throughout. The resulting dataset will be the foundation for evidence-based
recommendation logic.

---

## 2. Goals & Success Metrics

| Goal                           | Metric                                                     | Target                       |
| ------------------------------ | ---------------------------------------------------------- | ---------------------------- |
| Build labelled dataset         | Number of completed sessions                               | ≥ 50 in first 3 months       |
| Rich environmental context     | Weather snapshots per session (≥ 2 sources)                | ≥ 2 snapshots at start + end |
| Complete per-category outcomes | Sessions with driedAt recorded for all categories selected | 100%                         |

---

## 3. Target Users / Personas

### Persona 1: Developer / Product Owner (Internal User)

- **Context:** Uses the app regularly to decide when to hang laundry; has direct
  access to the `/backoffice` route.
- **Motivation:** Wants the app's recommendations to be grounded in real
  observations rather than guesswork; willing to invest effort in logging
  sessions accurately.
- **Constraints:** Single user, no authentication overhead warranted for MVP.
  Session logging must be low-friction — otherwise it won't happen consistently.

---

## 4. User Stories

_See `user-stories.md` — Feature: Drying Session Tracker (Backoffice), stories
46–52._

| Priority | Story                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Must     | Start a session by selecting clothing weight categories (story 46)             |
| Must     | Auto-record weather conditions every 15 min from multiple sources (story 47)   |
| Must     | Mark individual categories as dried during the session (story 50)              |
| Must     | End a session and record collection time + per-category dried times (story 51) |
| Must     | Sessions survive a page refresh (story 52)                                     |
| Should   | Per-category elapsed timer visible in the UI (story 48)                        |
| Should   | 30-minute browser notification to check clothes (story 49)                     |

---

## 5. Scope

### In Scope (MVP)

- `/backoffice` page — no navigation from the public app
- Session start: select one or more of 5 clothing weight categories
  (extra-light, light, medium, heavy, extra-heavy)
- Active session view: per-category elapsed timers, "Secou!" button per category
- Automatic weather snapshots every 15 minutes, pulled from ≥ 2 sources
  (Open-Meteo current conditions + OpenWeatherMap + WeatherAPI.com)
- 30-minute browser notification to remind user to check clothes
- End-session flow: modal asking for actual collection time (now vs. earlier +
  time picker) and per-category dried status / driedAt
- SQLite persistence via Prisma
- Session recovery on page load (active session detected via `localStorage`)

### Out of Scope

- Authentication / login
- Multi-user support
- Data export or visualization dashboards
- Public access to backoffice data
- Automated data analysis or model training

---

## 6. Functional Requirements

### 6.1 Session Lifecycle

- **Input:** User clicks "Start Session" and selects at least one clothing
  weight category.
- **Behavior:**
  - A new session record is created in the database with `startedAt = now()` and
    `status = ACTIVE`.
  - The session ID is stored in `localStorage` so it survives a page refresh.
  - On page load, if a session ID exists in `localStorage` and the DB record is
    `ACTIVE`, the UI resumes the active session view.
- **Output:** Active session view with per-category elapsed timers.
- **Edge cases:** User has an active session and navigates away — session
  continues in the background; returning to the page resumes it.

### 6.2 Category Tracking

- **Input:** Category checkboxes at session start; "Secou!" button per category
  during the session.
- **Behavior:**
  - Each selected category shows an elapsed timer starting from `startedAt`.
  - When "Secou!" is clicked for a category, `driedAt` is recorded immediately
    for that category. The timer stops and the category is marked as dried.
  - Categories not yet dried remain active until the session ends.
- **Output:** Per-category `driedAt` timestamps stored in the database.
- **Edge cases:** User clicks "Secou!" by accident — no undo in MVP; the time is
  recorded as-is.

### 6.3 Weather Snapshots

- **Input:** Client-side polling every 15 minutes while the session is active.
- **Behavior:**
  - The client calls a server endpoint that fans out to all configured weather
    sources (Open-Meteo current conditions, OpenWeatherMap, WeatherAPI.com)
    using Inversify `@multiInject`.
  - Each source response is stored as a separate snapshot record linked to the
    session, tagged with the source name and `recordedAt = now()`.
  - If a source fails, that snapshot is skipped/logged but polling continues.
- **Output:** `WeatherSnapshot` records in the database, one per source per
  polling interval.
- **Edge cases:** Device goes offline mid-session — missed snapshots are not
  backfilled; the gap is acceptable.

### 6.4 Notifications

- **Input:** Session becomes active; browser Notification API permission.
- **Behavior:**
  - On session start, the app requests notification permission if not already
    granted.
  - Every 30 minutes, a browser notification is sent: "Suas roupas já secaram?
    Verifique e marque no Varal."
  - If permission is denied or unavailable, the feature degrades gracefully (no
    notification, no error shown to user).
- **Output:** Browser notification displayed by the OS.
- **Edge cases:** User has the page open but the tab is in the background —
  notification still fires.

### 6.5 End Session Flow

- **Input:** User clicks "End Session".
- **Behavior:**
  - A modal appears asking:
    1. "When did you collect the clothes?" — options: "Just now" or "Earlier"
       (time picker, defaults to now minus 15 min).
    2. For each category not yet marked as dried: "Did this dry?" — Yes (records
       `driedAt` as the collection time) or "Not dried" (records
       `driedAt = null`).
  - On confirmation, the session record is updated: `endedAt = collectedAt`,
    `status = COMPLETED`.
  - `localStorage` session ID is cleared.
- **Output:** Completed session in the database; UI returns to the start screen.
- **Edge cases:** User closes the modal without confirming — session remains
  active.

---

## 7. Non-Functional Requirements

- **Performance:** Polling endpoint must respond in < 3 s under normal
  conditions (all 3 weather sources called in parallel).
- **Accessibility:** Backoffice is internal-only; WCAG compliance is a nice-to-
  have, not a hard requirement for MVP.
- **Browser support:** Latest Chrome on desktop (primary device for backoffice
  use); Notification API must be supported.
- **Offline:** No offline support required; backoffice assumes an active
  connection.

---

## 8. Design / UX

Mockup to be created in `.ai/design/` before implementation begins. Key screens:

1. **Start Session** — category selection checklist + "Start" CTA
2. **Active Session** — per-category elapsed timers, "Secou!" buttons, "End
   Session" CTA, last weather snapshot preview
3. **End Session Modal** — collection time picker + per-category dried status

---

## 9. Technical Considerations

- **Database:** SQLite via Prisma (file-based, zero additional infrastructure).
  Schema additions: `DryingSession`, `SessionCategory`, `WeatherSnapshot`.
- **New port — `CurrentWeatherRepository`:** Separate from the existing
  `WeatherRepository` (which fetches multi-day forecasts). This port returns
  current conditions only.
- **Adapters:** Three `CurrentWeatherRepository` implementations:
  - `OpenMeteoCurrentWeatherAdapter`
  - `OpenWeatherMapAdapter`
  - `WeatherApiAdapter`
- **DI:** Inversify `@multiInject(CURRENT_WEATHER_REPOSITORY)` in the snapshot
  service to fan out to all sources.
- **Client polling:** `setInterval` in a React client component (no server-side
  cron or background job needed).
- **Session persistence:** Active session ID stored in `localStorage`; on mount,
  the page checks for an existing active session and resumes it.
- **API route:** `POST /api/backoffice/sessions` (start),
  `PATCH /api/backoffice/sessions/[id]` (end),
  `POST /api/backoffice/sessions/[id]/snapshots` (record snapshot).

---

## 10. Risks & Open Questions

| Risk / Question                                       | Mitigation / Answer                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| OpenWeatherMap / WeatherAPI free tier call limits     | Polling every 15 min ≈ 96 calls/day — well within free tier limits for both APIs |
| User forgets to end the session (leaves browser open) | 30-min notifications serve as reminders; session recovery is non-destructive     |
| Weather source API keys in environment variables      | Store in `.env.local`; document required vars in README                          |
| Data quality if user records times imprecisely        | Acceptable for MVP; approximate data is better than no data                      |

---

## 11. Timeline & Milestones

| Milestone                   | Target Date | Notes                                     |
| --------------------------- | ----------- | ----------------------------------------- |
| Design mockups approved     |             | Prerequisite for front-end implementation |
| MVP implementation complete |             |                                           |
| First 10 sessions recorded  |             | Smoke-test data quality                   |
| 50 sessions collected       |             | Dataset sufficient for initial analysis   |

---

## 12. References

- `product/user-stories.md` — stories 46–52
- `product/lean-canvas.md`
- `.ai/templates/ADR.md`
- `.ai/templates/implementation-plan.md`
- Open-Meteo current weather docs: https://open-meteo.com/en/docs
