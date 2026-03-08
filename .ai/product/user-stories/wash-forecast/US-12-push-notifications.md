# US-12 — Push Notification on Good Laundry Days

## Story

As a Washer, I want to receive a push notification on good laundry days, So that
I don't miss the opportunity.

## Technical Description

Requires a Service Worker and the browser Push API for subscription management
on the front-end. The back-end must evaluate the day's forecast at a scheduled
time (e.g. 7 am local time) and send a push notification when the recommendation
is positive. This requires a new back-end scheduled trigger or cron-like
mechanism — a new infrastructure concern not currently present in Varal.
Notification content must reflect the recommendation quality in friendly
language (e.g. "Today is a great day to wash your sheets!"). Notification
permission must be requested at a contextually appropriate moment, not on first
load.

> ⚠️ **Open question**: What is the back-end scheduling mechanism? Options
> include a Vercel cron job, a third-party push service, or a server-side event.
> This must be decided before implementation begins.

---

## Tasks

### Back-End

Implement a scheduled job that evaluates each subscribed Washer's forecast at a
defined time, and dispatches a push notification only when the recommendation is
positive.

#### Test Scenarios

**Scenario 1: Positive recommendation triggers a notification dispatch** Given a
subscribed Washer has a positive recommendation for today When the scheduled job
runs Then a push notification is dispatched to that Washer's subscription
endpoint

**Scenario 2: Negative recommendation produces no dispatch** Given a subscribed
Washer has a negative recommendation for today When the scheduled job runs Then
no notification is dispatched for that Washer

**Scenario 3: Unsubscribed Washer is skipped** Given a Washer has not completed
the push notification subscription flow When the scheduled job runs Then no
notification is attempted for that Washer

**Scenario 4: Failed dispatch is handled without stopping other notifications**
Given one Washer's push subscription endpoint returns an error When the
scheduled job dispatches notifications Then the error is recorded and processing
continues for all other subscribed Washers
