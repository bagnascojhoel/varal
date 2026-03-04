Feature: Wash Forecast

  Background:
    Given the locality service returns "Florianópolis" with timezone "America/Sao_Paulo" for coordinates -27.5954, -48.5480
    And I set up the washer with coordinates -27.5954, -48.5480

  Scenario: Clear conditions show a clear window
    Given the weather forecast has precipitation probability 5% and precipitation sum 0.0mm
    When I request the wash forecast
    Then the city name should be "Florianópolis"
    And the first forecast day morning window should be "Clear"
    And the first forecast day afternoon window should be "Clear"

  Scenario: Heavy rain shows a rain window
    Given the weather forecast has precipitation probability 85% and precipitation sum 9.0mm
    When I request the wash forecast
    Then the first forecast day morning window should be "Rain"

  Scenario: Borderline conditions show an uncertain window
    Given the weather forecast has precipitation probability 30% and precipitation sum 0.5mm
    When I request the wash forecast
    Then the first forecast day morning window should be "Unsure"
