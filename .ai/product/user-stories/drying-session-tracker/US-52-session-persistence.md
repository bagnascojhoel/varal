# US-52 — Session Persistence After Page Refresh

## Story

As a Laundry Expert, I want sessions to survive a page refresh, So that an
accidental reload doesn't lose tracking state.

## Technical Description

On session start (US-46), the session ID is stored in localStorage. On every
page load, if a session ID is found in localStorage, the client calls
`GET /api/backoffice/sessions/[id]` to retrieve the full session state. If
`status = ACTIVE`, the UI resumes the active session view with all category
states (dried / not dried, `driedAt` timestamps) restored. If the session is
`COMPLETED` or the ID is not found, localStorage is cleared and the start screen
is shown.

---

## Tasks

### Front-End

On page mount, check localStorage for a stored session ID. If present, call the
session retrieval endpoint and resume the active session view when
`status = ACTIVE`. If the response indicates the session is completed or not
found, clear localStorage and display the start screen.

### Back-End

Implement `GET /api/backoffice/sessions/[id]` to return the full session record
including `status`, `startedAt`, `endedAt`, and all `SessionCategory` entries
with their `driedAt` timestamps.

#### Test Scenarios

**Scenario 1: Active session is returned with full category state** Given an
active session with multiple categories, some marked as dried and some not When
`GET /api/backoffice/sessions/[id]` is called Then the response includes
`status = ACTIVE`, `startedAt`, and each category with its current `driedAt`
value (set or null)

**Scenario 2: Non-existent session ID returns not-found** Given a session ID
that does not exist in the database When `GET /api/backoffice/sessions/[id]` is
called Then a not-found error is returned so the client knows to clear
localStorage

**Scenario 3: Completed session returns its final state** Given a session with
`status = COMPLETED` When `GET /api/backoffice/sessions/[id]` is called Then the
response includes `status = COMPLETED` so the client knows to clear localStorage
and show the start screen
