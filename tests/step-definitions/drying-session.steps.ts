import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'assert';
import type { TestWorld } from '../support/world';

// Increase timeout for API calls to 10 seconds
setDefaultTimeout(10 * 1000);

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

interface SessionResponse {
  created: Array<{
    id: number;
    category: string;
    startedAt: string;
    endedAt: string | null;
  }>;
  conflicting: string[];
}

interface ErrorResponse {
  error?: string;
  issues?: string[];
}

interface TestContext {
  statusCode?: number;
  responseBody?: SessionResponse | ErrorResponse;
}

const testContext: TestContext = {};

Before({ tags: '@drying-session' }, async function (this: TestWorld) {
  // Setup DI container
  this.setupContainer();

  // Ensure database is initialized
  try {
    // Try a simple query to check if table exists
    await this.prismaClient.dryingSession.findMany();
  } catch (error) {
    // Table doesn't exist, try to create it
    try {
      const sql = `
        CREATE TABLE IF NOT EXISTS "DryingSession" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "category" TEXT NOT NULL,
          "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "endedAt" DATETIME
        );

        CREATE INDEX IF NOT EXISTS "DryingSession_category_startedAt_idx" ON "DryingSession"("category", "startedAt");
      `;
      // Use $executeRawUnsafe to run raw SQL
      await this.prismaClient.$executeRawUnsafe(sql);
    } catch (createError) {
      console.error('Failed to initialize database:', createError);
      throw createError;
    }
  }

  // Clear all sessions before each scenario
  try {
    await this.prismaClient.dryingSession.deleteMany({});
  } catch (error) {
    // Ignore cleanup errors
  }
});

After({ tags: '@drying-session' }, async function (this: TestWorld) {
  // Clean up after each scenario
  try {
    await this.prismaClient.dryingSession.deleteMany({});
  } catch (error) {
    // If database doesn't exist or can't be accessed, this is OK for non-drying-session tests
  }
});

// ===== GIVEN steps =====

Given('I have no active drying sessions', async function (this: TestWorld) {
  // Already cleared by Before hook
  const count = await this.prismaClient.dryingSession.count();
  assert.strictEqual(count, 0);
});

Given(
  'I have active drying sessions for {string} started {int} minutes ago',
  async function (this: TestWorld, categoriesStr: string, minutesAgo: number) {
    // Parse categories - comma-separated
    // e.g., "LIGHT" or "LIGHT, MEDIUM"
    const categories = categoriesStr
      .split(',')
      .map((c) => c.trim());
    const startedAt = new Date(Date.now() - minutesAgo * 60 * 1000);

    for (const category of categories) {
      await this.prismaClient.dryingSession.create({
        data: {
          category,
          startedAt,
          endedAt: null,
        },
      });
    }
  },
);

// ===== WHEN steps =====

When(
  'I request to start sessions for categories {string}',
  async (categoriesStr: string) => {
    let categories: string[];

    if (categoriesStr.trim() === '') {
      categories = [];
    } else {
      // Parse categories - comma-separated
      // e.g., "LIGHT" or "LIGHT, MEDIUM"
      categories = categoriesStr
        .split(',')
        .map((c) => c.trim());
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });

      testContext.statusCode = response.status;
      testContext.responseBody = (await response.json()) as
        | SessionResponse
        | ErrorResponse;
    } catch (error) {
      // Network or JSON parsing errors
      testContext.statusCode = 0;
      testContext.responseBody = {
        error: `Failed to call API: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
);

// ===== THEN steps =====

Then('I should get status code {int}', (expectedStatusCode: number) => {
  assert.strictEqual(
    testContext.statusCode,
    expectedStatusCode,
    `Expected status ${expectedStatusCode}, got ${testContext.statusCode}`,
  );
});

Then(
  'I should receive {int} created session(s)',
  (expectedCount: number) => {
    const body = testContext.responseBody as SessionResponse;
    assert(
      body.created,
      'Response should have "created" field',
    );
    assert(
      Array.isArray(body.created),
      'created should be an array',
    );
    assert.strictEqual(
      body.created.length,
      expectedCount,
      `Expected ${expectedCount} created sessions, got ${body.created.length}`,
    );
  },
);

Then(
  'I should receive {int} conflicting categories',
  (expectedCount: number) => {
    const body = testContext.responseBody as SessionResponse;
    assert(
      body.conflicting,
      'Response should have "conflicting" field',
    );
    assert(
      Array.isArray(body.conflicting),
      'conflicting should be an array',
    );
    assert.strictEqual(
      body.conflicting.length,
      expectedCount,
      `Expected ${expectedCount} conflicting categories, got ${body.conflicting.length}`,
    );
  },
);

Then(
  'I should receive {int} conflicting category',
  (expectedCount: number) => {
    const body = testContext.responseBody as SessionResponse;
    assert(
      body.conflicting,
      'Response should have "conflicting" field',
    );
    assert(
      Array.isArray(body.conflicting),
      'conflicting should be an array',
    );
    assert.strictEqual(
      body.conflicting.length,
      expectedCount,
      `Expected ${expectedCount} conflicting categories, got ${body.conflicting.length}`,
    );
  },
);

Then('the response should contain an error message', () => {
  const body = testContext.responseBody as ErrorResponse;
  const hasError = body.error !== undefined;
  const hasIssues = body.issues !== undefined && Array.isArray(body.issues);

  assert(
    hasError || hasIssues,
    'Response should contain "error" or "issues" field',
  );
});
