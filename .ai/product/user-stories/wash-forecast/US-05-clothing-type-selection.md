# US-05 — Clothing Type Selection

## Story

As a Washer,
I want to select the types of clothes I'm planning to wash (e.g. bed sheets, heavy knitwear, light
cotton, delicates),
So that the recommendation tells me whether those specific items will dry before conditions change.

## Technical Description

Extends the recommendation input model to include a list of selected clothing types. The classification
logic (`core/domain/wash-decision.ts`) must evaluate only the selected types, surfacing results
exclusively for what the Washer is actually planning to wash. The selection must be persisted in
localStorage as a default and be editable before each session. This story depends on the per-category
classification model introduced in US-01.

---

## Tasks

### Back-End
Extend the `ForecastService` (or its domain layer) to accept a list of selected clothing types as input
and return classification results only for those types, ignoring unselected categories.

#### Test Scenarios

**Scenario 1: Only selected categories are classified**
Given the Washer has selected light cotton only
When the classification runs
Then the result contains an outcome for light cotton and no other categories

**Scenario 2: Multiple selected categories are all evaluated**
Given the Washer has selected bed sheets and delicates
When the classification runs
Then the result contains independent outcomes for both bed sheets and delicates

**Scenario 3: Empty selection is rejected**
Given no clothing types are selected
When the classification is requested
Then a validation error is returned indicating at least one category is required

**Scenario 4: Unrecognised category in the selection is rejected**
Given the input contains a clothing type that is not part of the domain's supported set
When the classification is requested
Then a validation error is returned identifying the unknown category
