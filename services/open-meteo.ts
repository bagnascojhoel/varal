import type { OpenMeteoResponse } from "@/types/open-meteo";
import type { DayForecast } from "@/types/api";
import { buildDayForecast } from "@/domain/wash-decision";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenMeteoError";
  }
}

export async function fetchTodayPrecipitation(
  latitude: number,
  longitude: number
): Promise<{ precipitationSum: number; precipitationProbabilityMax: number }> {
  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "precipitation_sum,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new OpenMeteoError("Open-Meteo is unavailable");
  }

  if (!response.ok) {
    throw new OpenMeteoError(
      `Open-Meteo returned status ${response.status}`
    );
  }

  const data: OpenMeteoResponse = await response.json();

  const precipitationSum = data.daily.precipitation_sum[0] ?? 0;
  const precipitationProbabilityMax =
    data.daily.precipitation_probability_max[0] ?? 0;

  return { precipitationSum, precipitationProbabilityMax };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  currentHour: number
): Promise<DayForecast[]> {
  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "precipitation_sum,precipitation_probability_max"
  );
  url.searchParams.set("hourly", "precipitation_probability");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "4");

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new OpenMeteoError("Open-Meteo is unavailable");
  }

  if (!response.ok) {
    throw new OpenMeteoError(
      `Open-Meteo returned status ${response.status}`
    );
  }

  const data: OpenMeteoResponse = await response.json();
  const hourlyProb = data.hourly?.precipitation_probability ?? [];

  return data.daily.time.map((date, dayIndex) => {
    const precipSum = data.daily.precipitation_sum[dayIndex] ?? 0;
    const precipMax = data.daily.precipitation_probability_max[dayIndex] ?? 0;

    // Hourly data: 24 values per day; extract hours 6–20 (indices 6–20, 15 values)
    const dayOffset = dayIndex * 24;
    const hourly6to20 = Array.from({ length: 15 }, (_, i) =>
      hourlyProb[dayOffset + 6 + i] ?? 0
    );

    const stillUsable = dayIndex === 0 ? currentHour < 21 : true;
    return buildDayForecast(date, precipSum, precipMax, hourly6to20, stillUsable);
  });
}
