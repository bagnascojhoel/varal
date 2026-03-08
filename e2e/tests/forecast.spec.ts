import { test, expect } from '@playwright/test';
import { SAO_PAULO, getJson } from './helpers/api';

test.describe('GET /api/forecast', () => {
  test('returns forecast for valid coordinates', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', SAO_PAULO);

    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('forecasts');
    expect(Array.isArray(body.forecasts)).toBe(true);
    expect(body.forecasts.length).toBeGreaterThan(0);
  });

  test('returns 400 when latitude is missing', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', {
      longitude: SAO_PAULO.longitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when longitude is missing', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', {
      latitude: SAO_PAULO.latitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when latitude is out of range', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', {
      latitude: '91',
      longitude: SAO_PAULO.longitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when longitude is out of range', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', {
      latitude: SAO_PAULO.latitude,
      longitude: '181',
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when coordinates are not numbers', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/forecast', {
      latitude: 'abc',
      longitude: 'xyz',
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });
});
