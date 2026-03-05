import { test, expect } from '@playwright/test';

test.describe('POST /api/washers', () => {
  test('sets up washer with valid CEP', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { cep: '01310100' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('lat');
    expect(body).toHaveProperty('lon');
    expect(body).toHaveProperty('cityName');
    expect(body).toHaveProperty('timezone');
    expect(body).toHaveProperty('countryCode');
  });

  test('sets up washer with valid coordinates', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { lat: -23.55, lon: -46.63 },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('lat');
    expect(body).toHaveProperty('lon');
    expect(body).toHaveProperty('cityName');
    expect(body).toHaveProperty('timezone');
    expect(body).toHaveProperty('countryCode');
  });

  test('returns 400 for invalid CEP format (too short)', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { cep: '0131010' },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 for invalid CEP format (letters)', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { cep: 'abcdefgh' },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 for latitude out of range', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { lat: 91, lon: -46.63 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 for longitude out of range', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: { lat: -23.55, lon: 181 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 for empty body', async ({ request }) => {
    const res = await request.post('/api/washers', {
      data: {},
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 for invalid JSON body', async ({ request }) => {
    const res = await request.post('/api/washers', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not-json',
    });

    expect(res.status()).toBe(400);
  });
});
