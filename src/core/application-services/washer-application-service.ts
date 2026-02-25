import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
  LOCALITY_REPOSITORY,
  type LocalityRepository,
} from '@/core/domain/localization-repository';
import { Washer } from '@/core/domain/washer';
import { WasherSetupCommand } from '../domain/washer-setup-command';
import { determineWashDecision, type WashDecision } from '../domain/wash-decision';

export const WASHER_APPLICATION_SERVICE = Symbol.for('WasherApplicationService');

@injectable()
export class WasherApplicationService {
  constructor(
    @inject(LOCALITY_REPOSITORY)
    private readonly localityRepository: LocalityRepository,
  ) {}

  async setup(command: WasherSetupCommand): Promise<Washer> {
    const location = await this.localityRepository.fetchLocality(command);
    return new Washer(location);
  }

  getWashRecommendations(dayForecasts: Array<{ precipitationProbabilityMax: number; precipitationSum: number }>): WashDecision[] {
    return dayForecasts.map((day) =>
      determineWashDecision(
        day.precipitationProbabilityMax,
        day.precipitationSum,
      ),
    );
  }
}
