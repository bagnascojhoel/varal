import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchForecast, OpenMeteoError } from "@/services/open-meteo";
import { fetchCityName } from "@/services/geocoding";
import { determineTimeState } from "@/domain/wash-decision";
import type { ForecastPageResponse } from "@/types/api";

const coordNumber = (name: string, min: number, max: number) =>
  z.preprocess(
    (v) => (v === null ? undefined : v),
    z
      .string({ required_error: `${name} is required` })
      .transform((v, ctx) => {
        const n = Number(v);
        if (isNaN(n)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${name} must be a number` });
          return z.NEVER;
        }
        return n;
      })
      .pipe(
        z.number().min(min, `${name} must be >= ${min}`).max(max, `${name} must be <= ${max}`)
      )
  );

const querySchema = z.object({
  latitude: coordNumber("latitude", -90, 90),
  longitude: coordNumber("longitude", -180, 180),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    latitude: searchParams.get("latitude"),
    longitude: searchParams.get("longitude"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: parsed.error.errors.map((e) => e.message),
      },
      { status: 400 }
    );
  }

  const { latitude, longitude } = parsed.data;

  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const [forecasts, cityName] = await Promise.all([
      fetchForecast(latitude, longitude, currentHour),
      fetchCityName(latitude, longitude),
    ]);
    const timeState = determineTimeState(currentHour);
    const dayEnded = currentHour >= 21;

    const body: ForecastPageResponse = {
      forecasts,
      cityName,
      timeState,
      dayEnded,
      currentHour,
      currentMinutes,
    };

    return NextResponse.json(body);
  } catch (error) {
    if (error instanceof OpenMeteoError) {
      return NextResponse.json(
        {
          error: "Weather service unavailable",
          message: error.message,
        },
        { status: 502 }
      );
    }
    throw error;
  }
}
