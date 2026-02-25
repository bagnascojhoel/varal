import { NextResponse } from 'next/server';
import { ApplicationServices } from '../_lib/application-services';
import { washerBodySchema } from '../_lib/types/washers';
import { wrapApi } from '../_lib/wrap-api';

export const POST = wrapApi(async function (request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = washerBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid request body',
        details: parsed.error.errors.map((e) => e.message),
      },
      { status: 400 },
    );
  }

  const acceptLocale = request.headers.get('Accept-Language') ?? undefined;
  const data = await ApplicationServices.setupWasher(parsed.data, acceptLocale);

  return NextResponse.json(data);
});
