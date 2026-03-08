# US-02 — Automatic Location Detection

## Story

As a Washer, I want the app to detect my location automatically, So that I get a
recommendation without typing anything.

## Technical Description

The `LocationPicker` client component uses the browser Geolocation API to
request the device's coordinates. When granted, coordinates are pushed as
`?lat=X&lon=Y` query params and `page.tsx` passes them to `ForecastService`.
This story validates that the full GPS → recommendation flow works correctly
end-to-end, including graceful handling of permission denial and geolocation
errors. No new ports or infrastructure adapters are required.

---

## Tasks

### Back-End

Validate that the `ForecastService` correctly handles coordinates received from
the GPS flow, including error responses when coordinates are missing or
malformed.

#### Test Scenarios

**Scenario 1: Valid coordinates produce a recommendation** Given the request
arrives with valid latitude and longitude from the GPS flow When
`ForecastService` processes the coordinates Then a forecast recommendation is
returned for that location

**Scenario 2: Missing coordinates return a meaningful error** Given the request
arrives without coordinates (permission denied or timeout on the client) When
`ForecastService` receives the request Then it returns a response that allows
the front-end to prompt manual location entry

**Scenario 3: Out-of-range coordinates are rejected** Given the request arrives
with coordinates outside valid geographic bounds When `ForecastService`
processes the input Then it returns a validation error without calling the
weather repository
