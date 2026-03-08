@drying-session
Feature: Drying Session Management
  As a user
  I want to start drying sessions for clothing categories
  So I can track which items are currently drying

  Scenario: Create sessions for selected categories
    Given I have no active drying sessions
    When I start sessions for categories "LIGHT, MEDIUM"
    Then I should have 2 created sessions
    And I should have 0 conflicting categories

  Scenario: Return conflict when all categories have recent sessions
    Given I have active drying sessions for "LIGHT, MEDIUM" started 2 minutes ago
    When I start sessions for categories "LIGHT, MEDIUM"
    Then I should have 0 created sessions
    And I should have 2 conflicting categories

  Scenario: Allow same category if last session ended 6+ minutes ago
    Given I have active drying sessions for "LIGHT" started 6 minutes ago
    When I start sessions for categories "LIGHT"
    Then I should have 1 created session
    And I should have 0 conflicting categories

  Scenario: Allow different category despite another being recent
    Given I have active drying sessions for "LIGHT" started 2 minutes ago
    When I start sessions for categories "MEDIUM"
    Then I should have 1 created session
    And I should have 0 conflicting categories

  Scenario: Partially create sessions when some categories conflict
    Given I have active drying sessions for "LIGHT" started 2 minutes ago
    When I start sessions for categories "LIGHT, MEDIUM"
    Then I should have 1 created session
    And I should have 1 conflicting category
