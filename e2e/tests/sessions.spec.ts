import { test, expect } from '@playwright/test';
import { SessionsApiClient } from './helpers/sessions-client';

test.describe.configure({ mode: 'serial' });

test.describe('POST /api/sessions', () => {
  let client: SessionsApiClient;

  test.beforeEach(({ request }) => {
    client = new SessionsApiClient(request);
  });

  test.afterEach(async () => {
    await client.deleteAll();
  });

  // Scenario 1: returns 400 for empty categories array
  test('returns 400 for empty categories array', async () => {
    const { status } = await client.startSession([]);
    expect(status).toBe(400);
  });

  // Scenario 2: returns 400 for unrecognised category value
  test('returns 400 for unrecognised category value', async () => {
    const { status } = await client.startSession(['ultra-heavy']);
    expect(status).toBe(400);
  });

  // Scenario 3: returns 400 for missing categories field
  test('returns 400 for missing categories field', async () => {
    const { status } = await client.startSessionRaw({});
    expect(status).toBe(400);
  });

  // Scenario 4: 201 — creates one session per category, all share the same startedAt
  test('201: creates one session per category, all share the same startedAt', async () => {
    const { status, body } = await client.startSession(['LIGHT', 'HEAVY']);

    expect(status).toBe(201);
    expect(body.created).toHaveLength(2);
    expect(body.conflicting).toHaveLength(0);

    const startedAts = body.created.map((s) => s.startedAt);
    expect(startedAts[0]).toBe(startedAts[1]);
  });

  // Scenario 5: 201 — non-conflicting category created when another category is active
  test('201: non-conflicting category created when another category is active', async () => {
    // First, create a session for LIGHT
    await client.startSession(['LIGHT']);

    // HEAVY is a different category — should not conflict
    const { status, body } = await client.startSession(['HEAVY']);

    expect(status).toBe(201);
    expect(body.created).toHaveLength(1);
    expect(body.created[0].category).toBe('HEAVY');
    expect(body.conflicting).toHaveLength(0);
  });

  // Scenario 6: 409 — all categories conflict, nothing created
  test('409: all categories conflict — nothing created', async () => {
    // Seed an active MEDIUM session
    await client.startSession(['MEDIUM']);

    // Try to start the same category again immediately (within conflict window)
    const { status, body } = await client.startSession(['MEDIUM']);

    expect(status).toBe(409);
    expect(body.created).toHaveLength(0);
    expect(body.conflicting).toContain('MEDIUM');
  });

  // Scenario 7: 206 — partial conflict — non-conflicting created, conflicting reported
  test('206: partial conflict — non-conflicting created, conflicting reported', async () => {
    // Seed an active LIGHT session
    await client.startSession(['LIGHT']);

    // Request both LIGHT (conflict) and EXTRA_HEAVY (no conflict)
    const { status, body } = await client.startSession([
      'LIGHT',
      'EXTRA_HEAVY',
    ]);

    expect(status).toBe(206);
    expect(body.created.map((s) => s.category)).toContain('EXTRA_HEAVY');
    expect(body.conflicting).toContain('LIGHT');
  });

  // Scenario 8: 201 — same category allowed after conflict window expires (await 6 s)
  test('201: same category allowed after conflict window expires', async ({
    page,
  }) => {
    // Seed an active EXTRA_LIGHT session
    await client.startSession(['EXTRA_LIGHT']);

    // Wait for SESSION_CONFLICT_WINDOW_MS (5000 ms in test env) to expire
    await page.waitForTimeout(6000);

    const { status, body } = await client.startSession(['EXTRA_LIGHT']);

    expect(status).toBe(201);
    expect(body.created.map((s) => s.category)).toContain('EXTRA_LIGHT');
    expect(body.conflicting).toHaveLength(0);
  });

  // Scenario 9: response body always contains created[] and conflicting[]
  test('response body always contains created[] and conflicting[]', async () => {
    // 201 case
    const response201 = await client.startSession(['LIGHT']);
    expect(response201.body).toHaveProperty('created');
    expect(response201.body).toHaveProperty('conflicting');
    expect(Array.isArray(response201.body.created)).toBe(true);
    expect(Array.isArray(response201.body.conflicting)).toBe(true);

    // 409 case (conflict by re-requesting immediately)
    const response409 = await client.startSession(['LIGHT']);
    expect(response409.body).toHaveProperty('created');
    expect(response409.body).toHaveProperty('conflicting');
    expect(Array.isArray(response409.body.created)).toBe(true);
    expect(Array.isArray(response409.body.conflicting)).toBe(true);
  });

  // Scenario 10: each created session has id, category, and startedAt fields
  test('each created session has id, category, and startedAt fields', async () => {
    const { status, body } = await client.startSession(['HEAVY']);

    expect(status).toBe(201);
    expect(body.created).toHaveLength(1);

    const session = body.created[0];
    expect(typeof session.id).toBe('number');
    expect(typeof session.category).toBe('string');
    expect(typeof session.startedAt).toBe('string');
  });
});
