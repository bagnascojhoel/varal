# US-04 — Drying Setup Selection

## Story

As a Washer,
I want to describe my drying setup (open yard, south-facing balcony, covered balcony, indoor with window,
no outdoor space),
So that the recommendation accounts for how much sun, wind, and airflow I actually have access to.

## Technical Description

Introduces a new user preference: drying environment type. The preference is persisted in localStorage
so the Washer is not prompted again on repeat visits. The selected setup modifies how weather conditions
are scored in `core/domain/` — for example, a covered balcony reduces rain risk but also reduces UV and
airflow; indoor drying is unaffected by rain but highly sensitive to humidity. A new domain type (e.g.
`DryingEnvironment` enum) should be introduced, and the classification logic must accept it as an input
parameter alongside the weather forecast.

---

## Tasks

### Back-End
Introduce a `DryingEnvironment` enum in `core/domain/` and extend the classification logic to accept it
as an input. Each environment type must apply the appropriate modifiers to the weather variable scores
before the recommendation is produced.

#### Test Scenarios

**Scenario 1: Open yard — full weather conditions apply**
Given the drying environment is set to "open yard"
When the classification runs with a given forecast
Then all weather variables (rain, UV, wind, humidity) are used at their unmodified values

**Scenario 2: Covered balcony — rain impact is reduced**
Given the drying environment is set to "covered balcony"
And the forecast shows light rain
When the classification runs
Then the rain penalty is reduced and the recommendation is not negative on rain alone

**Scenario 3: Indoor with window — only humidity and temperature are scored**
Given the drying environment is set to "indoor with window"
When the classification runs
Then outdoor variables (UV, wind, rain) are excluded and only humidity and temperature influence the result

**Scenario 4: No outdoor space — recommendation reflects indoor-only conditions**
Given the drying environment is set to "no outdoor space"
When the classification runs on a sunny, windy day
Then the recommendation is not boosted by the outdoor conditions the Washer cannot access
