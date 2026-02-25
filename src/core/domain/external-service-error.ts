export class ExternalServiceError extends Error {
  constructor(
    public readonly service: string,
    public readonly description: string,
    public readonly cause?: unknown,
    public readonly statusCode?: number,
  ) {
    super(`External service failed: ${service} — ${description}`);
  }
}
