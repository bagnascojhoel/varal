import { NextResponse } from 'next/server';
import { z } from 'zod';
import { container } from '@/core/ContainerConfig';
import {
  ForecastService,
  FORECAST_SERVICE,
} from '@/core/application-services/forecast-service';
import { OpenMeteoError } from '@/core/infrastructure/rest/weather-repository-open-meteo-adapter';

const coordNumber = (name: string, min: number, max: number) =>
  z.preprocess(
    (v) => (v === null ? undefined : v),
    z
      .string({ required_error: `${name} is required` })
      .transform((v, ctx) => {
        const n = Number(v);
        if (isNaN(n)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${name} must be a number`,
          });
          return z.NEVER;
        }
        return n;
      })
      .pipe(
        z
          .number()
          .min(min, `${name} must be >= ${min}`)
          .max(max, `${name} must be <= ${max}`),
      ),
  );

const querySchema = z.object({
  latitude: coordNumber('latitude', -90, 90),
  longitude: coordNumber('longitude', -180, 180),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    latitude: searchParams.get('latitude'),
    longitude: searchParams.get('longitude'),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: parsed.error.errors.map((e) => e.message),
      },
      { status: 400 },
    );
  }

  const { latitude, longitude } = parsed.data;

  try {
    const data = await container
      .get<ForecastService>(FORECAST_SERVICE)
      .getForecast(latitude, longitude);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof OpenMeteoError) {
      return NextResponse.json(
        {
          error: 'Weather service unavailable',
          message: error.message,
        },
        { status: 502 },
      );
    }
    throw error;
  }
}
