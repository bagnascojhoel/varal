import 'reflect-metadata';
import { injectable } from 'inversify';
import type { LocalizationRepository } from '@/core/domain/localization-repository';
import { Location } from '@/core/domain/location';
import { GeocodingClientService } from '@/core/infrastructure/rest/geocoding-client-service';
import { ViacepClientService } from '@/core/infrastructure/rest/viacep-client-service';

@injectable()
export class LocationRepositoryAdapter implements LocalizationRepository {
  private readonly geocodingClient = new GeocodingClientService();
  private readonly viacepClient = new ViacepClientService();

  async fetchLocationByCoordinates(
    lat: number,
    lon: number,
  ): Promise<Location> {
    const cityName = await this.geocodingClient.fetchCityName(lat, lon);
    return new Location(lat, lon, cityName ?? '');
  }

  async fetchLocationByCep(cep: string): Promise<Location> {
    const result = await this.viacepClient.fetchCoordinatesFromCep(cep);
    return new Location(result.lat, result.lon, result.cityName);
  }
}
