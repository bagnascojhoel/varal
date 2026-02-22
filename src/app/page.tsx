import Link from 'next/link';
import { DayCard } from '@/app/_components/DayCard';
import { LocationPicker } from '@/app/_components/LocationPicker';
import { LiveClock } from '@/app/_components/LiveClock';
import { CarouselTrack } from '@/app/_components/CarouselTrack';
import { container } from '@/core/ContainerConfig';
import {
  ForecastService,
  FORECAST_SERVICE,
} from '@/core/application-services/forecast-service';

const DAY_LABELS = ['Hoje', 'Amanhã', 'Depois de amanhã', 'Em 3 dias'] as const;

interface PageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lon = params.lon ? parseFloat(params.lon) : null;

  const hasLocation =
    lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon);

  return (
    <>
      {/* Background — siblings of content so z-index layering works correctly */}
      <div className="weather-bg" aria-hidden="true" />
      <div className="weather-scrim" aria-hidden="true" />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 1.25rem 0.75rem',
          maxWidth: '64rem',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <header className="app-header">
          <div>
            <h1 className="header-app-title">Varal</h1>
          </div>
          <LiveClock />
        </header>

        {hasLocation ? (
          <ForecastContent lat={lat!} lon={lon!} />
        ) : (
          <LocationPrompt />
        )}

        <footer
          style={{
            marginTop: '0.65rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p className="footer-text">
            Precipitação via{' '}
            <a href="https://open-meteo.com" className="footer-link">
              Open-Meteo
            </a>
          </p>
          <p className="footer-text">Atualizado agora</p>
        </footer>
      </div>
    </>
  );
}

async function ForecastContent({ lat, lon }: { lat: number; lon: number }) {
  let data;
  try {
    data = await container
      .get<ForecastService>(FORECAST_SERVICE)
      .getForecast(lat, lon);
  } catch {
    return <ErrorState />;
  }

  const {
    forecasts,
    cityName,
    timeState,
    dayEnded,
    currentHour,
    currentMinutes,
  } = data;

  return (
    <>
      {cityName && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p className="header-subtitle">{cityName}</p>
          <Link
            href="/"
            title="Alterar localização"
            aria-label="Alterar localização"
            className="text-white/[32%] day:text-ink/[45%] inline-flex items-center justify-center text-sm -ml-2"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            ✎
          </Link>
        </div>
      )}
      <CarouselTrack dayEnded={dayEnded}>
        {forecasts.map((forecast, i) => (
          <DayCard
            key={forecast.date}
            forecast={forecast}
            label={DAY_LABELS[i] ?? `Em ${i} dias`}
            cardIndex={i}
            isToday={i === 0}
            timeState={timeState}
            dayEnded={dayEnded}
            currentHour={currentHour}
            currentMinutes={currentMinutes}
          />
        ))}
      </CarouselTrack>
    </>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <span className="text-5xl">⚠️</span>
      <p
        className="text-lg font-light text-center"
        style={{ color: 'rgba(255,255,255,0.7)' }}
      >
        Serviço de previsão indisponível
      </p>
      <p
        className="text-sm text-center"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Tente novamente mais tarde.
      </p>
    </div>
  );
}

function LocationPrompt() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <LocationPicker />
    </div>
  );
}
