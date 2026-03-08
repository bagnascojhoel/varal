# US-06 — Drying Time Window

## Story

As a Washer, I want to set the time window during which my clothes can hang
(e.g. 9 am–7 pm), So that the app only recommends washing if the clothes will be
dry before I need to bring them in.

## Technical Description

Introduces a user-configurable drying window (start time, end time) stored in
localStorage. The domain must use the window to constrain the recommendation:
conditions are only evaluated within the specified hours, and drying time
estimates (US-11) must fit within that window. The domain logic must compute the
effective drying duration (window length minus any adverse-condition hours
within it). When no window is set, a sensible default applies (e.g. sunrise to
sunset for the location's latitude).

---

## Tasks

### Back-End

Extend the classification input model to accept an optional drying window (start
time, end time). The domain must filter hourly forecast data to the specified
window before scoring, and compute the effective drying hours available within
it.

#### Test Scenarios

**Scenario 1: Window constrains which hours are evaluated** Given a drying
window of 8 am–6 pm And the forecast has adverse conditions from 5 pm onwards
When the classification runs Then only the 8 am–5 pm hours are scored and the
afternoon deterioration does not affect the result

**Scenario 2: Window too short for a clothing category — negative result for
that category** Given a drying window of 3 hours And a clothing category that
requires 5 hours in today's conditions When the classification runs Then that
category is classified as not recommended due to insufficient window time

**Scenario 3: No window provided — sunrise-to-sunset default is used** Given no
drying window is included in the request When the classification runs Then the
domain applies the sunrise-to-sunset window computed from the location's
coordinates

**Scenario 4: Window with zero effective hours returns a negative
recommendation** Given a drying window where adverse conditions fill the entire
period When the classification runs Then all categories are classified as not
recommended and effective hours are reported as zero
