import { WeatherState } from '@/core/domain/weather-state';
import { DateTime } from 'luxon';
import { Locality } from './locality';

const CAN_WASH_PHRASES = [
  'Adeus, roupa suja! 👋',
  'Hoje é dia de lavar! ✨',
  'O sol tá chamando a roupa ☀️',
  'Boa notícia pra lavanderia 🎉',
  'Aproveita que vai secar! 🌬️',
  'A roupa agradece 🙌',
  'Tô vendo roupa secando aí 👀',
  'Sem desculpa hoje 💪',
] as const;

const CANNOT_WASH_PHRASES = [
  'Que passe logo 🙏',
  'A roupa fica pra amanhã 😔',
  'Nem tenta, vai molhar tudo 🌧️',
  'Chuva chata demais 😒',
  'Deixa no cesto por enquanto ⏳',
  'Hoje não dá, irmão 😬',
  'O varal vai esperar mais um dia 😮‍💨',
  'Nem pensa nisso hoje 🙅',
] as const;

function dateHash(date: string): number {
  return date.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function pickPhrase(canWash: boolean, date: string): string {
  const phrases = canWash ? CAN_WASH_PHRASES : CANNOT_WASH_PHRASES;
  return phrases[dateHash(date) % phrases.length];
}

export class DayForecast {
  readonly locality: Locality;
  readonly date: DateTime;
  readonly precipitationSum: number;
  readonly precipitationProbabilityMax: number;
  readonly hourlyPrecipitationProbability: number[];
  readonly dayWeatherState: WeatherState;

  constructor(fields: {
    locality: Locality;
    date: DateTime;
    precipitationSum: number;
    precipitationProbabilityMax: number;
    hourlyPrecipitationProbability: number[];
    dayWeatherState: WeatherState;
  }) {
    this.locality = fields.locality;
    this.date = fields.date;
    this.precipitationSum = fields.precipitationSum;
    this.precipitationProbabilityMax = fields.precipitationProbabilityMax;
    this.dayWeatherState = fields.dayWeatherState;
    this.hourlyPrecipitationProbability = fields.hourlyPrecipitationProbability;
  }

  static builder(): DayForecastBuilder {
    return new DayForecastBuilder();
  }

  isStillUsableNow(): boolean {
    return this.locality.isStillUsable(this.locality.zonedNow());
  }
}

export class DayForecastBuilder {
  private _locality?: Locality;
  private _date?: DateTime;
  private _precipitationSum?: number;
  private _precipitationProbabilityMax?: number;
  private _hourlyPrecipitationProbability?: number[];
  private _dayWeatherState?: WeatherState;

  locality(locality: Locality): this {
    this._locality = locality;
    return this;
  }

  date(date: DateTime): this {
    this._date = date;
    return this;
  }

  precipitationSum(value: number): this {
    this._precipitationSum = value;
    return this;
  }

  precipitationProbabilityMax(value: number): this {
    this._precipitationProbabilityMax = value;
    return this;
  }

  hourlyPrecipitationProbability(values: number[]): this {
    this._hourlyPrecipitationProbability = values;
    return this;
  }

  dayWeatherState(state: WeatherState): this {
    this._dayWeatherState = state;
    return this;
  }

  build(): DayForecast {
    if (this._locality === undefined) throw new Error('locality is required');
    if (this._date === undefined) throw new Error('date is required');
    if (this._precipitationSum === undefined) throw new Error('precipitationSum is required');
    if (this._precipitationProbabilityMax === undefined) throw new Error('precipitationProbabilityMax is required');
    if (this._hourlyPrecipitationProbability === undefined) throw new Error('hourlyPrecipitationProbability is required');
    if (this._dayWeatherState === undefined) throw new Error('dayWeatherState is required');

    return new DayForecast({
      locality: this._locality,
      date: this._date,
      precipitationSum: this._precipitationSum,
      precipitationProbabilityMax: this._precipitationProbabilityMax,
      hourlyPrecipitationProbability: this._hourlyPrecipitationProbability,
      dayWeatherState: this._dayWeatherState,
    });
  }
}
