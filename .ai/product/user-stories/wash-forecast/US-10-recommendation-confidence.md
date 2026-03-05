# US-10 — Recommendation Confidence

## Story

As a Washer,
I want to see how confident the recommendation is,
So that I can decide whether to take the risk on borderline days.

## Technical Description

Introduces a `confidence` attribute to the recommendation output in `core/domain/`. Confidence is
derived from how far the day's weather values are from each classification threshold — conditions well
above or below thresholds yield high confidence; values close to any threshold yield low confidence.
The domain (`wash-decision.ts`) must compute and expose this value. The UI presents it in simple,
user-friendly language (e.g. "Confident ✓", "Borderline ⚠", "Uncertain ?") without exposing the
underlying numeric score.

---

## Tasks

### Back-End
Extend the classification output in `core/domain/` with a `confidence` level (`high` / `borderline` /
`uncertain`) computed from the margin between each weather variable and its threshold. Include this
attribute in the `DayForecast` response.

#### Test Scenarios

**Scenario 1: Values well within thresholds yield high confidence**
Given all weather variables are far from their classification thresholds in the favourable direction
When the confidence is computed
Then the result is "high"

**Scenario 2: Values near a threshold yield borderline confidence**
Given at least one weather variable is close to its classification threshold
When the confidence is computed
Then the result is "borderline"

**Scenario 3: High forecast variance yields uncertain confidence**
Given the hourly data shows large variance across the day making classification unstable
When the confidence is computed
Then the result is "uncertain"

**Scenario 4: Confidence is independent of the recommendation outcome**
Given a clearly negative day (high rain probability, well above threshold)
When the confidence is computed
Then the result is "high", reflecting certainty in the negative recommendation
