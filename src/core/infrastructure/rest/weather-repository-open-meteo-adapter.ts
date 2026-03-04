import { DayForecast } from '@/core/domain/day-forecast';
import { Locality } from '@/core/domain/locality';
import type { WeatherRepository } from '@/core/domain/weather-repository';
import type { RestClient } from '@/core/infrastructure/rest/rest-client';
import type { OpenMeteoResponse } from '@/core/infrastructure/rest/types/open-meteo';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import 'reflect-metadata';

export const OPENMETEO_REST_CLIENT = Symbol.for('OpenMeteoRestClient');

@injectable()
export class WeatherRepositoryOpenMeteoAdapter implements WeatherRepository {
  constructor(
    @inject(OPENMETEO_REST_CLIENT) private readonly client: RestClient,
  ) {}

  async fetchForecast(locality: Locality, days: number): Promise<DayForecast[]> {
    const params = new URLSearchParams({
      latitude: String(locality.coordinates.lat),
      longitude: String(locality.coordinates.lon),
      daily: 'precipitation_sum,precipitation_probability_max',
      hourly: 'precipitation_probability',
      timezone: locality.timezone,
      forecast_days: String(days),
    });

    const data = await this.client.get<OpenMeteoResponse>(
      `/v1/forecast?${params.toString()}`,
      { timeoutMs: 10_000 },
    );

    return data.daily.time.map((dateTime, dayIndex) => {
      const precipSum = data.daily.precipitation_sum[dayIndex] ?? 0;
      const precipMax = data.daily.precipitation_probability_max[dayIndex] ?? 0;
      const precipitationProbabilityHourly =
        data.hourly!.precipitation_probability.filter(
          (_, index) => index > dayIndex * 24 && index < (dayIndex + 1) * 24,
        );
      return DayForecast.builder()
        .locality(locality)
        .date(DateTime.fromISO(dateTime))
        .hourlyPrecipitationProbability(precipitationProbabilityHourly)
        .precipitationProbabilityMax(precipMax)
        .precipitationSum(precipSum)
        .build();
    });
  }
}
