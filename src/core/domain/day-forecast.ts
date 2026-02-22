import {
  determineWashDecision,
  determineWeatherState,
  determineWindowState,
  type WashDecision,
} from '@/core/domain/wash-decision';
import { WeatherState } from '@/core/domain/weather-state';
import { WindowState } from '@/core/domain/window-state';

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

function pickPhrase(canWash: boolean, date: string): string {
  const phrases = canWash ? CAN_WASH_PHRASES : CANNOT_WASH_PHRASES;
  return phrases[dateHash(date) % phrases.length];
}

export class DayForecast {
  readonly date: string;
  readonly precipitationSum: number;
  readonly precipitationProbabilityMax: number;
  readonly decision: WashDecision;
  readonly weatherState: WeatherState;
  readonly hourlyPrecipitationProbability: number[];
  readonly morningWindow: WindowState;
  readonly afternoonWindow: WindowState;
  readonly stillUsable: boolean;
  // Computed at build time as an own property so JSON.stringify serializes it correctly
  readonly phrase: string;

  private constructor(fields: {
    date: string;
    precipitationSum: number;
    precipitationProbabilityMax: number;
    decision: WashDecision;
    weatherState: WeatherState;
    hourlyPrecipitationProbability: number[];
    morningWindow: WindowState;
    afternoonWindow: WindowState;
    stillUsable: boolean;
    phrase: string;
  }) {
    this.date = fields.date;
    this.precipitationSum = fields.precipitationSum;
    this.precipitationProbabilityMax = fields.precipitationProbabilityMax;
    this.decision = fields.decision;
    this.weatherState = fields.weatherState;
    this.hourlyPrecipitationProbability = fields.hourlyPrecipitationProbability;
    this.morningWindow = fields.morningWindow;
    this.afternoonWindow = fields.afternoonWindow;
    this.stillUsable = fields.stillUsable;
    this.phrase = fields.phrase;
  }

  /**
   * @param date         ISO date string (e.g. "2024-01-01")
   * @param precipSum    daily precipitation sum in mm
   * @param precipMax    daily precipitation probability max in %
   * @param hourly6to20  15 hourly precipitation probability values for hours 6–20
   * @param stillUsable  true when there is still time in the day to wash clothes
   */
  static build(
    date: string,
    precipSum: number,
    precipMax: number,
    hourly6to20: number[],
    stillUsable: boolean,
  ): DayForecast {
    const decision = determineWashDecision(precipMax, precipSum);
    const weatherState = determineWeatherState(precipMax, precipSum);

    // Morning window: hours 6–11 → indices 0–5
    const morningWindow = determineWindowState(hourly6to20.slice(0, 6));
    // Afternoon window: hours 12–20 → indices 6–14
    const afternoonWindow = determineWindowState(hourly6to20.slice(6, 15));

    return new DayForecast({
      date,
      precipitationSum: precipSum,
      precipitationProbabilityMax: precipMax,
      decision,
      weatherState,
      hourlyPrecipitationProbability: hourly6to20,
      morningWindow,
      afternoonWindow,
      stillUsable,
      phrase: pickPhrase(decision.canWash, date),
    });
  }
}
