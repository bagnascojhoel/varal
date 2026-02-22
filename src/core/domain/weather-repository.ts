import type { DayForecast } from '@/core/domain/day-forecast';

export interface WeatherRepository {
  fetchTodayPrecipitation(
    lat: number,
    lon: number,
  ): Promise<{ precipitationSum: number; precipitationProbabilityMax: number }>;
  fetchForecast(
    lat: number,
    lon: number,
    currentHour: number,
  ): Promise<DayForecast[]>;
}

export const WEATHER_REPOSITORY = Symbol.for('WeatherRepository');
