# US-47 — Automatic Weather Snapshots

## Story

As a Laundry Expert, I want the app to automatically record weather conditions
every 15 minutes during a session from multiple sources, So that I have accurate
environmental data for each session.

## Technical Description

While a session is active, the client polls
`POST /api/backoffice/sessions/[id]/snapshots` every 15 minutes. The endpoint
fans out to all configured `CurrentWeatherRepository` implementations
(Open-Meteo current conditions, OpenWeatherMap, WeatherAPI.com) using Inversify
`@multiInject`. Each source response is persisted as a separate
`WeatherSnapshot` record linked to the session, tagged with the source name and
`recordedAt = now()`. If a source fails, its snapshot is skipped and the error
is logged — polling continues uninterrupted. Missed snapshots due to device
going offline are not backfilled.

Note: `CurrentWeatherRepository` is a new port, distinct from the existing
`WeatherRepository` which fetches multi-day forecasts.

---

## Tasks

### Weather Research

Identify which current-condition variables to capture from each source (e.g.
temperature, relative humidity, wind speed, precipitation, UV index, cloud
cover). Document the canonical snapshot schema and the mapping from each
source's specific field names to that schema.

### Back-End

Introduce a `CurrentWeatherRepository` port and three adapter implementations:
`OpenMeteoCurrentWeather Adapter`, `OpenWeatherMapAdapter`, and
`WeatherApiAdapter`. Implement `POST /api/backoffice/sessions/ [id]/snapshots`
to fan out to all adapters in parallel via `@multiInject` and persist each
successful result as a `WeatherSnapshot` record.

#### Test Scenarios

**Scenario 1: All sources respond — one snapshot per source is stored** Given
all three weather sources return valid current-condition data When
`POST /api/backoffice/sessions/[id]/snapshots` is called Then three
`WeatherSnapshot` records are created, each tagged with its source name and
`recordedAt` set to the current timestamp

**Scenario 2: One source fails — other snapshots are still stored** Given one
weather source returns an error and the other two succeed When the snapshot
endpoint is called Then two `WeatherSnapshot` records are stored, the failing
source's error is logged, and the response does not propagate the error to the
client

**Scenario 3: All sources fail — no snapshots stored, no error propagated**
Given all three weather sources are unavailable When the snapshot endpoint is
called Then no `WeatherSnapshot` records are created, all errors are logged, and
the endpoint returns a success response so the client-side polling is not
interrupted

**Scenario 4: Snapshot for a non-existent session is rejected** Given the
session ID in the URL does not match any record in the database When the
snapshot endpoint is called Then a not-found error is returned and no snapshot
is stored
