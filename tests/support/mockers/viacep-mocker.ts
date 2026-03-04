import { MockedRestClientService } from '../mocked-rest-client-service';

export class ViacepMocker {
  constructor(private readonly client: MockedRestClientService) {}

  mockCep(localidade: string, uf: string): void {
    this.client.register('/ws/', { localidade, uf });
  }
}
