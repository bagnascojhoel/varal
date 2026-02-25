import {
  FORECAST_SERVICE,
  ForecastApplicationService,
} from '@/core/application-services/forecast-application-service';
import {
  WASHER_APPLICATION_SERVICE,
  WasherApplicationService,
} from '@/core/application-services/washer-application-service';
import {
  LOCALITY_REPOSITORY,
  type LocalityRepository,
} from '@/core/domain/localization-repository';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '@/core/domain/weather-repository';
import { LocalityRepositoryAdapter } from '@/core/infrastructure/rest/locality-repository-adapter';
import { WeatherRepositoryOpenMeteoAdapter } from '@/core/infrastructure/rest/weather-repository-open-meteo-adapter';
import { Container } from 'inversify';
import 'reflect-metadata';

const container = new Container();

container
  .bind<WeatherRepository>(WEATHER_REPOSITORY)
  .to(WeatherRepositoryOpenMeteoAdapter)
  .inSingletonScope();

container
  .bind<LocalityRepository>(LOCALITY_REPOSITORY)
  .to(LocalityRepositoryAdapter)
  .inSingletonScope();

container
  .bind<ForecastApplicationService>(FORECAST_SERVICE)
  .to(ForecastApplicationService)
  .inSingletonScope();

container
  .bind<WasherApplicationService>(WASHER_APPLICATION_SERVICE)
  .to(WasherApplicationService)
  .inSingletonScope();

export { container };
