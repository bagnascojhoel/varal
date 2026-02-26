import { ExternalServiceError } from '@/core/domain/external-service-error';
import { Logger } from '@/core/infrastructure/logger';

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
  successThreshold?: number;
  rateLimit?: RateLimitOptions;
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private openedAt: number | null = null;
  private requestTimestamps: number[] = [];

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly successThreshold: number;
  private readonly rateLimit: RateLimitOptions | undefined;

  constructor(
    private readonly serviceName: string,
    options: CircuitBreakerOptions,
  ) {
    this.failureThreshold = options.failureThreshold;
    this.resetTimeoutMs = options.resetTimeoutMs;
    this.successThreshold = options.successThreshold ?? 1;
    this.rateLimit = options.rateLimit;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.checkRateLimit();

    if (this.state === 'OPEN') {
      const now = Date.now();
      if (this.openedAt !== null && now - this.openedAt >= this.resetTimeoutMs) {
        this.transitionTo('HALF_OPEN');
      } else {
        throw new ExternalServiceError(this.serviceName, 'Circuit open — too many recent failures');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private checkRateLimit(): void {
    if (!this.rateLimit) return;

    const { maxRequests, windowMs } = this.rateLimit;
    const now = Date.now();

    this.requestTimestamps = this.requestTimestamps.filter(ts => now - ts < windowMs);

    if (this.requestTimestamps.length >= maxRequests) {
      throw new ExternalServiceError(this.serviceName, 'Rate limit exceeded');
    }

    this.requestTimestamps.push(now);
  }

  private onSuccess(): void {
    this.successCount++;
    if (this.state === 'HALF_OPEN' && this.successCount >= this.successThreshold) {
      this.transitionTo('CLOSED');
      this.failureCount = 0;
      this.successCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) {
      this.transitionTo('OPEN');
      this.openedAt = Date.now();
    } else if (this.state === 'HALF_OPEN') {
      this.transitionTo('OPEN');
      this.openedAt = Date.now();
      this.successCount = 0;
    }
  }

  private transitionTo(state: CircuitState): void {
    Logger.warn('circuit breaker state transition, serviceName={}, state={}', [
      this.serviceName,
      state,
    ]);
    this.state = state;
  }
}
