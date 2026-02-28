'use client';

import { DayCard } from '@/app/_components/DayCard';
import { DaysCarousel } from '@/app/_components/DaysCarousel';
import { LiveClock } from '@/app/_components/LiveClock';
import { LocationPicker } from '@/app/_components/LocationPicker';
import { useForecast } from '@/app/_lib/use-forecast-hook';
import type { ForecastPageResponse } from '@/core/application-services/forecast-application-service';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const t = useTranslations('Page');
  const searchParams = useSearchParams();
  const rawLat = searchParams.get('lat');
  const rawLon = searchParams.get('lon');
  const lat = rawLat ? parseFloat(rawLat) : null;
  const lon = rawLon ? parseFloat(rawLon) : null;
  const hasValidCoords =
    lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon);

  const forecast = useForecast(
    hasValidCoords ? lat : null,
    hasValidCoords ? lon : null,
  );

  return (
    <>
      {/* Background — siblings of content so z-index layering works correctly */}
      <div
        className="fixed inset-0 z-0 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(170deg,#0b0d19_0%,#131726_25%,#1c2033_50%,#20243e_75%,#181b2d_100%)] [html[data-time='morning']_&]:before:bg-[linear-gradient(170deg,#aac8f0_0%,#bed5f5_25%,#cfe4fa_50%,#dceef8_75%,#c5dff5_100%)] [html[data-time='afternoon']_&]:before:bg-[linear-gradient(170deg,#aac8f0_0%,#bed5f5_25%,#cfe4fa_50%,#dceef8_75%,#c5dff5_100%)]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-[rgba(5,7,20,0.45)] [html[data-time='morning']_&]:bg-[rgba(255,255,255,0.12)] [html[data-time='afternoon']_&]:bg-[rgba(255,255,255,0.12)]"
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-svh flex flex-col px-5 pt-5 pb-3 max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end pb-[0.85rem]">
          <div>
            <h1 className="text-[1.1rem] font-light tracking-[-0.01em] leading-[1.2] text-white/[90%] day:text-ink/[88%]">
              Varal
            </h1>
          </div>
          <LiveClock
            timezone={
              forecast.state.status === 'success'
                ? forecast.state.data.timezone
                : undefined
            }
          />
        </header>

        {forecast.state.status === 'error' ? (
          <ErrorState />
        ) : forecast.state.status === 'success' ? (
          <ForecastContent data={forecast.state.data} />
        ) : forecast.state.status === 'idle' ? (
          <LocationPrompt />
        ) : null}

        <footer className="mt-[0.65rem] flex justify-between items-center">
          <p className="text-white/[18%] day:text-ink/[30%] text-[0.65rem]">
            {t('precipitationVia')}{' '}
            <a
              href="https://open-meteo.com"
              className="underline underline-offset-2 opacity-70 hover:opacity-100"
            >
              Open-Meteo
            </a>
          </p>
          {forecast.lastUpdated && (
            <p className="text-white/[18%] day:text-ink/[30%] text-[0.65rem]">
              {t('updatedAt')}{' '}
              {forecast.lastUpdated.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </footer>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function ForecastContent({ data }: { data: ForecastPageResponse }) {
  const t = useTranslations('Page');
  const { forecasts, cityName, timeState, dayEnded, timezone } = data;

  const dayLabelKeys = dayEnded
    ? (['tomorrow', 'dayAfterTomorrow', 'in3Days', 'in4Days'] as const)
    : (['today', 'tomorrow', 'dayAfterTomorrow', 'in3Days'] as const);

  function getDayLabel(i: number): string {
    const key = dayLabelKeys[i];
    return key
      ? t(`dayLabels.${key}`)
      : t('dayLabels.inNDays', { n: i + (dayEnded ? 1 : 0) });
  }

  return (
    <>
      {cityName && (
        <div className="flex items-center">
          <p className="text-white/[32%] day:text-ink/[45%] text-[0.75rem] font-light tracking-[0.04em] mt-[0.2rem]">
            {cityName}
          </p>
          <Link
            href="/"
            title={t('changeLocation')}
            aria-label={t('changeLocation')}
            className="text-white/[32%] day:text-ink/[45%] inline-flex items-center justify-center text-sm -ml-2"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            ✎
          </Link>
        </div>
      )}
      <DaysCarousel dayEnded={dayEnded}>
        {forecasts.map((forecast, i) => (
          <DayCard
            key={forecast.date}
            forecast={forecast}
            label={getDayLabel(i)}
            cardIndex={i}
            isToday={i === 0 && !dayEnded}
            timeState={timeState}
            timezone={timezone}
          />
        ))}
      </DaysCarousel>
    </>
  );
}

function ErrorState() {
  const t = useTranslations('Errors');
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <span className="text-5xl">⚠️</span>
      <p
        className="text-lg font-light text-center"
        style={{ color: 'rgba(255,255,255,0.7)' }}
      >
        {t('forecastUnavailable')}
      </p>
      <p
        className="text-sm text-center"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        {t('tryAgainLater')}
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
