import { ExternalServiceError } from '@/core/domain/external-service-error';
import { Logger } from '@/core/infrastructure/logger';
import { NextResponse } from 'next/server';

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        Logger.error('external service error', {
          service: error.service,
          description: error.description,
          ...(error.statusCode !== undefined && {
            statusCode: error.statusCode,
          }),
          ...(error.cause !== undefined && { cause: error.cause }),
        });
        return NextResponse.json(
          { error: 'External service unavailable' },
          { status: 502 },
        );
      }
      Logger.error('unhandled exception', { error });
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
