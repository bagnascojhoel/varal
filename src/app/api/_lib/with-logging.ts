import { Logger } from '@/core/infrastructure/logger';

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response>;

export function withLogging(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const url = new URL(req.url);
    const methodAndUrl = `${req.method} ${url.pathname}${url.search}`;
    Logger.info(`[inbound-request] received request ${methodAndUrl}`);
    const response = await handler(req, ctx);
    Logger.info(`[inbound-request] completed request ${methodAndUrl}`);
    return response;
  };
}
