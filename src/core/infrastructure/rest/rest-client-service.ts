import { ExternalServiceError } from '@/core/domain/external-service-error';
import { Logger } from '@/core/infrastructure/logger';
import {
  CircuitBreaker,
  CircuitBreakerOptions,
} from '@/core/infrastructure/rest/circuit-breaker';
import type { RestClient } from '@/core/infrastructure/rest/rest-client';

const DEFAULT_TIMEOUT_MS = 10_000;

export interface RestRequestOptions extends Omit<
  RequestInit,
  'signal' | 'method' | 'body'
> {
  timeoutMs?: number;
  nextOptions?: NextFetchRequestConfig;
}

export class RestClientService implements RestClient {
  private readonly circuitBreaker: CircuitBreaker | null;

  constructor(
    private readonly serviceName: string,
    private readonly host: string,
    circuitBreakerOptions?: CircuitBreakerOptions,
  ) {
    this.circuitBreaker = circuitBreakerOptions
      ? new CircuitBreaker(serviceName, circuitBreakerOptions)
      : null;
  }

  async get<T>(path: string, options: RestRequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options: RestRequestOptions = {},
  ): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(
    path: string,
    body?: unknown,
    options: RestRequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options: RestRequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    options: RestRequestOptions,
  ): Promise<T> {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, nextOptions, ...init } = options;
    const urlString = this.host.replace(/\/$/, '') + path;

    Logger.info('outbound request sending, serviceName={}, method={}, url={}', [
      this.serviceName,
      method,
      urlString,
    ]);

    const fetchBlock = async (): Promise<T> => {
      let response: Response;
      try {
        response = await fetch(urlString, {
          ...init,
          method,
          signal: AbortSignal.timeout(timeoutMs),
          ...(body !== undefined && {
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', ...init.headers },
          }),
          ...(nextOptions && { next: nextOptions }),
        });
      } catch (cause) {
        Logger.error(
          'outbound request failed, serviceName={}, method={}, url={}',
          [this.serviceName, method, urlString],
        );
        throw new ExternalServiceError(
          this.serviceName,
          'Request failed',
          cause,
        );
      }

      Logger.info(
        'outbound request completed, serviceName={}, method={}, url={}, responseStatus={}',
        [this.serviceName, method, urlString, response.status],
      );

      if (!response.ok) {
        throw new ExternalServiceError(
          this.serviceName,
          'Response returned non-success status',
          await response.json(),
          response.status,
        );
      }

      try {
        return (await response.json()) as T;
      } catch (cause) {
        throw new ExternalServiceError(
          this.serviceName,
          'Failed to parse response body as JSON',
          cause,
        );
      }
    };

    return this.circuitBreaker
      ? this.circuitBreaker.execute(fetchBlock)
      : fetchBlock();
  }
}
