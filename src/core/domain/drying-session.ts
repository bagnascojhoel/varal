import { ClothingWeightCategory } from './clothing-weight-category';
import {
  DryingSessionStatus,
  DRYING_SESSION_STATUS,
} from './drying-session-status';

export class DryingSession {
  constructor(
    readonly id: number | null,
    readonly category: ClothingWeightCategory,
    readonly startedAt: Date,
    readonly endedAt: Date | null,
  ) {}

  get status(): DryingSessionStatus {
    return this.endedAt === null
      ? DRYING_SESSION_STATUS.ACTIVE
      : DRYING_SESSION_STATUS.COMPLETED;
  }

  get isActive(): boolean {
    return this.status === DRYING_SESSION_STATUS.ACTIVE;
  }

  static start(category: ClothingWeightCategory): DryingSession {
    return new DryingSession(null, category, new Date(), null);
  }

  static startMany(
    categories: ClothingWeightCategory[],
    existingActive: DryingSession[],
  ): { created: DryingSession[]; conflicting: ClothingWeightCategory[] } {
    const conflicting: ClothingWeightCategory[] = [];
    const created: DryingSession[] = [];
    const now = new Date();
    const FIVE_MINUTES_MS = process.env.SESSION_CONFLICT_WINDOW_MS
      ? parseInt(process.env.SESSION_CONFLICT_WINDOW_MS, 10)
      : 5 * 60 * 1000;

    for (const category of categories) {
      // Find if this category has an active session within 5 minutes
      const recentActive = existingActive.find(
        (session) =>
          session.category === category &&
          session.isActive &&
          now.getTime() - session.startedAt.getTime() <= FIVE_MINUTES_MS,
      );

      if (recentActive) {
        conflicting.push(category);
      } else {
        created.push(DryingSession.start(category));
      }
    }

    return { created, conflicting };
  }
}
