export interface WashDecision {
  canWash: boolean;
  reason: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string[];
  message?: string;
}

export type TimeState = "morning" | "afternoon" | "night";
export type WeatherState = "rainy" | "cloudy" | "sunny";
export type WindowState = "clear" | "unsure" | "rain";
export type BarState = "good" | "warn" | "bad";

export interface DayForecast {
  date: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  decision: WashDecision;
  weatherState: WeatherState;
  /** 15 values: precipitation probability for hours 6–20 */
  hourlyPrecipitationProbability: number[];
  morningWindow: WindowState;
  afternoonWindow: WindowState;
  /** true when there is still time in the day to wash clothes (false when the day has ended) */
  stillUsable: boolean;
}

export interface ForecastPageResponse {
  forecasts: DayForecast[];
  cityName: string | null;
  timeState: TimeState;
  dayEnded: boolean;
  currentHour: number;
  currentMinutes: number;
}
