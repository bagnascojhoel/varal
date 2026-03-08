import 'reflect-metadata';
import { ExternalServiceError } from '@/core/domain/external-service-error';
import type { RestClient } from '@/core/infrastructure/rest/rest-client';
import { inject, injectable } from 'inversify';

export const BIGDATACLOUD_CLIENT_SERVICE = Symbol.for(
  'BigDataCloudClientService',
);
export const BIGDATACLOUD_REST_CLIENT = Symbol.for('BigDataCloudRestClient');
export const NOMINATIM_REST_CLIENT = Symbol.for('NominatimRestClient');

interface BigDataCloudTimezone {
  ianaTimeId: string;
}

interface Informative {
  description: string;
  name: string;
  order: number;
}

interface LocalityInfo {
  informative: Informative[];
}

interface BigDataCloudResponse {
  city?: string;
  locality?: string;
  countryCode?: string;
  localityInfo: LocalityInfo;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

function extractTimezone(data: BigDataCloudResponse): string {
  return (
    data.localityInfo.informative.find(
      (info) => info.description === 'fuso horário',
    )?.name ?? 'UTC'
  );
}

export interface BigDataCloudLocationResponse {
  cityName: string;
  countryCode: string;
  timezoneIana: string;
}

export interface BigDataCloudLocalityResponse extends BigDataCloudLocationResponse {
  lat: number;
  lon: number;
}

@injectable()
export class BigDataCloudClientService {
  constructor(
    @inject(BIGDATACLOUD_REST_CLIENT)
    private readonly bigDataCloudClient: RestClient,
    @inject(NOMINATIM_REST_CLIENT) private readonly nominatimClient: RestClient,
  ) {}

  async fetchLocalityInfo(
    lat: number,
    lon: number,
    locale: string, // TODO this locale is not comming as expected.
  ): Promise<BigDataCloudLocationResponse> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      localityLanguage: 'pt-BR',
      key: process.env.BIGDATACLOUD_API_KEY ?? '',
    });

    const data = await this.bigDataCloudClient.get<BigDataCloudResponse>(
      `/data/reverse-geocode?${params.toString()}`,
      { timeoutMs: 5_000, nextOptions: { revalidate: 86400 } },
    );

    const city = data.city ?? data.locality;
    if (!city)
      throw new ExternalServiceError(
        'BigDataCloud',
        'Response missing city name',
      );

    // TODO need a better way to find timezone from API resposne
    return {
      cityName: city,
      countryCode: data.countryCode ?? '',
      timezoneIana: extractTimezone(data),
    };
  }

  async fetchLocalityByCity(
    cityName: string,
    uf: string,
    locale: string,
  ): Promise<BigDataCloudLocalityResponse> {
    const params = new URLSearchParams({
      q: `${cityName},${uf},Brazil`,
      format: 'json',
      limit: '1',
    });

    const results = await this.nominatimClient.get<NominatimResult[]>(
      `/search?${params.toString()}`,
      { timeoutMs: 5_000, headers: { 'User-Agent': 'varal/1.0' } },
    );

    if (results.length === 0) {
      throw new ExternalServiceError('Nominatim', 'No results found for city');
    }

    const lat = parseFloat(results[0].lat);
    const lon = parseFloat(results[0].lon);

    const info = await this.fetchLocalityInfo(lat, lon, locale);
    return { lat, lon, ...info };
  }
}
