export class CepError extends Error {
  constructor(
    public readonly code: 'NOT_FOUND' | 'GEOCODE_FAILED' | 'NETWORK_ERROR',
  ) {
    super(code);
    this.name = 'CepError';
  }
}

interface ViaCepResponse {
  erro?: boolean;
  localidade?: string;
  uf?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

export class ViacepClientService {
  async fetchCoordinatesFromCep(
    cep: string,
  ): Promise<{ lat: number; lon: number; cityName: string }> {
    let viaCepData: ViaCepResponse;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        signal: AbortSignal.timeout(5_000),
      });
      viaCepData = (await res.json()) as ViaCepResponse;
    } catch {
      throw new CepError('NETWORK_ERROR');
    }

    if (viaCepData.erro === true || !viaCepData.localidade || !viaCepData.uf) {
      throw new CepError('NOT_FOUND');
    }

    const { localidade, uf } = viaCepData;

    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('q', `${localidade},${uf},Brazil`);
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('limit', '1');

    let results: NominatimResult[];
    try {
      const res = await fetch(nominatimUrl.toString(), {
        headers: { 'User-Agent': 'varal/1.0' },
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) throw new Error('not ok');
      results = (await res.json()) as NominatimResult[];
    } catch {
      throw new CepError('GEOCODE_FAILED');
    }

    if (results.length === 0) {
      throw new CepError('GEOCODE_FAILED');
    }

    const { lat, lon } = results[0];
    return {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      cityName: `${localidade}, ${uf}`,
    };
  }
}
