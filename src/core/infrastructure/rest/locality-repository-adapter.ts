import { Coordinates } from '@/core/domain/coordinates';
import { Locality } from '@/core/domain/locality';
import type { LocalityRepository } from '@/core/domain/localization-repository';
import { WasherSetupCommand } from '@/core/domain/washer-setup-command';
import {
  BigDataCloudClientService,
  BIGDATACLOUD_CLIENT_SERVICE,
} from '@/core/infrastructure/rest/bigdatacloud-client-service';
import {
  ViacepClientService,
  VIACEP_CLIENT_SERVICE,
} from '@/core/infrastructure/rest/viacep-client-service';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LocalityRepositoryAdapter implements LocalityRepository {
  constructor(
    @inject(BIGDATACLOUD_CLIENT_SERVICE) private readonly bigDataCloudClient: BigDataCloudClientService,
    @inject(VIACEP_CLIENT_SERVICE) private readonly viacepClient: ViacepClientService,
  ) {}

  async fetchLocality(command: WasherSetupCommand): Promise<Locality> {
    const locale = command.acceptLocale;

    if (command.coordinates) {
      const { lat, lon } = command.coordinates;
      const info = await this.bigDataCloudClient.fetchLocalityInfo(
        lat,
        lon,
        locale,
      );
      return new Locality(
        new Coordinates(lat, lon),
        info.cityName,
        info.countryCode,
        info.timezoneIana,
      );
    }

    const { cityName, uf } = await this.viacepClient.fetchCityFromCep(
      command.cep!.value,
    );
    const locality = await this.bigDataCloudClient.fetchLocalityByCity(
      cityName,
      uf,
      locale,
    );
    return new Locality(
      new Coordinates(locality.lat, locality.lon),
      locality.cityName,
      locality.countryCode,
      locality.timezoneIana,
    );
  }
}
