import { Coordinates } from '@/core/domain/coordinates';
import { Locality } from '@/core/domain/locality';
import type { LocalityRepository } from '@/core/domain/localization-repository';
import { WasherSetupCommand } from '@/core/domain/washer-setup-command';
import { BigDataCloudClientService } from '@/core/infrastructure/rest/bigdatacloud-client-service';
import { ViacepClientService } from '@/core/infrastructure/rest/viacep-client-service';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LocalityRepositoryAdapter implements LocalityRepository {
  private readonly bigDataCloudClient = new BigDataCloudClientService();
  private readonly viacepClient = new ViacepClientService();

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
