import { DryingSession } from '../../src/core/domain/drying-session';
import { ClothingWeightCategory } from '../../src/core/domain/clothing-weight-category';
import { DryingSessionRepository } from '../../src/core/domain/drying-session-repository';

export class InMemoryDryingSessionRepository implements DryingSessionRepository {
  private sessions: DryingSession[] = [];
  private nextId = 1;

  async createMany(sessions: DryingSession[]): Promise<DryingSession[]> {
    const persisted = sessions.map(
      (s) => new DryingSession(this.nextId++, s.category, s.startedAt, s.endedAt),
    );
    this.sessions.push(...persisted);
    return persisted;
  }

  async findActiveByCategories(
    categories: ClothingWeightCategory[],
  ): Promise<DryingSession[]> {
    return this.sessions.filter(
      (s) => s.isActive && categories.includes(s.category),
    );
  }

  seed(sessions: DryingSession[]): void {
    this.sessions.push(...sessions);
  }

  clear(): void {
    this.sessions = [];
    this.nextId = 1;
  }
}
