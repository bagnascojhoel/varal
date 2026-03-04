# US-50 — Mark Category as Dried

## Story

As a Laundry Expert,
I want to mark individual categories as dried at any point during the session,
So that I record the precise drying time for each weight class.

## Technical Description

Each active (not yet dried) category displays a "Secou!" button. When clicked, the client calls the
back-end to record `driedAt = now()` for that `SessionCategory`. The category transitions to a dried
state in the UI: the elapsed timer freezes and the "Secou!" button is no longer shown. There is no
undo in the MVP — the recorded time is final.

---

## Tasks

### Front-End
Render a "Secou!" button for each category that has not yet been marked as dried. On click, call the
back-end endpoint and, on success, update the category's UI state to dried with its elapsed time
frozen.

### Back-End
Implement `PATCH /api/backoffice/sessions/[id]/categories/[categoryId]` to set `driedAt = now()` on
the specified `SessionCategory`. Validate that the category belongs to the given session, that the
session is still active, and that the category has not already been marked as dried.

#### Test Scenarios

**Scenario 1: Valid mark request records driedAt**
Given an active session with a category that has no `driedAt` set
When `PATCH /api/backoffice/sessions/[id]/categories/[categoryId]` is called
Then `driedAt` is set to the current timestamp for that category

**Scenario 2: Already-dried category cannot be marked again**
Given a category that already has a `driedAt` value recorded
When the mark-as-dried endpoint is called for that category
Then a conflict error is returned and `driedAt` remains unchanged

**Scenario 3: Category belonging to a different session is rejected**
Given a `categoryId` that exists but belongs to a different session than the one in the URL
When the endpoint is called
Then a not-found error is returned and no record is modified

**Scenario 4: Marking a category on a completed session is rejected**
Given the session referenced by the URL has `status = COMPLETED`
When the mark-as-dried endpoint is called
Then an error is returned indicating the session is no longer active
