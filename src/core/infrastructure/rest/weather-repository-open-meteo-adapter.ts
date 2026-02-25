import { DayForecast } from '@/core/domain/day-forecast';
import { Locality } from '@/core/domain/locality';
import type { WeatherRepository } from '@/core/domain/weather-repository';
import { RestClientService } from '@/core/infrastructure/rest/rest-client-service';
import type { OpenMeteoResponse } from '@/core/infrastructure/rest/types/open-meteo';
import { injectable } from 'inversify';
import { DateTime } from 'luxon';
import 'reflect-metadata';

@injectable()
export class WeatherRepositoryOpenMeteoAdapter implements WeatherRepository {
  private readonly client = new RestClientService('Open-Meteo', 'https://api.open-meteo.com');

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
