import type { Locality } from '@/core/domain/locality';
import { WasherSetupCommand } from './washer-setup-command';

export interface LocalityRepository {
  fetchLocality(command: WasherSetupCommand): Promise<Locality>;
}

export const LOCALITY_REPOSITORY = Symbol.for('LocalityRepository');
