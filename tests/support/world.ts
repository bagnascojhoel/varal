import { World } from '@cucumber/cucumber';
import { Container } from 'inversify';
import 'reflect-metadata';
import {
  FORECAST_SERVICE,
  ForecastApplicationService,
  type ForecastPageResponse,
} from '../../src/core/application-services/forecast-application-service';
import {
  WASHER_APPLICATION_SERVICE,
  WasherApplicationService,
} from '../../src/core/application-services/washer-application-service';
import {
  START_SESSION_APPLICATION_SERVICE,
  DryingSessionApplicationService,
} from '../../src/core/application-services/drying-session-application-service';
import {
  LOCALITY_REPOSITORY,
  type LocalityRepository,
} from '../../src/core/domain/localization-repository';
import {
  DRYING_SESSION_REPOSITORY,
  type DryingSessionRepository,
} from '../../src/core/domain/drying-session-repository';
import type { Washer } from '../../src/core/domain/washer';
import {
  WEATHER_REPOSITORY,
  type WeatherRepository,
} from '../../src/core/domain/weather-repository';
import {
  BIGDATACLOUD_CLIENT_SERVICE,
  BIGDATACLOUD_REST_CLIENT,
  BigDataCloudClientService,
  NOMINATIM_REST_CLIENT,
} from '../../src/core/infrastructure/rest/bigdatacloud-client-service';
import { LocalityRepositoryAdapter } from '../../src/core/infrastructure/rest/locality-repository-adapter';
import {
  VIACEP_CLIENT_SERVICE,
  VIACEP_REST_CLIENT,
  ViacepClientService,
} from '../../src/core/infrastructure/rest/viacep-client-service';
import {
  OPENMETEO_REST_CLIENT,
  WeatherRepositoryOpenMeteoAdapter,
} from '../../src/core/infrastructure/rest/weather-repository-open-meteo-adapter';
import { MockedRestClientService } from './mocked-rest-client-service';
import { InMemoryDryingSessionRepository } from './in-memory-drying-session-repository';
import { BigDataCloudMocker } from './mockers/bigdatacloud-mocker';
import { NominatimMocker } from './mockers/nominatim-mocker';
import { OpenMeteoMocker } from './mockers/open-meteo-mocker';
import { ViacepMocker } from './mockers/viacep-mocker';

export class TestWorld extends World {
  forecastService!: ForecastApplicationService;
  washerService!: WasherApplicationService;
  dryingSessionService!: DryingSessionApplicationService;
  dryingSessionRepository!: InMemoryDryingSessionRepository;
  washer: Washer | null = null;
  forecast: ForecastPageResponse | null = null;

  bigDataCloudMocker!: BigDataCloudMocker;
  nominatimMocker!: NominatimMocker;
  viacepMocker!: ViacepMocker;
  openMeteoMocker!: OpenMeteoMocker;

  setupContainer(): void {
    const bigDataCloudMock = new MockedRestClientService();
    const nominatimMock = new MockedRestClientService();
    const viacepMock = new MockedRestClientService();
    const openMeteoMock = new MockedRestClientService();
    const dryingSessionRepository = new InMemoryDryingSessionRepository();

    this.bigDataCloudMocker = new BigDataCloudMocker(bigDataCloudMock);
    this.nominatimMocker = new NominatimMocker(nominatimMock);
    this.viacepMocker = new ViacepMocker(viacepMock);
    this.openMeteoMocker = new OpenMeteoMocker(openMeteoMock);
    this.dryingSessionRepository = dryingSessionRepository;

    const container = new Container();
    container.bind(BIGDATACLOUD_REST_CLIENT).toConstantValue(bigDataCloudMock);
    container.bind(NOMINATIM_REST_CLIENT).toConstantValue(nominatimMock);
    container.bind(VIACEP_REST_CLIENT).toConstantValue(viacepMock);
    container.bind(OPENMETEO_REST_CLIENT).toConstantValue(openMeteoMock);
    container.bind(BIGDATACLOUD_CLIENT_SERVICE).to(BigDataCloudClientService);
    container.bind(VIACEP_CLIENT_SERVICE).to(ViacepClientService);
    container
      .bind<WeatherRepository>(WEATHER_REPOSITORY)
      .to(WeatherRepositoryOpenMeteoAdapter);
    container
      .bind<LocalityRepository>(LOCALITY_REPOSITORY)
      .to(LocalityRepositoryAdapter);
    container
      .bind<ForecastApplicationService>(FORECAST_SERVICE)
      .to(ForecastApplicationService);
    container
      .bind<WasherApplicationService>(WASHER_APPLICATION_SERVICE)
      .to(WasherApplicationService);
    container
      .bind<DryingSessionRepository>(DRYING_SESSION_REPOSITORY)
      .toConstantValue(dryingSessionRepository);
    container
      .bind<DryingSessionApplicationService>(START_SESSION_APPLICATION_SERVICE)
      .to(DryingSessionApplicationService);

    this.forecastService =
      container.get<ForecastApplicationService>(FORECAST_SERVICE);
    this.washerService = container.get<WasherApplicationService>(
      WASHER_APPLICATION_SERVICE,
    );
    this.dryingSessionService = container.get<DryingSessionApplicationService>(
      START_SESSION_APPLICATION_SERVICE,
    );
  }

  reset(): void {
    this.washer = null;
    this.forecast = null;
  }
}
