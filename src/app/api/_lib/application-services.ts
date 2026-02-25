import { container } from '@/core/ContainerConfig';
import {
  ForecastApplicationService,
  FORECAST_SERVICE,
} from '@/core/application-services/forecast-application-service';
import {
  WasherApplicationService,
  WASHER_APPLICATION_SERVICE,
} from '@/core/application-services/washer-application-service';
import { Cep } from '@/core/domain/cep';
import { Coordinates } from '@/core/domain/coordinates';
import { WasherSetupCommand } from '@/core/domain/washer-setup-command';
import type { ForecastResponse } from './types/forecast';
import type { WasherRequest, WasherResponse } from './types/washers';

export interface WashRecommendation {
  canWash: boolean;
  reason: string;
}

export const ApplicationServices = {
  async setupWasher(input: WasherRequest, acceptLocale?: string): Promise<WasherResponse> {
    const command =
      'cep' in input
        ? WasherSetupCommand.ofCep(new Cep(input.cep), acceptLocale)
        : WasherSetupCommand.ofCoordinates(new Coordinates(input.lat, input.lon), acceptLocale);
    const washer = await container
      .get<WasherApplicationService>(WASHER_APPLICATION_SERVICE)
      .setup(command);
    const { locality } = washer;
    return {
      lat: locality.coordinates.lat,
      lon: locality.coordinates.lon,
      cityName: locality.cityName,
      timezone: locality.timezone,
      countryCode: locality.countryCode,
    };
  },

  async getForecast(lat: number, lon: number, acceptLocale?: string): Promise<ForecastResponse> {
    const command = WasherSetupCommand.ofCoordinates(new Coordinates(lat, lon), acceptLocale);
    const washerService = container.get<WasherApplicationService>(WASHER_APPLICATION_SERVICE);
    const washer = await washerService.setup(command);
    return container.get<ForecastApplicationService>(FORECAST_SERVICE).getForecast(washer);
  },

  async getWashRecommendation(
    lat: number,
    lon: number,
    acceptLocale?: string,
  ): Promise<WashRecommendation[]> {
    const command = WasherSetupCommand.ofCoordinates(new Coordinates(lat, lon), acceptLocale);
    const washerService = container.get<WasherApplicationService>(WASHER_APPLICATION_SERVICE);
    const washer = await washerService.setup(command);
    const { forecasts } = await container
      .get<ForecastApplicationService>(FORECAST_SERVICE)
      .getForecast(washer);
    return washerService.getWashRecommendations(forecasts);
  },
};
