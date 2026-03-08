# US-49 — 30-Minute Reminder Notification

## Story

As a Laundry Expert, I want to receive a browser notification every 30 minutes
asking whether clothes have dried, So that I don't forget to end the session.

## Technical Description

On session start, the app requests Notification API permission if not already
granted. While the session is active, a client-side interval fires every 30
minutes and sends a browser notification: _"Suas roupas já secaram? Verifique e
marque no Varal."_ Notifications fire even if the tab is in the background. If
permission is denied or the API is unavailable, the feature degrades silently —
no error is shown and session tracking continues normally.

---

## Tasks

### Front-End

Request browser notification permission on session start (if not already
granted). Implement a 30-minute client-side interval that dispatches a browser
notification while the session is active. Clear the interval when the session
ends. Handle permission denial silently without surfacing an error to the
Laundry Expert.
