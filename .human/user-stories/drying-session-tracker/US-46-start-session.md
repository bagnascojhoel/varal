# US-46 — Start Drying Session

## Story

As a Laundry Expert, I want to start a drying session by selecting clothing
weight categories, So that I can track each type independently.

## Technical Description

The Laundry Expert selects one or more of the five clothing weight categories
(extra-light, light, medium, heavy, extra-heavy) and clicks "Start Session". The
back-end creates a `DryingSession` record in SQLite (via Prisma) with
`startedAt = now()` and `status = ACTIVE`, along with a `SessionCategory` record
for each selected category. The session ID is returned to the client and stored
in localStorage. The UI transitions to the active session view with per-category
elapsed timers running.

---

## Tasks

### Front-End

Render the category selection checklist with the five weight categories.
Validate that at least one category is selected before enabling the "Start
Session" CTA. On a successful back-end response, store the session ID in
localStorage and transition to the active session view.

### Back-End

Implement `POST /api/backoffice/sessions` to create a `DryingSession` record
with `status = ACTIVE` and `startedAt = now()`, plus one `SessionCategory`
record per selected category. Return the session ID in the response.

#### Test Scenarios

**Scenario 1: Valid request creates an active session** Given a request
containing one or more valid clothing weight categories When
`POST /api/backoffice/sessions` is called Then a `DryingSession` record is
created with `status = ACTIVE` and `startedAt` set to the current timestamp, and
a `SessionCategory` record is created for each selected category

**Scenario 2: Empty category list is rejected** Given a request with an empty or
missing category list When the endpoint is called Then a validation error is
returned and no session record is created

**Scenario 3: Unrecognised category value is rejected** Given a request
containing a category value outside the five supported weight categories When
the endpoint is called Then a validation error is returned identifying the
unknown value

**Scenario 4: Starting a session while one is already active returns a
conflict** Given the database already contains a `DryingSession` with
`status = ACTIVE` When `POST /api/backoffice/sessions` is called Then a conflict
error is returned and no new session is created
