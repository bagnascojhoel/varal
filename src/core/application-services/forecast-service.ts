import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '@/core/domain/weather-repository';
import {
  LOCALIZATION_REPOSITORY,
  type LocalizationRepository,
} from '@/core/domain/localization-repository';
import { determineTimeState } from '@/core/domain/wash-decision';
import type { DayForecast } from '@/core/domain/day-forecast';
import type { TimeState } from '@/core/domain/time-state';

export interface ForecastPageResponse {
  forecasts: DayForecast[];
  cityName: string | null;
  timeState: TimeState;
  dayEnded: boolean;
  currentHour: number;
  currentMinutes: number;
}

export const FORECAST_SERVICE = Symbol.for('ForecastService');

@injectable()
export class ForecastService {
  constructor(
    @inject(WEATHER_REPOSITORY)
    private readonly weatherRepository: WeatherRepository,
    @inject(LOCALIZATION_REPOSITORY)
    private readonly localizationRepository: LocalizationRepository,
  ) {}

  async getForecast(lat: number, lon: number): Promise<ForecastPageResponse> {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const [forecasts, location] = await Promise.all([
      this.weatherRepository.fetchForecast(lat, lon, currentHour),
      this.localizationRepository.fetchLocationByCoordinates(lat, lon),
    ]);

    const timeState = determineTimeState(currentHour);
    const dayEnded = currentHour >= 21;

    return {
      forecasts,
      cityName: location.cityName || null,
      timeState,
      dayEnded,
      currentHour,
      currentMinutes,
    };
  }
}
