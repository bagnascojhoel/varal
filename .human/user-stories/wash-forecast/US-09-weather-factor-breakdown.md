# US-09 — Weather Factor Breakdown

## Story

As a Washer,
I want to see which weather factors influenced the recommendation (rain probability, wind speed, wind
direction, temperature, humidity, UV index),
So that I understand why conditions are or aren't suitable.

## Technical Description

The classification logic in `core/domain/` already uses weather variables internally. This story surfaces
them to the Washer in laundry-relevant language rather than raw meteorological values — for example,
"High humidity will slow drying time" rather than "Humidity: 82%". A companion value object (e.g.
`RecommendationExplanation`) carrying a list of contributing factors with human-readable impact labels
should be introduced in `core/domain/`. The UI must render this as a secondary, collapsible section to
keep the primary recommendation uncluttered for Washers who only want the bottom line.

---

## Tasks

### Back-End
Introduce a `RecommendationExplanation` value object in `core/domain/` that lists the contributing
weather factors, their impact direction (positive / negative), and a short human-readable label. Include
this alongside the classification result in `DayForecast`.

#### Test Scenarios

**Scenario 1: Primary negative factor is identified and labelled**
Given rain probability is above the negative threshold
When the explanation is computed
Then rain probability is included in the factor list with a negative impact label

**Scenario 2: Multiple factors are present and ordered by impact**
Given both high humidity and rain contribute negatively
When the explanation is computed
Then both factors appear in the list, ordered from most to least impactful

**Scenario 3: Positive factors are included on a good day**
Given the day has low humidity, good wind, and no rain
When the explanation is computed
Then the factor list contains positive-impact entries for the favourable variables

**Scenario 4: Neutral or irrelevant factors are excluded**
Given a variable has no meaningful impact on the classification outcome
When the explanation is computed
Then that variable does not appear in the factor list
