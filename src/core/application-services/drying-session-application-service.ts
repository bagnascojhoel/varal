import { injectable, inject } from 'inversify';
import { DryingSession } from '../domain/drying-session';
import { ClothingWeightCategory } from '../domain/clothing-weight-category';
import {
  DRYING_SESSION_REPOSITORY,
  type DryingSessionRepository,
} from '../domain/drying-session-repository';

export interface StartSessionResult {
  created: DryingSession[];
  conflicting: ClothingWeightCategory[];
}

export const START_SESSION_APPLICATION_SERVICE = Symbol.for(
  'DryingSessionApplicationService',
);

@injectable()
export class DryingSessionApplicationService {
  constructor(
    @inject(DRYING_SESSION_REPOSITORY)
    private readonly repository: DryingSessionRepository,
  ) {}

  async startSession(
    categories: ClothingWeightCategory[],
  ): Promise<StartSessionResult> {
    // Fetch active sessions for these categories
    const active = await this.repository.findActiveByCategories(categories);

    // Partition into created and conflicting using domain logic
    const { created, conflicting } = DryingSession.startMany(
      categories,
      active,
    );

    // Persist created sessions
    if (created.length > 0) {
      const persisted = await this.repository.createMany(created);
      return { created: persisted, conflicting };
    }

    return { created: [], conflicting };
  }
}
