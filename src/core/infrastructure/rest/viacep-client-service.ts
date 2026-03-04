import 'reflect-metadata';
import { ExternalServiceError } from '@/core/domain/external-service-error';
import type { RestClient } from '@/core/infrastructure/rest/rest-client';
import { inject, injectable } from 'inversify';

export const VIACEP_CLIENT_SERVICE = Symbol.for('ViacepClientService');
export const VIACEP_REST_CLIENT = Symbol.for('ViacepRestClient');

interface ViaCepResponse {
  erro?: boolean;
  localidade?: string;
  uf?: string;
}

@injectable()
export class ViacepClientService {
  constructor(
    @inject(VIACEP_REST_CLIENT) private readonly client: RestClient,
  ) {}

  async fetchCityFromCep(cep: string): Promise<{ cityName: string; uf: string }> {
    const data = await this.client.get<ViaCepResponse>(`/ws/${cep}/json/`, {
      timeoutMs: 5_000,
    });

    if (data.erro === true || !data.localidade || !data.uf) {
      throw new ExternalServiceError('ViaCEP', 'CEP not found or response missing city/state');
    }

    return { cityName: data.localidade, uf: data.uf };
  }
}
