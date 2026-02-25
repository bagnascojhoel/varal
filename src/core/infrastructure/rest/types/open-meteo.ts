export interface OpenMeteoResponse {
  timezone: string;
  daily: {
    time: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
  hourly?: {
    time: string[];
    precipitation_probability: number[];
  };
}
