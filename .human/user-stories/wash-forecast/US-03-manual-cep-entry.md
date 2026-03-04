# US-03 — Manual CEP Entry

## Story

As a Washer,
I want to enter my location manually using a CEP (postal code),
So that I can get a recommendation when GPS is unavailable or inaccurate.

## Technical Description

`ViacepClientService` resolves a Brazilian CEP to geographic coordinates via the ViaCEP API. The
`LocationPicker` component exposes a manual input field for CEP entry. This story validates the complete
CEP → coordinates → recommendation flow, including input format validation and graceful error handling
for invalid, unknown, or service-unavailable scenarios. No new ports or infrastructure adapters are
required.

---

## Tasks

### Back-End
Ensure `ViacepClientService` correctly resolves valid CEPs to coordinates and returns structured errors
for invalid, unknown, or unreachable cases, so the front-end can surface the appropriate message.

#### Test Scenarios

**Scenario 1: Valid CEP resolves to coordinates**
Given a correctly formatted CEP that exists in the ViaCEP database
When the CEP lookup runs
Then geographic coordinates for that location are returned

**Scenario 2: Non-existent CEP returns a not-found error**
Given a correctly formatted CEP that does not exist in the ViaCEP database
When the CEP lookup runs
Then a not-found error is returned without crashing the service

**Scenario 3: Malformed CEP is rejected before the API call**
Given a CEP that does not follow the 8-digit Brazilian format
When the input is validated
Then a validation error is returned and no external API call is made

**Scenario 4: ViaCEP service unavailable returns a service error**
Given the ViaCEP API is unreachable or returns an error response
When the CEP lookup runs
Then a service-unavailable error is returned so the front-end can suggest a fallback
