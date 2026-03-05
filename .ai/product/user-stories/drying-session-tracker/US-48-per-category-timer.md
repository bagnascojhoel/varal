# US-48 — Per-Category Elapsed Timer

## Story

As a Laundry Expert,
I want to see a per-category elapsed timer,
So that I know how long each type of clothes has been drying.

## Technical Description

Each active (not yet dried) clothing category in the session view displays an elapsed timer counting
up from `session.startedAt`. The timer is driven by a client-side interval — no server calls are
needed to keep it ticking. When a category is marked as dried (US-50), its timer freezes and displays
the total elapsed time at the moment `driedAt` was recorded (`driedAt - startedAt`). Already-dried
categories show their frozen duration for reference.

---

## Tasks

### Front-End
Implement a per-category elapsed timer component that counts up from `session.startedAt` using a
client-side interval. For categories that have been marked as dried, compute and display the frozen
duration (`driedAt - startedAt`) without running an interval.
