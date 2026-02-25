import type { Locality } from '@/core/domain/locality';

export class Washer {
  readonly locality: Locality;

  constructor(location: Locality) {
    this.locality = location;
  }
}
