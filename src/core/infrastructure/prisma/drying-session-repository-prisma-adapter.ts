import { injectable, inject } from 'inversify';
import { DryingSession } from '../../domain/drying-session';
import { ClothingWeightCategory } from '../../domain/clothing-weight-category';
import { DryingSessionRepository } from '../../domain/drying-session-repository';
import { PRISMA_CLIENT } from './prisma-client';
import { PrismaClient } from '@prisma/client';

@injectable()
export class DryingSessionRepositoryPrismaAdapter implements DryingSessionRepository {
  constructor(@inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async createMany(sessions: DryingSession[]): Promise<DryingSession[]> {
    await this.prisma.dryingSession.createMany({
      data: sessions.map((session) => ({
        category: session.category,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
      })),
    });

    // Fetch the created records to get their IDs
    const categories = sessions.map((s) => s.category);
    const now = new Date(Date.now() - 60000); // Last minute
    const results = await this.prisma.dryingSession.findMany({
      where: {
        category: { in: categories },
        startedAt: { gte: now },
      },
    });

    return results.map(
      (row) =>
        new DryingSession(
          row.id,
          row.category as ClothingWeightCategory,
          row.startedAt,
          row.endedAt,
        ),
    );
  }

  async findActiveByCategories(
    categories: ClothingWeightCategory[],
  ): Promise<DryingSession[]> {
    const rows = await this.prisma.dryingSession.findMany({
      where: {
        endedAt: null,
        category: { in: categories },
      },
    });

    return rows.map(
      (row) =>
        new DryingSession(
          row.id,
          row.category as ClothingWeightCategory,
          row.startedAt,
          row.endedAt,
        ),
    );
  }
}
