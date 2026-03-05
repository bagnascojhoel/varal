import { test, expect } from '@playwright/test';
import { SAO_PAULO, getJson } from './helpers/api';

test.describe('GET /api/wash-recommendation', () => {
  test('returns wash recommendation for valid coordinates', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/wash-recommendation', SAO_PAULO);

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('returns 400 when latitude is missing', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/wash-recommendation', {
      longitude: SAO_PAULO.longitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when longitude is missing', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/wash-recommendation', {
      latitude: SAO_PAULO.latitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when latitude is out of range', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/wash-recommendation', {
      latitude: '-91',
      longitude: SAO_PAULO.longitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when coordinates are not numbers', async ({ request }) => {
    const { res, body } = await getJson(request, '/api/wash-recommendation', {
      latitude: 'not-a-number',
      longitude: SAO_PAULO.longitude,
    });

    expect(res.status()).toBe(400);
    expect(body).toHaveProperty('error');
  });
});
