import { DayWindow, sliceWindow } from '@/core/domain/day-window';
import { DayForecast, pickPhrase } from '@/core/domain/day-forecast';
import type { TimeState } from '@/core/domain/time-state';
import type { Timezone } from '@/core/domain/time-zone';
import {
  ClothingRecommendation,
  determineTimeState,
  determineWashDecision,
  determineWindowState,
} from '@/core/domain/wash-decision';
import type { WeatherState } from '@/core/domain/weather-state';
import type { WindowState } from '@/core/domain/window-state';
import {
  CLOTHING_WEIGHT_CATEGORIES,
  type ClothingWeightCategory,
} from '@/core/domain/clothing-weight-category';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '@/core/domain/weather-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Washer } from '../domain/washer';

export interface ForecastDayDto {
  date: string;
  phrase: string;
  morningWindow: WindowState;
  afternoonWindow: WindowState;
  dayWeatherState?: WeatherState;
  hourlyPrecipitationProbability: number[];
  isStillUsableNow: boolean;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  clothingRecommendations: Record<ClothingWeightCategory, ClothingRecommendation>;
}

export interface ForecastPageResponse {
  forecasts: ForecastDayDto[];
  cityName: string;
  timezone: Timezone;
  timeState: TimeState;
  dayEnded: boolean;
}

export const FORECAST_SERVICE = Symbol.for('ForecastService');

@injectable()
export class ForecastApplicationService {
  private readonly FORECAST_NEXT_DAYS: number = 5;

  constructor(
    @inject(WEATHER_REPOSITORY)
    private readonly weatherRepository: WeatherRepository,
  ) {}

  async getForecast(washer: Washer): Promise<ForecastPageResponse> {
    const forecasts = await this.weatherRepository.fetchForecast(
      washer.locality,
      this.FORECAST_NEXT_DAYS,
    );
    const timeState = determineTimeState(washer.locality.zonedHour());
    const dayEnded = !washer.locality.isStillUsable(washer.locality.zonedNow());
    const relevantForecasts = dayEnded
      ? forecasts.slice(1)
      : forecasts.slice(0, 4);
    return {
      forecasts: relevantForecasts.map((f) => this.toDto(f)),
      cityName: washer.locality.cityName,
      timezone: washer.locality.timezone,
      timeState,
      dayEnded,
    };
  }

  private toDto(dayForecast: DayForecast): ForecastDayDto {
    const canWash = determineWashDecision(
      dayForecast.precipitationProbabilityMax,
      dayForecast.precipitationSum,
    ).canWash;
    const hourly = dayForecast.hourlyPrecipitationProbability;
    const date = dayForecast.date.toISODate()!;
    // TODO: replace with per-category classifier (domain story)
    const stubRec = canWash
      ? ClothingRecommendation.Recomendar
      : ClothingRecommendation.Evitar;
    const clothingRecommendations = Object.fromEntries(
      CLOTHING_WEIGHT_CATEGORIES.map((cat) => [cat, stubRec]),
    ) as Record<ClothingWeightCategory, ClothingRecommendation>;
    return {
      date,
      phrase: pickPhrase(canWash, date),
      morningWindow: determineWindowState(
        sliceWindow(DayWindow.MORNING, hourly),
      ),
      afternoonWindow: determineWindowState(
        sliceWindow(DayWindow.AFTERNOON, hourly),
      ),
      dayWeatherState: dayForecast.dayWeatherState,
      hourlyPrecipitationProbability: hourly,
      isStillUsableNow: dayForecast.isStillUsableNow(),
      precipitationProbabilityMax: dayForecast.precipitationProbabilityMax,
      precipitationSum: dayForecast.precipitationSum,
      clothingRecommendations,
    };
  }
}
