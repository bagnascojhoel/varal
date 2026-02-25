import { ExternalServiceError } from '@/core/domain/external-service-error';
import { RestClientService } from '@/core/infrastructure/rest/rest-client-service';

interface ViaCepResponse {
  erro?: boolean;
  localidade?: string;
  uf?: string;
}

export class ViacepClientService {
  private readonly client = new RestClientService('ViaCEP', 'https://viacep.com.br');

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
