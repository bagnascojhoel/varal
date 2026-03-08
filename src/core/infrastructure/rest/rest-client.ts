import type { RestRequestOptions } from './rest-client-service';

export interface RestClient {
  get<T>(path: string, options?: RestRequestOptions): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<T>;
  put<T>(
    path: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<T>;
}
