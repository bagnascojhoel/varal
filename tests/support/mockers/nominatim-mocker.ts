import { MockedRestClientService } from '../mocked-rest-client-service';

export class NominatimMocker {
  constructor(private readonly client: MockedRestClientService) {}

  mockSearch(lat: number, lon: number): void {
    this.client.register('/search', [{ lat: String(lat), lon: String(lon) }]);
  }
}
