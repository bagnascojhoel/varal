# US-07 — Multi-Day Forecast View

## Story

As a Washer, I want to see the recommendation for the next few days, So that I
can plan when to do laundry this week.

## Technical Description

Open-Meteo already returns a multi-day forecast. `DayForecast.build()` and the
existing `CarouselTrack`/`DayCard` components already support rendering multiple
days. This story validates that the multi-day experience is clearly presented —
today's recommendation is prominent, and upcoming days are accessible via the
carousel without requiring extra effort. The maximum number of displayed days
must be defined.

> ⚠️ **Open question**: How many days ahead should be shown? The current
> implementation exposes 7 days of data from Open-Meteo. A product decision on
> the display cap (e.g. 3, 5, or 7 days) is needed, especially if future stories
> differentiate free vs. premium access.

---

## Tasks

### Back-End

Ensure `ForecastService` returns a correctly ordered and bounded list of
`DayForecast` results, with today first, up to the agreed maximum number of
days.

#### Test Scenarios

**Scenario 1: Results are ordered with today first** Given the Open-Meteo API
returns data for multiple days When `ForecastService` processes the response
Then the returned list starts with today's forecast and subsequent days follow
in chronological order

**Scenario 2: Result list is capped at the agreed maximum** Given the API
returns more days than the configured display maximum When `ForecastService`
processes the response Then the returned list contains at most the configured
number of days

**Scenario 3: Partial API response is handled gracefully** Given the API returns
fewer days than the configured maximum When `ForecastService` processes the
response Then only the available days are returned, with no placeholder or empty
entries

**Scenario 4: API response with no future days returns only today** Given the
API returns data only for the current day When `ForecastService` processes the
response Then a list with a single entry for today is returned without errors
