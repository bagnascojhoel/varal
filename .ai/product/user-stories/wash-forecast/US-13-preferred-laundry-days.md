# US-13 — Preferred Laundry Days

## Story

As a Washer,
I want to set my preferred laundry days,
So that notifications are only sent on days I actually plan to wash.

## Technical Description

Introduces a user preference for the weekdays on which the Washer does laundry (e.g. Saturday, Sunday).
The preference is stored in localStorage and must also be persisted server-side for the notification
service (US-12) to filter dispatch by day. The notification scheduled job must check this preference
before sending. A simple day-picker UI (checkboxes for each weekday) must be accessible from app
settings. This story depends on US-12.

---

## Tasks

### Back-End
Extend the notification scheduled job (US-12) to check each subscribed Washer's preferred laundry days
before dispatching. Provide an endpoint to store and retrieve the preferred days preference.

#### Test Scenarios

**Scenario 1: Good laundry day on a non-preferred weekday produces no notification**
Given the Washer has set Saturday as their only preferred day
And today is Wednesday with a positive recommendation
When the scheduled job runs
Then no notification is dispatched for that Washer

**Scenario 2: Good laundry day on a preferred weekday triggers a notification**
Given the Washer has set Saturday as preferred
And today is Saturday with a positive recommendation
When the scheduled job runs
Then a notification is dispatched for that Washer

**Scenario 3: No preferred days set — all days treated as preferred**
Given the Washer has not configured any preferred days
And today has a positive recommendation
When the scheduled job runs
Then a notification is dispatched regardless of the current weekday

**Scenario 4: All preferred days removed — notifications are paused**
Given the Washer removes all preferred days from their settings
When any day with a positive recommendation occurs
Then no notification is dispatched until at least one preferred day is restored
