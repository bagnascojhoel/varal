import type { RestClient } from '../../src/core/infrastructure/rest/rest-client';

export class MockedRestClientService implements RestClient {
  private readonly responses = new Map<string, unknown>();

  register(pathPattern: string, body: unknown): void {
    this.responses.set(pathPattern, body);
  }

  async get<T>(path: string): Promise<T> {
    return this.resolve(path);
  }
  async post<T>(path: string): Promise<T> {
    return this.resolve(path);
  }
  async put<T>(path: string): Promise<T> {
    return this.resolve(path);
  }
  async patch<T>(path: string): Promise<T> {
    return this.resolve(path);
  }

  private resolve<T>(path: string): T {
    for (const [pattern, body] of this.responses)
      if (path.includes(pattern)) return body as T;
    throw new Error(`MockedRestClientService: no mock for path "${path}"`);
  }
}
