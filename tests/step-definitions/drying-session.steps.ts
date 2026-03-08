import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'assert';
import type { TestWorld } from '../support/world';
import type { StartSessionResult } from '../../src/core/application-services/drying-session-application-service';
import {
  CLOTHING_WEIGHT_CATEGORIES,
  type ClothingWeightCategory,
} from '../../src/core/domain/clothing-weight-category';

let result: StartSessionResult;

Before({ tags: '@drying-session' }, async function (this: TestWorld) {
  this.setupContainer();

  try {
    await this.prismaClient.dryingSession.findMany();
  } catch {
    await this.prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DryingSession" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "category" TEXT NOT NULL,
        "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "endedAt" DATETIME
      );
      CREATE INDEX IF NOT EXISTS "DryingSession_category_startedAt_idx"
        ON "DryingSession"("category", "startedAt");
    `);
  }

  await this.prismaClient.dryingSession.deleteMany({});
});

After({ tags: '@drying-session' }, async function (this: TestWorld) {
  await this.prismaClient.dryingSession.deleteMany({}).catch(() => {});
});

// ===== GIVEN steps =====

Given('I have no active drying sessions', async function (this: TestWorld) {
  const count = await this.prismaClient.dryingSession.count();
  assert.strictEqual(count, 0);
});

Given(
  'I have active drying sessions for {string} started {int} minutes ago',
  async function (this: TestWorld, categoriesStr: string, minutesAgo: number) {
    const categories = categoriesStr.split(',').map((c) => c.trim());
    const startedAt = new Date(Date.now() - minutesAgo * 60 * 1000);

    for (const category of categories) {
      await this.prismaClient.dryingSession.create({
        data: { category, startedAt, endedAt: null },
      });
    }
  },
);

// ===== WHEN steps =====

When(
  'I start sessions for categories {string}',
  async function (this: TestWorld, categoriesStr: string) {
    const categories = categoriesStr
      .split(',')
      .map((c) => c.trim() as ClothingWeightCategory)
      .filter((c) => CLOTHING_WEIGHT_CATEGORIES.includes(c));

    result = await this.dryingSessionService.startSession(categories);
  },
);

// ===== THEN steps =====

Then('I should have {int} created session(s)', (expectedCount: number) => {
  assert.strictEqual(
    result.created.length,
    expectedCount,
    `Expected ${expectedCount} created sessions, got ${result.created.length}`,
  );
});

function assertConflictingCount(expectedCount: number) {
  assert.strictEqual(
    result.conflicting.length,
    expectedCount,
    `Expected ${expectedCount} conflicting categories, got ${result.conflicting.length}`,
  );
}

Then('I should have {int} conflicting categories', (expectedCount: number) => {
  assertConflictingCount(expectedCount);
});

Then('I should have {int} conflicting category', (expectedCount: number) => {
  assertConflictingCount(expectedCount);
});
