@drying-session
Feature: Drying Session Management
  As a user
  I want to start drying sessions for clothing categories
  So I can track which items are currently drying

  Scenario: Create sessions for selected categories
    Given I have no active drying sessions
    When I request to start sessions for categories "LIGHT, MEDIUM"
    Then I should get status code 201
    And I should receive 2 created sessions
    And I should receive 0 conflicting categories

  Scenario: Reject empty category list
    Given I have no active drying sessions
    When I request to start sessions for categories ""
    Then I should get status code 400
    And the response should contain an error message

  Scenario: Reject unrecognized category
    Given I have no active drying sessions
    When I request to start sessions for categories "LIGHT, INVALID_CATEGORY"
    Then I should get status code 400
    And the response should contain an error message

  Scenario: Return 409 when all categories conflict
    Given I have active drying sessions for "LIGHT, MEDIUM" started 2 minutes ago
    When I request to start sessions for categories "LIGHT, MEDIUM"
    Then I should get status code 409
    And I should receive 0 created sessions
    And I should receive 2 conflicting categories

  Scenario: Allow same category if last session ended 6+ minutes ago
    Given I have active drying sessions for "LIGHT" started 6 minutes ago
    When I request to start sessions for categories "LIGHT"
    Then I should get status code 201
    And I should receive 1 created session
    And I should receive 0 conflicting categories

  Scenario: Allow different category despite another being recent
    Given I have active drying sessions for "LIGHT" started 2 minutes ago
    When I request to start sessions for categories "MEDIUM"
    Then I should get status code 201
    And I should receive 1 created session
    And I should receive 0 conflicting categories

  Scenario: Return 206 when some categories conflict
    Given I have active drying sessions for "LIGHT" started 2 minutes ago
    When I request to start sessions for categories "LIGHT, MEDIUM"
    Then I should get status code 206
    And I should receive 1 created session
    And I should receive 1 conflicting category
