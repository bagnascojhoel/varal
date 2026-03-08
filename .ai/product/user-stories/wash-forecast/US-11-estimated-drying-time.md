# US-11 — Estimated Drying Time Per Item

## Story

As a Washer, I want to know the estimated drying time per item type in today's
conditions, So that I know whether my specific load will be ready in time.

## Technical Description

Requires a domain model for baseline drying duration per clothing category under
ideal conditions, adjusted by current weather variables (humidity, temperature,
wind speed, UV index) and the Washer's drying setup (US-04). The result is an
estimated duration in hours per clothing type. This builds on the per-category
classification introduced in US-01 and the drying environment model from US-04.
All computation lives in `core/domain/`; no new external API calls are required.
Estimated times must be compared against the Washer's drying window (US-06) to
flag conflicts.

---

## Tasks

### Back-End

Introduce a drying-time estimator in `core/domain/` that computes an estimated
duration (in hours) per clothing category, starting from a defined baseline and
adjusting for weather variables and `DryingEnvironment`. Include the estimate
and any window conflict flag in the `DayForecast` response.

#### Test Scenarios

**Scenario 1: Ideal conditions produce the baseline drying time** Given all
weather variables are at their ideal values And the drying environment is "open
yard" When the drying time is estimated for light cotton Then the result equals
the domain-defined baseline for light cotton under ideal conditions

**Scenario 2: Adverse conditions extend the estimate beyond baseline** Given
humidity is high and wind is low When the drying time is estimated for heavy
knitwear Then the result is longer than the baseline for heavy knitwear under
ideal conditions

**Scenario 3: Indoor environment increases estimated time** Given the drying
environment is "indoor with window" When the drying time is estimated for any
clothing category Then the result is longer than the equivalent outdoor estimate
for the same weather conditions

**Scenario 4: Estimate exceeding the drying window is flagged** Given the drying
window is 4 hours And the estimated drying time for heavy knitwear is 6 hours
When the result is produced Then a conflict flag is set for heavy knitwear
indicating the window is insufficient
