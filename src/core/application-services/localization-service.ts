import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
  LOCALIZATION_REPOSITORY,
  type LocalizationRepository,
} from '@/core/domain/localization-repository';
import type { Location } from '@/core/domain/location';

export const LOCALIZATION_SERVICE = Symbol.for('LocalizationService');

@injectable()
export class LocalizationService {
  constructor(
    @inject(LOCALIZATION_REPOSITORY)
    private readonly localizationRepository: LocalizationRepository,
  ) {}

  async lookupByCep(cep: string): Promise<Location> {
    return this.localizationRepository.fetchLocationByCep(cep);
  }
}
