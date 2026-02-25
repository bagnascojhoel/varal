import { ExternalServiceError } from '@/core/domain/external-service-error';
import { RestClientService } from '@/core/infrastructure/rest/rest-client-service';

interface BigDataCloudTimezone {
  ianaTimeId: string;
}

interface BigDataCloudResponse {
  city?: string;
  locality?: string;
  countryCode?: string;
  timezone?: BigDataCloudTimezone;
}

interface NominatimResult {
  lat: string;
  lon: string;
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

export class BigDataCloudClientService {
  private readonly bigDataCloudClient = new RestClientService(
    'BigDataCloud',
    'https://api.bigdatacloud.net',
  );
  private readonly nominatimClient = new RestClientService(
    'Nominatim',
    'https://nominatim.openstreetmap.org',
  );

  async fetchLocalityInfo(
    lat: number,
    lon: number,
    locale: string, // TODO this locale is not comming as expected.
  ): Promise<BigDataCloudLocationResponse> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      localityLanguage: 'pt-BR',
    });

    const data = await this.bigDataCloudClient.get<BigDataCloudResponse>(
      `/data/reverse-geocode-client?${params.toString()}`,
      { timeoutMs: 5_000, nextOptions: { revalidate: 86400 } },
    );

    const city = data.city ?? data.locality;
    if (!city)
      throw new ExternalServiceError(
        'BigDataCloud',
        'Response missing city name',
      );

    return {
      cityName: city,
      countryCode: data.countryCode ?? '',
      timezoneIana: data.timezone?.ianaTimeId ?? 'UTC',
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
