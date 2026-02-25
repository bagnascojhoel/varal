import { DayWindow, sliceWindow } from '@/core/domain/day-window';
import { DayForecast, pickPhrase } from '@/core/domain/day-forecast';
import type { TimeState } from '@/core/domain/time-state';
import type { Timezone } from '@/core/domain/time-zone';
import {
  determineTimeState,
  determineWashDecision,
  determineWindowState,
} from '@/core/domain/wash-decision';
import type { WeatherState } from '@/core/domain/weather-state';
import type { WindowState } from '@/core/domain/window-state';
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
  dayWeatherState: WeatherState;
  hourlyPrecipitationProbability: number[];
  isStillUsableNow: boolean;
  precipitationProbabilityMax: number;
  precipitationSum: number;
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
  private readonly FORECAST_NEXT_DAYS: number = 4;

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
    return {
      forecasts: forecasts.map((f) => this.toDto(f)),
      cityName: washer.locality.cityName,
      timezone: washer.locality.timezone,
      timeState,
      dayEnded: washer.locality.isStillUsable(washer.locality.zonedNow()),
    };
  }

  private toDto(dayForecast: DayForecast): ForecastDayDto {
    const canWash = determineWashDecision(
      dayForecast.precipitationProbabilityMax,
      dayForecast.precipitationSum,
    ).canWash;
    const hourly = dayForecast.hourlyPrecipitationProbability;
    const date = dayForecast.date.toISODate()!;
    return {
      date,
      phrase: pickPhrase(canWash, date),
      morningWindow: determineWindowState(sliceWindow(DayWindow.MORNING, hourly)),
      afternoonWindow: determineWindowState(sliceWindow(DayWindow.AFTERNOON, hourly)),
      dayWeatherState: dayForecast.dayWeatherState,
      hourlyPrecipitationProbability: hourly,
      isStillUsableNow: dayForecast.isStillUsableNow(),
      precipitationProbabilityMax: dayForecast.precipitationProbabilityMax,
      precipitationSum: dayForecast.precipitationSum,
    };
  }
}
