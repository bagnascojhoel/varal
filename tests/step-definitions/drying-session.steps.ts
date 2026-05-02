import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'assert';
import type { TestWorld } from '../support/world';
import type { StartSessionResult } from '../../src/core/application-services/drying-session-application-service';
import {
  CLOTHING_WEIGHT_CATEGORIES,
  type ClothingWeightCategory,
} from '../../src/core/domain/clothing-weight-category';
import { DryingSession } from '../../src/core/domain/drying-session';

let result: StartSessionResult;

Before({ tags: '@drying-session' }, function (this: TestWorld) {
  this.setupContainer();
});

After({ tags: '@drying-session' }, function (this: TestWorld) {
  this.dryingSessionRepository.clear();
});

// ===== GIVEN steps =====

Given('I have no active drying sessions', function (this: TestWorld) {
  this.dryingSessionRepository.clear();
});

Given(
  'I have active drying sessions for {string} started {int} minutes ago',
  function (this: TestWorld, categoriesStr: string, minutesAgo: number) {
    const categories = categoriesStr
      .split(',')
      .map((c) => c.trim() as ClothingWeightCategory);
    const startedAt = new Date(Date.now() - minutesAgo * 60 * 1000);

    const sessions = categories.map(
      (category) => new DryingSession(null, category, startedAt, null),
    );
    this.dryingSessionRepository.seed(sessions);
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
