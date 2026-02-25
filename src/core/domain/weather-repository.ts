import type { DayForecast } from '@/core/domain/day-forecast';
import { Locality } from './locality';

export interface WeatherRepository {
  fetchForecast(locality: Locality, days: number): Promise<DayForecast[]>;
}

export const WEATHER_REPOSITORY = Symbol.for('WeatherRepository');
