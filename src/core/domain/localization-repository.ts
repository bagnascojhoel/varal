import type { Location } from '@/core/domain/location';

export interface LocalizationRepository {
  fetchLocationByCoordinates(lat: number, lon: number): Promise<Location>;
  fetchLocationByCep(cep: string): Promise<Location>;
}

export const LOCALIZATION_REPOSITORY = Symbol.for('LocalizationRepository');
