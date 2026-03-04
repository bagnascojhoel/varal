Feature: Washer Setup

  Scenario: Setup by GPS coordinates
    Given the locality service returns "Florianópolis" with timezone "America/Sao_Paulo" for coordinates -27.5954, -48.5480
    When I set up the washer with coordinates -27.5954, -48.5480
    Then the washer city name should be "Florianópolis"
    And the washer timezone should be "America/Sao_Paulo"

  Scenario: Setup by CEP
    Given CEP "88010000" resolves to city "Florianópolis" in state "SC"
    And the Nominatim search returns coordinates -27.5954, -48.5480 for "Florianópolis,SC,Brazil"
    And the locality service returns "Florianópolis" with timezone "America/Sao_Paulo" for coordinates -27.5954, -48.5480
    When I set up the washer with CEP "88010000"
    Then the washer city name should be "Florianópolis"
    And the washer timezone should be "America/Sao_Paulo"
