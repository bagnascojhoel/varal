import type { APIRequestContext } from '@playwright/test';

export const SAO_PAULO = { latitude: '-23.55', longitude: '-46.63' };

export async function getJson(request: APIRequestContext, path: string, params?: Record<string, string>) {
  const res = await request.get(path, { params });
  const body = await res.json();
  return { res, body };
}
