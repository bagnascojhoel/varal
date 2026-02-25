import { withErrorHandler } from './with-error-handler';
import { withLogging } from './with-logging';

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response>;

export function wrapApi(handler: RouteHandler): RouteHandler {
  return withErrorHandler(withLogging(handler));
}
