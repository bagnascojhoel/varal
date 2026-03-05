import {
  FORECAST_SERVICE,
  ForecastApplicationService,
} from '@/core/application-services/forecast-application-service';
import {
  WASHER_APPLICATION_SERVICE,
  WasherApplicationService,
} from '@/core/application-services/washer-application-service';
import {
  DryingSessionApplicationService,
  START_SESSION_APPLICATION_SERVICE,
} from '@/core/application-services/drying-session-application-service';
import {
  LOCALITY_REPOSITORY,
  type LocalityRepository,
} from '@/core/domain/localization-repository';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '@/core/domain/weather-repository';
import {
  DRYING_SESSION_REPOSITORY,
  type DryingSessionRepository,
} from '@/core/domain/drying-session-repository';
import {
  BigDataCloudClientService,
  BIGDATACLOUD_CLIENT_SERVICE,
  BIGDATACLOUD_REST_CLIENT,
  NOMINATIM_REST_CLIENT,
} from '@/core/infrastructure/rest/bigdatacloud-client-service';
import { LocalityRepositoryAdapter } from '@/core/infrastructure/rest/locality-repository-adapter';
import { RestClientService } from '@/core/infrastructure/rest/rest-client-service';
import {
  ViacepClientService,
  VIACEP_CLIENT_SERVICE,
  VIACEP_REST_CLIENT,
} from '@/core/infrastructure/rest/viacep-client-service';
import {
  OPENMETEO_REST_CLIENT,
  WeatherRepositoryOpenMeteoAdapter,
} from '@/core/infrastructure/rest/weather-repository-open-meteo-adapter';
import {
  getPrismaClient,
  PRISMA_CLIENT,
} from '@/core/infrastructure/prisma/prisma-client';
import { DryingSessionRepositoryPrismaAdapter } from '@/core/infrastructure/prisma/drying-session-repository-prisma-adapter';
import { Container } from 'inversify';
import 'reflect-metadata';

const container = new Container();

container
  .bind(BIGDATACLOUD_REST_CLIENT)
  .toConstantValue(
    new RestClientService('BigDataCloud', process.env.BIGDATACLOUD_HOST!),
  );

container
  .bind(NOMINATIM_REST_CLIENT)
  .toConstantValue(
    new RestClientService('Nominatim', process.env.NOMINATIM_HOST!),
  );

container
  .bind(VIACEP_REST_CLIENT)
  .toConstantValue(new RestClientService('ViaCEP', process.env.VIACEP_HOST!));

container
  .bind(OPENMETEO_REST_CLIENT)
  .toConstantValue(
    new RestClientService('Open-Meteo', process.env.OPENMETEO_HOST!),
  );

container
  .bind(BIGDATACLOUD_CLIENT_SERVICE)
  .to(BigDataCloudClientService)
  .inSingletonScope();

container
  .bind(VIACEP_CLIENT_SERVICE)
  .to(ViacepClientService)
  .inSingletonScope();

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

// Drying Sessions
container.bind(PRISMA_CLIENT).toConstantValue(getPrismaClient());

container
  .bind<DryingSessionRepository>(DRYING_SESSION_REPOSITORY)
  .to(DryingSessionRepositoryPrismaAdapter)
  .inSingletonScope();

container
  .bind<DryingSessionApplicationService>(START_SESSION_APPLICATION_SERVICE)
  .to(DryingSessionApplicationService)
  .inSingletonScope();

export { container };
