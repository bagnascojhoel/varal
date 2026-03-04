import { MockedRestClientService } from '../mocked-rest-client-service';

function buildOpenMeteoResponse(precipProb: number, precipSum: number, days: number) {
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  return {
    timezone: 'America/Sao_Paulo',
    daily: {
      time: dates,
      precipitation_probability_max: Array(days).fill(precipProb),
      precipitation_sum: Array(days).fill(precipSum),
    },
    hourly: {
      time: Array(days * 24).fill(''),
      precipitation_probability: Array(days * 24).fill(precipProb),
    },
  };
}

export class OpenMeteoMocker {
  constructor(private readonly client: MockedRestClientService) {}

  mockForecast(precipProb: number, precipSum: number, days: number = 5): void {
    this.client.register('/v1/forecast', buildOpenMeteoResponse(precipProb, precipSum, days));
  }
}
