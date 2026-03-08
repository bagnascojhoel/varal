# US-08 — Hourly Drying Timeline

## Story

As a Washer, I want to see an hourly drying timeline that reflects my setup and
what I'm washing, So that I know the best window to hang each type of item.

## Technical Description

Requires Open-Meteo hourly forecast variables (precipitation, relative humidity,
temperature, wind speed, UV index) for the selected day. New domain logic must
aggregate these into a per-hour drying-quality score, adjusted by the Washer's
drying setup (US-04) and selected clothing types (US-05). The result is a
timeline showing "good", "risky", and "bad" hours for each item type. A new UI
component is required to render this timeline within or below the day card. This
story depends on US-04 and US-05.

---

## Tasks

### Back-End

Introduce domain logic that processes hourly forecast data into a per-hour
drying quality rating (`good` / `risky` / `bad`), adjusted by
`DryingEnvironment` and filtered to the selected clothing categories. This
output must be included in the `DayForecast` response.

#### Test Scenarios

**Scenario 1: Mixed-condition day produces a segmented timeline** Given hourly
data shows good conditions in the morning and rain in the afternoon When the
timeline is computed Then morning hours are rated "good" and afternoon hours are
rated "bad"

**Scenario 2: Covered balcony changes rain hours to "risky" instead of "bad"**
Given the drying environment is "covered balcony" And some hours have light rain
When the timeline is computed Then those hours are rated "risky", not "bad"

**Scenario 3: Consistently good day produces all "good" hours** Given all hourly
data is within the acceptable thresholds When the timeline is computed Then
every hour within the drying window is rated "good"

**Scenario 4: Timeline is scoped to selected clothing types** Given light cotton
and heavy knitwear are selected And heavy knitwear requires stricter conditions
When the timeline is computed Then some hours may be "good" for light cotton but
"risky" for heavy knitwear in the same period
