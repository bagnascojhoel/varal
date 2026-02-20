import type { DayForecast, TimeState, WeatherState, WindowState, WashDecision } from "@/types/api";

const PRECIPITATION_PROBABILITY_THRESHOLD = 40;
const PRECIPITATION_SUM_THRESHOLD = 1;

export function determineWashDecision(
  precipitationProbabilityMax: number,
  precipitationSum: number
): WashDecision {
  const canWash =
    precipitationProbabilityMax < PRECIPITATION_PROBABILITY_THRESHOLD &&
    precipitationSum < PRECIPITATION_SUM_THRESHOLD;

  return {
    canWash,
    reason: canWash ? "No rain expected today" : "Rain expected today",
  };
}

export function determineTimeState(hour: number): TimeState {
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 21) return "afternoon";
  return "night";
}

export function determineWeatherState(
  precipitationProbabilityMax: number,
  precipitationSum: number
): WeatherState {
  if (precipitationProbabilityMax >= 60 || precipitationSum >= 5) return "rainy";
  if (precipitationProbabilityMax >= 20 || precipitationSum >= 1) return "cloudy";
  return "sunny";
}

/** hourlyProb: precipitation probabilities for the window's hours */
export function determineWindowState(hourlyProb: number[]): WindowState {
  const max = hourlyProb.length > 0 ? Math.max(...hourlyProb) : 0;
  if (max < 20) return "clear";
  if (max < 40) return "unsure";
  return "rain";
}

/**
 * @param date         ISO date string (e.g. "2024-01-01")
 * @param precipSum    daily precipitation sum in mm
 * @param precipMax    daily precipitation probability max in %
 * @param hourly6to20  15 hourly precipitation probability values for hours 6–20
 * @param stillUsable  true when there is still time in the day to wash clothes
 */
export function buildDayForecast(
  date: string,
  precipSum: number,
  precipMax: number,
  hourly6to20: number[],
  stillUsable: boolean
): DayForecast {
  const decision = determineWashDecision(precipMax, precipSum);
  const weatherState = determineWeatherState(precipMax, precipSum);

  // Morning window: hours 6–11 → indices 0–5
  const morningWindow = determineWindowState(hourly6to20.slice(0, 6));
  // Afternoon window: hours 12–20 → indices 6–14
  const afternoonWindow = determineWindowState(hourly6to20.slice(6, 15));

  return {
    date,
    precipitationSum: precipSum,
    precipitationProbabilityMax: precipMax,
    decision,
    weatherState,
    hourlyPrecipitationProbability: hourly6to20,
    morningWindow,
    afternoonWindow,
    stillUsable,
  };
}
