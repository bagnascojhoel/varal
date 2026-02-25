import { CircuitBreaker } from '@/core/infrastructure/rest/circuit-breaker';
import { ExternalServiceError } from '@/core/domain/external-service-error';

jest.mock('@/core/infrastructure/logger', () => ({
  Logger: { warn: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

const SERVICE = 'test-service';
const succeed = () => Promise.resolve('ok');
const fail = () => Promise.reject(new Error('boom'));

describe('CircuitBreaker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('CLOSED state', () => {
    it('returns the result of fn when it resolves', async () => {
      const cb = new CircuitBreaker(SERVICE, { failureThreshold: 3, resetTimeoutMs: 5000 });
      await expect(cb.execute(() => Promise.resolve(42))).resolves.toBe(42);
    });

    it('re-throws the original error when fn rejects', async () => {
      const cb = new CircuitBreaker(SERVICE, { failureThreshold: 3, resetTimeoutMs: 5000 });
      const cause = new Error('boom');
      await expect(cb.execute(() => Promise.reject(cause))).rejects.toThrow(cause);
    });

    it('does not open the circuit before failureThreshold is reached', async () => {
      const cb = new CircuitBreaker(SERVICE, { failureThreshold: 3, resetTimeoutMs: 5000 });
      await expect(cb.execute(fail)).rejects.toThrow('boom');
      await expect(cb.execute(fail)).rejects.toThrow('boom');
      // still CLOSED — third call should attempt fn, not short-circuit
      const fn = jest.fn(fail);
      await expect(cb.execute(fn)).rejects.toThrow('boom');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('opens the circuit exactly at failureThreshold', async () => {
      const cb = new CircuitBreaker(SERVICE, { failureThreshold: 2, resetTimeoutMs: 5000 });
      await expect(cb.execute(fail)).rejects.toThrow('boom');
      await expect(cb.execute(fail)).rejects.toThrow('boom');

      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).rejects.toThrow(ExternalServiceError);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('OPEN state', () => {
    async function openCircuit(failureThreshold = 2, resetTimeoutMs = 5000) {
      const cb = new CircuitBreaker(SERVICE, { failureThreshold, resetTimeoutMs });
      for (let i = 0; i < failureThreshold; i++) {
        await expect(cb.execute(fail)).rejects.toThrow();
      }
      return cb;
    }

    it('throws ExternalServiceError immediately without calling fn', async () => {
      const cb = await openCircuit();
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).rejects.toThrow(ExternalServiceError);
      expect(fn).not.toHaveBeenCalled();
    });

    it('error message indicates circuit is open', async () => {
      const cb = await openCircuit();
      await expect(cb.execute(succeed)).rejects.toThrow('Circuit open');
    });

    it('remains OPEN before resetTimeoutMs elapses', async () => {
      const cb = await openCircuit(2, 5000);
      jest.advanceTimersByTime(4999);
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).rejects.toThrow(ExternalServiceError);
      expect(fn).not.toHaveBeenCalled();
    });

    it('transitions to HALF_OPEN once resetTimeoutMs elapses', async () => {
      const cb = await openCircuit(2, 5000);
      jest.advanceTimersByTime(5000);
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).resolves.toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('HALF_OPEN state', () => {
    async function halfOpenCircuit(successThreshold?: number) {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 1,
        resetTimeoutMs: 1000,
        successThreshold,
      });
      await expect(cb.execute(fail)).rejects.toThrow();
      jest.advanceTimersByTime(1000);
      return cb;
    }

    it('closes the circuit after successThreshold successes (default 1)', async () => {
      const cb = await halfOpenCircuit();
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      // circuit now CLOSED — next failure should not open immediately (threshold is 1)
      // but fn is called, confirming circuit is no longer short-circuiting
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).resolves.toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('requires successThreshold > 1 successes before closing', async () => {
      const cb = await halfOpenCircuit(2);
      // first success in HALF_OPEN — not yet closed
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      // second success closes it
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      // now CLOSED: a fresh failure should count against threshold, not open immediately
      const fn = jest.fn(fail);
      await expect(cb.execute(fn)).rejects.toThrow('boom');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('reopens the circuit on a failure in HALF_OPEN', async () => {
      const cb = await halfOpenCircuit();
      await expect(cb.execute(fail)).rejects.toThrow('boom');

      // circuit should be OPEN again — fn not called
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).rejects.toThrow(ExternalServiceError);
      expect(fn).not.toHaveBeenCalled();
    });

    it('resets successCount when re-opening from HALF_OPEN', async () => {
      const cb = await halfOpenCircuit(2);
      // one success in HALF_OPEN, then a failure → back to OPEN
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      await expect(cb.execute(fail)).rejects.toThrow('boom');

      // advance to HALF_OPEN again
      jest.advanceTimersByTime(1000);
      // successCount must have been reset; need 2 successes again
      await expect(cb.execute(succeed)).resolves.toBe('ok'); // 1st — still HALF_OPEN
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).resolves.toBe('ok'); // 2nd — closes
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('re-throws the original error when probe fails', async () => {
      const cb = await halfOpenCircuit();
      const cause = new Error('probe failed');
      await expect(cb.execute(() => Promise.reject(cause))).rejects.toThrow(cause);
    });
  });

  describe('rate limiting', () => {
    it('allows up to maxRequests within the window', async () => {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 10,
        resetTimeoutMs: 5000,
        rateLimit: { maxRequests: 3, windowMs: 1000 },
      });
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      await expect(cb.execute(succeed)).resolves.toBe('ok');
      await expect(cb.execute(succeed)).resolves.toBe('ok');
    });

    it('throws ExternalServiceError when maxRequests is exceeded within the window', async () => {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 10,
        resetTimeoutMs: 5000,
        rateLimit: { maxRequests: 2, windowMs: 1000 },
      });
      await cb.execute(succeed);
      await cb.execute(succeed);
      await expect(cb.execute(succeed)).rejects.toThrow(ExternalServiceError);
    });

    it('rate limit error message indicates rate limit exceeded', async () => {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 10,
        resetTimeoutMs: 5000,
        rateLimit: { maxRequests: 1, windowMs: 1000 },
      });
      await cb.execute(succeed);
      await expect(cb.execute(succeed)).rejects.toThrow('Rate limit exceeded');
    });

    it('does not call fn when rate limit is exceeded', async () => {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 10,
        resetTimeoutMs: 5000,
        rateLimit: { maxRequests: 1, windowMs: 1000 },
      });
      await cb.execute(succeed);
      const fn = jest.fn(succeed);
      await expect(cb.execute(fn)).rejects.toThrow(ExternalServiceError);
      expect(fn).not.toHaveBeenCalled();
    });

    it('sliding window: old timestamps expire and allow new requests', async () => {
      const cb = new CircuitBreaker(SERVICE, {
        failureThreshold: 10,
        resetTimeoutMs: 5000,
        rateLimit: { maxRequests: 2, windowMs: 1000 },
      });
      await cb.execute(succeed);
      await cb.execute(succeed);
      // window not yet expired — should be rejected
      await expect(cb.execute(succeed)).rejects.toThrow(ExternalServiceError);

      // advance past the window
      jest.advanceTimersByTime(1000);
      // old timestamps are now outside the window; slot is free again
      await expect(cb.execute(succeed)).resolves.toBe('ok');
    });
  });
});
