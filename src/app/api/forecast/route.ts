import { NextResponse } from 'next/server';
import { ApplicationServices } from '../_lib/application-services';
import { forecastQuerySchema } from '../_lib/types/forecast';
import { wrapApi } from '../_lib/wrap-api';

export const GET = wrapApi(async function (request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = forecastQuerySchema.safeParse({
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
  const acceptLocale = request.headers.get('Accept-Language') ?? undefined;
  const data = await ApplicationServices.getForecast(latitude, longitude, acceptLocale);

  return NextResponse.json(data);
});
