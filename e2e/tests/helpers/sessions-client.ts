import type { APIRequestContext } from '@playwright/test';

export interface DryingSessionDTO {
  id: number;
  category: string;
  startedAt: string;
  endedAt: string | null;
}

export interface StartSessionResponse {
  created: DryingSessionDTO[];
  conflicting: string[];
}

export class SessionsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async startSession(
    categories: string[],
  ): Promise<{ status: number; body: StartSessionResponse }> {
    const res = await this.request.post('/api/sessions', {
      data: { categories },
    });
    return { status: res.status(), body: await res.json() };
  }

  async startSessionRaw(
    body: unknown,
  ): Promise<{ status: number; body: unknown }> {
    const res = await this.request.post('/api/sessions', { data: body });
    return { status: res.status(), body: await res.json() };
  }

  async deleteAll(): Promise<void> {
    await this.request.delete('/api/sessions');
  }
}
