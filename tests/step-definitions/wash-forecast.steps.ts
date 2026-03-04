import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import { Coordinates } from '../../src/core/domain/coordinates';
import { WasherSetupCommand } from '../../src/core/domain/washer-setup-command';
import { WindowState } from '../../src/core/domain/window-state';
import type { TestWorld } from '../support/world';

const windowStateMap: Record<string, WindowState> = {
  Clear: WindowState.Clear,
  Unsure: WindowState.Unsure,
  Rain: WindowState.Rain,
};

Given(
  'the locality service returns {string} with timezone {string} for coordinates {float}, {float}',
  function (
    this: TestWorld,
    cityName: string,
    timezone: string,
    _lat: number,
    _lon: number,
  ) {
    this.bigDataCloudMocker.mockLocalityInfo(cityName, timezone);
  },
);

Given(
  'I set up the washer with coordinates {float}, {float}',
  async function (this: TestWorld, lat: number, lon: number) {
    this.washer = await this.washerService.setup(
      WasherSetupCommand.ofCoordinates(new Coordinates(lat, lon)),
    );
  },
);

Given(
  'the weather forecast has precipitation probability {int}% and precipitation sum {float}mm',
  function (this: TestWorld, precipProb: number, precipSum: number) {
    this.openMeteoMocker.mockForecast(precipProb, precipSum, 5);
  },
);

When('I request the wash forecast', async function (this: TestWorld) {
  this.forecast = await this.forecastService.getForecast(this.washer!);
});

Then(
  'the city name should be {string}',
  function (this: TestWorld, cityName: string) {
    assert.strictEqual(this.forecast!.cityName, cityName);
  },
);

Then(
  'the first forecast day morning window should be {string}',
  function (this: TestWorld, state: string) {
    assert.strictEqual(
      this.forecast!.forecasts[0].morningWindow,
      windowStateMap[state],
    );
  },
);

Then(
  'the first forecast day afternoon window should be {string}',
  function (this: TestWorld, state: string) {
    assert.strictEqual(
      this.forecast!.forecasts[0].afternoonWindow,
      windowStateMap[state],
    );
  },
);
