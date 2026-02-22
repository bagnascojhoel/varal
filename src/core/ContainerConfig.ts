import 'reflect-metadata';
import { Container } from 'inversify';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '@/core/domain/weather-repository';
import {
  LOCALIZATION_REPOSITORY,
  type LocalizationRepository,
} from '@/core/domain/localization-repository';
import { WeatherRepositoryOpenMeteoAdapter } from '@/core/infrastructure/rest/weather-repository-open-meteo-adapter';
import { LocationRepositoryAdapter } from '@/core/infrastructure/rest/location-repository-adapter';
import {
  ForecastService,
  FORECAST_SERVICE,
} from '@/core/application-services/forecast-service';
import {
  LocalizationService,
  LOCALIZATION_SERVICE,
} from '@/core/application-services/localization-service';

const container = new Container();

container
  .bind<WeatherRepository>(WEATHER_REPOSITORY)
  .to(WeatherRepositoryOpenMeteoAdapter)
  .inSingletonScope();

container
  .bind<LocalizationRepository>(LOCALIZATION_REPOSITORY)
  .to(LocationRepositoryAdapter)
  .inSingletonScope();

container
  .bind<ForecastService>(FORECAST_SERVICE)
  .to(ForecastService)
  .inSingletonScope();

container
  .bind<LocalizationService>(LOCALIZATION_SERVICE)
  .to(LocalizationService)
  .inSingletonScope();

export { container };
