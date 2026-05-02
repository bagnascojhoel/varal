import { CLOTHING_WEIGHT_CATEGORIES } from '@/core/domain/clothing-weight-category';
import { TimeState } from '@/core/domain/time-state';
import { ClothingRecommendation } from '@/core/domain/wash-decision';
import { WeatherState } from '@/core/domain/weather-state';
import type { Meta, StoryObj } from '@storybook/react';
import ptMessages from '../../../messages/pt-BR.json';
import { DayCard } from './DayCard';

const HOURLY_CLEAR = Array(24).fill(5);
const HOURLY_MIXED = [
  5, 5, 5, 5, 5, 5, 10, 15, 20, 30, 45, 60, 70, 65, 50, 35, 20, 10, 5, 5, 5, 5,
  5, 5,
];
const HOURLY_RAINY = Array(24).fill(85);

const recommendAll = (state: ClothingRecommendation) =>
  Object.fromEntries(
    CLOTHING_WEIGHT_CATEGORIES.map((cat) => [cat, state]),
  ) as Record<string, ClothingRecommendation>;

const meta: Meta<typeof DayCard> = {
  title: 'UI/DayCard',
  component: DayCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#e0e7ef' },
      ],
    },
  },
  args: {
    date: '2026-05-01',
    label: 'Hoje',
    cardIndex: 0,
    isToday: false,
    timeState: TimeState.Morning,
    currentHour: 9,
    currentMinutes: 30,
    isStillUsableNow: true,
    labels: ptMessages,
  },
};

export default meta;
type Story = StoryObj<typeof DayCard>;

export const ClearDay: Story = {
  name: 'Dia limpo',
  args: {
    phrase: 'Ótimo dia para lavar.',
    dayWeatherState: WeatherState.Sunny,
    hourlyPrecipitationProbability: HOURLY_CLEAR,
    clothingRecommendations: recommendAll(ClothingRecommendation.Recomendar),
  },
};

export const MixedDay: Story = {
  name: 'Dia misto',
  args: {
    phrase: 'Chuva à tarde. Prefira a manhã.',
    dayWeatherState: WeatherState.Cloudy,
    hourlyPrecipitationProbability: HOURLY_MIXED,
    clothingRecommendations: recommendAll(ClothingRecommendation.Condicional),
  },
};

export const RainyDay: Story = {
  name: 'Dia chuvoso',
  args: {
    phrase: 'Chuva o dia todo. Não é um bom dia.',
    dayWeatherState: WeatherState.Rainy,
    hourlyPrecipitationProbability: HOURLY_RAINY,
    clothingRecommendations: recommendAll(ClothingRecommendation.Evitar),
  },
};

export const TodayAfternoon: Story = {
  name: 'Hoje — tarde (com marcador de horário)',
  args: {
    phrase: 'Tarde ainda favorável.',
    dayWeatherState: WeatherState.Cloudy,
    hourlyPrecipitationProbability: HOURLY_MIXED,
    clothingRecommendations: recommendAll(ClothingRecommendation.Condicional),
    isToday: true,
    timeState: TimeState.Afternoon,
    currentHour: 14,
    currentMinutes: 15,
  },
};

export const TodayEnded: Story = {
  name: 'Hoje encerrado',
  args: {
    phrase: 'Dia encerrado.',
    dayWeatherState: WeatherState.Sunny,
    hourlyPrecipitationProbability: HOURLY_CLEAR,
    clothingRecommendations: recommendAll(ClothingRecommendation.Recomendar),
    isToday: true,
    timeState: TimeState.Night,
    currentHour: 22,
    currentMinutes: 0,
    isStillUsableNow: false,
  },
};

export const FutureDay: Story = {
  name: 'Dia futuro',
  args: {
    date: '2026-05-03',
    label: 'Dom',
    cardIndex: 2,
    phrase: 'Boas condições amanhã.',
    dayWeatherState: WeatherState.Sunny,
    hourlyPrecipitationProbability: HOURLY_MIXED,
    clothingRecommendations: recommendAll(ClothingRecommendation.Recomendar),
    isToday: false,
  },
};
