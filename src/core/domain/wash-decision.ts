import { BarState } from '@/core/domain/bar-state';
import { TimeState } from '@/core/domain/time-state';
import { WeatherState } from '@/core/domain/weather-state';
import { WindowState } from '@/core/domain/window-state';

export interface WashDecision {
  canWash: boolean;
  reason: string;
}

const PRECIPITATION_PROBABILITY_THRESHOLD = 40;
const PRECIPITATION_SUM_THRESHOLD = 1;

export function determineWashDecision(
  precipitationProbabilityMax: number,
  precipitationSum: number,
): WashDecision {
  const canWash =
    precipitationProbabilityMax < PRECIPITATION_PROBABILITY_THRESHOLD &&
    precipitationSum < PRECIPITATION_SUM_THRESHOLD;

  return {
    canWash,
    reason: canWash ? 'No rain expected today' : 'Rain expected today',
  };
}

export function determineTimeState(hour: number): TimeState {
  if (hour < 6) return TimeState.Night;
  if (hour < 12) return TimeState.Morning;
  if (hour < 21) return TimeState.Afternoon;
  return TimeState.Night;
}

export function determineWeatherState(
  precipitationProbabilityMax: number,
  precipitationSum: number,
): WeatherState {
  if (precipitationProbabilityMax >= 60 || precipitationSum >= 5)
    return WeatherState.Rainy;
  if (precipitationProbabilityMax >= 20 || precipitationSum >= 1)
    return WeatherState.Cloudy;
  return WeatherState.Sunny;
}

export function determineBarState(precipitationProbability: number): BarState {
  if (precipitationProbability >= 60) return BarState.Bad;
  if (precipitationProbability >= 20) return BarState.Warn;
  return BarState.Good;
}

/** hourlyProb: precipitation probabilities for the window's hours */
export function determineWindowState(hourlyProb: number[]): WindowState {
  const max = hourlyProb.length > 0 ? Math.max(...hourlyProb) : 0;
  if (max < 20) return WindowState.Clear;
  if (max < 40) return WindowState.Unsure;
  return WindowState.Rain;
}
