import { MockedRestClientService } from '../mocked-rest-client-service';

export class BigDataCloudMocker {
  constructor(private readonly client: MockedRestClientService) {}

  mockLocalityInfo(cityName: string, timezone: string): void {
    this.client.register('/data/reverse-geocode', {
      city: cityName,
      countryCode: 'BR',
      localityInfo: {
        informative: [
          { description: 'fuso horário', name: timezone, order: 1 },
        ],
      },
    });
  }
}
