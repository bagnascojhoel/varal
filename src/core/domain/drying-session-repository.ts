import { DryingSession } from './drying-session';
import { ClothingWeightCategory } from './clothing-weight-category';

export const DRYING_SESSION_REPOSITORY = Symbol.for('DryingSessionRepository');

export interface DryingSessionRepository {
  createMany(sessions: DryingSession[]): Promise<DryingSession[]>;
  findActiveByCategories(
    categories: ClothingWeightCategory[],
  ): Promise<DryingSession[]>;
}
