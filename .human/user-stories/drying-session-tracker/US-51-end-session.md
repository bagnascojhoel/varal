# US-51 — End Session

## Story

As a Laundry Expert,
I want to end a session and indicate whether I collected the clothes just now or earlier (with a
time picker),
So that the recorded drying duration is as accurate as possible.

## Technical Description

The Laundry Expert clicks "End Session". A modal appears with two inputs:

1. **Collection time**: "Just now" (defaults to current time) or "Earlier" (time picker, default:
   now minus 15 minutes).
2. **Outcome per undried category**: for each category without a `driedAt`, the Laundry Expert
   answers "Did this dry?" — "Yes" (records `driedAt = collectedAt`) or "Not dried" (records
   `driedAt = null`).

On confirmation, the client calls `PATCH /api/backoffice/sessions/[id]` with `endedAt = collectedAt`,
`status = COMPLETED`, and the resolved `driedAt` for each remaining category. The session ID is
cleared from localStorage and the UI returns to the start screen. Closing the modal without
confirming leaves the session active.

---

## Tasks

### Front-End
Render the "End Session" modal with the collection time picker (just now / earlier) and a per-undried-
category "Did this dry?" input. On confirmation, call the back-end endpoint; on success, clear
localStorage and return the UI to the start screen. Closing the modal without confirming must not
change session state.

### Back-End
Implement `PATCH /api/backoffice/sessions/[id]` (end-session variant) to set `status = COMPLETED`,
`endedAt = collectedAt`, and apply the provided `driedAt` resolution for each remaining undried
category. Validate that the session is currently active before applying any changes.

#### Test Scenarios

**Scenario 1: All categories already dried — session is completed cleanly**
Given all `SessionCategory` records for the session already have `driedAt` set
When `PATCH /api/backoffice/sessions/[id]` is called with a `collectedAt` timestamp
Then `status` is set to `COMPLETED` and `endedAt` is set to `collectedAt`

**Scenario 2: Undried categories answered "Yes" receive driedAt = collectedAt**
Given one or more categories have no `driedAt` recorded
And the request marks those categories as dried
When the endpoint is called
Then those categories receive `driedAt = collectedAt`

**Scenario 3: Undried categories answered "Not dried" receive driedAt = null**
Given one or more categories are indicated as "not dried" in the request
When the endpoint is called
Then those categories have `driedAt = null` in the final record

**Scenario 4: Ending an already-completed session is rejected**
Given the session referenced by the URL has `status = COMPLETED`
When the end-session endpoint is called
Then an error is returned and no changes are applied to the session
