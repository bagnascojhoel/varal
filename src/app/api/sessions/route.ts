import { NextResponse } from 'next/server';
import { ApplicationServices } from '../_lib/application-services';
import {
  startSessionRequestSchema,
  StartSessionResponse,
} from '../_lib/types/sessions';
import { wrapApi } from '../_lib/wrap-api';

export const POST = wrapApi(async (req: Request) => {
  // 1. Parse JSON body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 2. Validate with Zod
  const validation = startSessionRequestSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: validation.error.errors.map((e) => e.message),
      },
      { status: 400 },
    );
  }

  // 3. Call application service
  const { categories } = validation.data;
  const result = await ApplicationServices.startSession(categories);

  // 4. Map to HTTP status code
  const hasCreated = result.created.length > 0;
  const hasConflicts = result.conflicting.length > 0;

  let statusCode: number;
  if (hasCreated && !hasConflicts) {
    statusCode = 201; // Created
  } else if (hasCreated && hasConflicts) {
    statusCode = 206; // Partial Content
  } else {
    statusCode = 409; // Conflict (all conflicted, none created)
  }

  // 5. Format response
  const response: StartSessionResponse = {
    created: result.created.map((s) => ({
      id: s.id,
      category: s.category,
      startedAt: s.startedAt.toISOString(),
      endedAt: s.endedAt?.toISOString() ?? null,
    })),
    conflicting: result.conflicting,
  };

  return NextResponse.json(response, { status: statusCode });
});
