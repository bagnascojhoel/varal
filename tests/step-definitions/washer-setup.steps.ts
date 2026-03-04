import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import { Cep } from '../../src/core/domain/cep';
import { WasherSetupCommand } from '../../src/core/domain/washer-setup-command';
import type { TestWorld } from '../support/world';

Given(
  'CEP {string} resolves to city {string} in state {string}',
  function (this: TestWorld, _cep: string, city: string, state: string) {
    this.viacepMocker.mockCep(city, state);
  },
);

Given(
  'the Nominatim search returns coordinates {float}, {float} for {string}',
  function (this: TestWorld, lat: number, lon: number, _query: string) {
    this.nominatimMocker.mockSearch(lat, lon);
  },
);

When(
  'I set up the washer with CEP {string}',
  async function (this: TestWorld, cep: string) {
    this.washer = await this.washerService.setup(
      WasherSetupCommand.ofCep(new Cep(cep)),
    );
  },
);

Then(
  'the washer city name should be {string}',
  function (this: TestWorld, cityName: string) {
    assert.strictEqual(this.washer!.locality.cityName, cityName);
  },
);

Then(
  'the washer timezone should be {string}',
  function (this: TestWorld, timezone: string) {
    assert.strictEqual(this.washer!.locality.timezone, timezone);
  },
);
