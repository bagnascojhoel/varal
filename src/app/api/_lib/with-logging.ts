import { Logger } from '@/core/infrastructure/logger';

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response>;

export function withLogging(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    Logger.info('inbound request received, method={}, url={}', [req.method, req.url]);
    const response = await handler(req, ctx);
    Logger.info('inbound request completed, method={}, url={}', [req.method, req.url]);
    return response;
  };
}
