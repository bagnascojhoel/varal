'use client';

import type { ForecastDayDto } from '@/core/application-services/forecast-application-service';
import type { TimeState } from '@/core/domain/time-state';
import type { Timezone } from '@/core/domain/time-zone';
import { determineBarState } from '@/core/domain/wash-decision';
import type { WeatherState } from '@/core/domain/weather-state';
import type { WindowState } from '@/core/domain/window-state';
import { DateTime } from 'luxon';
import { useClock } from '@/app/_lib/use-clock-hook';
import { useTranslations } from 'next-intl';

const ACCENT_CLASSES = [
  'bg-[linear-gradient(90deg,rgba(248,113,113,0.9),rgba(239,68,68,0.15))]',
  'bg-[linear-gradient(90deg,rgba(251,191,36,0.9),rgba(245,158,11,0.15))]',
  'bg-[linear-gradient(90deg,rgba(56,189,248,0.9),rgba(34,211,238,0.15))]',
  'bg-[linear-gradient(90deg,rgba(129,140,248,0.9),rgba(99,102,241,0.15))]',
] as const;

const WEATHER_EMOJI: Record<WeatherState, string> = {
  rainy: '🌧️',
  cloudy: '⛅',
  sunny: '☀️',
};

function getWeekday(dateStr: string): string {
  return DateTime.fromISO(dateStr).setLocale('pt-BR').weekdayLong ?? '';
}

function barClass(prob: number): string {
  const state = determineBarState(prob);
  const base =
    'flex-1 min-w-0 min-h-[2px] rounded-t-[2px] transition-[opacity,background] duration-[150ms] hover:opacity-[0.72]';
  const colors: Record<string, string> = {
    good: 'bg-[rgba(34,197,94,0.65)] day:bg-[rgba(22,163,74,0.5)]',
    warn: 'bg-[rgba(251,191,36,0.65)] day:bg-[rgba(217,119,6,0.5)]',
    bad: 'bg-[rgba(239,68,68,0.65)] day:bg-[rgba(185,28,28,0.45)]',
  };
  return `${base} ${colors[state]}`;
}

function barHeight(prob: number): number {
  return Math.max(2, Math.round(((100 - prob) / 100) * 44));
}

function WindowPill({ state }: { state: WindowState }) {
  const t = useTranslations('DayCard');
  const base =
    'inline-flex items-center text-[0.62rem] px-[0.5rem] py-[0.18rem] rounded-full font-medium whitespace-nowrap shrink-0 sm:text-[0.68rem] sm:px-[0.6rem] sm:py-[0.2rem]';
  if (state === 'clear') {
    return (
      <span
        className={`${base} bg-[rgba(56,189,248,0.15)] text-sky-300 border border-[rgba(56,189,248,0.25)]`}
      >
        {t('windowClear')}
      </span>
    );
  }
  if (state === 'unsure') {
    return (
      <span
        className={`${base} bg-[rgba(255,255,255,0.06)] text-white/[38%] border border-[rgba(255,255,255,0.1)]`}
      >
        {t('windowUnsure')}
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-[rgba(239,68,68,0.15)] text-red-300 border border-[rgba(239,68,68,0.25)]`}
    >
      {t('windowRain')}
    </span>
  );
}

interface DayCardProps {
  forecast: ForecastDayDto;
  label: string;
  cardIndex: number;
  isToday: boolean;
  timeState: TimeState;
  timezone: Timezone;
}

export function DayCard({
  forecast,
  label,
  cardIndex,
  isToday,
  timeState,
  timezone,
}: DayCardProps) {
  const t = useTranslations('DayCard');
  const { hour: currentHour, minutes: currentMinutes } = useClock(timezone);
  const accent = ACCENT_CLASSES[cardIndex] ?? ACCENT_CLASSES[3];
  const weekday = getWeekday(forecast.date);

  const pastThreshold = isToday && timeState === 'afternoon' ? currentHour : -1;

  // Now marker: only for today in afternoon, within 6h–20h range
  let nowMarkerStyle: React.CSSProperties | undefined;
  if (
    isToday &&
    timeState === 'afternoon' &&
    currentHour >= 6 &&
    currentHour <= 20
  ) {
    const fraction = Math.min(
      Math.max((currentHour + currentMinutes / 60 - 6) / 14, 0),
      1,
    );
    nowMarkerStyle = { left: `${fraction * 100}%` };
  }

  const todayEnded = isToday && !forecast.isStillUsableNow;

  return (
    <article
      className="flex-[0_0_min(88vw,320px)] snap-start transition-[transform,opacity] duration-300 ease-in-out bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] rounded-2xl flex flex-col overflow-hidden lg:flex-none lg:hover:-translate-y-[3px]"
      data-card-index={cardIndex}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      style={todayEnded ? { opacity: 0.38 } : undefined}
    >
      <div className={`${accent} h-[3px] shrink-0`} />

      <div className="flex flex-col flex-1 p-5 pb-4">
        {/* Card header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-white/[32%] day:text-ink/[45%] text-[0.6rem] uppercase tracking-[0.18em]">
              {label}
            </p>
            <p className="text-white/[52%] day:text-ink/[62%] text-[0.75rem] font-light mt-[0.15rem]">
              {weekday}
            </p>
            {todayEnded && (
              <span
                className="mt-[0.35rem] text-[0.48rem] uppercase tracking-[0.16em] text-white/[28%] day:text-ink/[32%] border border-[rgba(255,255,255,0.14)] day:border-[rgba(18,48,100,0.14)] rounded-full px-[0.45rem] py-[0.1rem] w-fit"
                aria-label={t('dayEndedAriaLabel')}
              >
                {t('dayEnded')}
              </span>
            )}
          </div>
          <span
            style={{ fontSize: '1.4rem', lineHeight: 1, userSelect: 'none' }}
            aria-hidden="true"
          >
            {WEATHER_EMOJI[forecast.dayWeatherState]}
          </span>
        </div>

        <p className="mb-5 text-xl font-semibold text-left text-white/[52%] day:text-ink/[62%]">
          {forecast.phrase}
        </p>

        {/* Timeline */}
        <div className="mb-5">
          <span className="block text-white/[22%] day:text-ink/[30%] text-[0.5rem] uppercase tracking-[0.15em] mb-[5px]">
            {t('dryingChance')}
          </span>
          <div className="flex items-end gap-[2px] h-12 pb-1 border-b border-[rgba(255,255,255,0.08)] day:border-[rgba(18,48,100,0.1)] relative">
            {forecast.hourlyPrecipitationProbability
              .slice(6, 21)
              .map((prob, i) => {
                const barHour = 6 + i;
                const isPast = isToday && barHour < pastThreshold;
                return (
                  <div
                    key={barHour}
                    className={`${barClass(prob)}${isPast ? ' !bg-[rgba(255,255,255,0.1)] day:!bg-[rgba(18,48,100,0.08)]' : ''}`}
                    style={{ height: `${barHeight(prob)}px` }}
                    title={`${barHour}h · ${100 - prob}%`}
                    data-bar-hour={isToday ? barHour : undefined}
                  />
                );
              })}
            {nowMarkerStyle && (
              <div
                className="absolute top-0 bottom-1 w-[1.5px] bg-[rgba(255,255,255,0.6)] day:bg-[rgba(18,48,100,0.6)] rounded-[1px] pointer-events-none before:content-[''] before:absolute before:top-[-3px] before:left-1/2 before:-translate-x-1/2 before:w-[5px] before:h-[5px] before:bg-[rgba(255,255,255,0.75)] day:before:bg-[rgba(18,48,100,0.75)] before:rounded-full"
                style={nowMarkerStyle}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/[28%] day:text-ink/[32%] text-[0.52rem] tracking-[0.04em]">
              6h
            </span>
            <span className="text-white/[28%] day:text-ink/[32%] text-[0.52rem] tracking-[0.04em]">
              13h
            </span>
            <span className="text-white/[28%] day:text-ink/[32%] text-[0.52rem] tracking-[0.04em]">
              20h
            </span>
          </div>
        </div>

        <hr className="border-0 border-t border-[rgba(255,255,255,0.08)] day:border-[rgba(18,48,100,0.1)] mt-auto mb-3" />
        <p className="text-white/[22%] day:text-ink/[32%] text-[0.55rem] uppercase tracking-[0.2em] mb-2">
          {t('windowsOfDay')}
        </p>

        <div className="flex flex-col gap-2">
          {/* Morning window — hidden at afternoon/night on today card */}
          <div
            className={`bg-[rgba(255,255,255,0.05)] [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)] border border-[rgba(255,255,255,0.08)] day:bg-[rgba(255,255,255,0.38)] day:border-[rgba(255,255,255,0.55)] rounded-xl px-3 py-2 flex items-center justify-between${isToday ? " [html[data-time='afternoon']_&]:hidden [html[data-time='night']_&]:hidden" : ''}`}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem' }} aria-hidden="true">
                🌅
              </span>
              <span className="text-white/[58%] day:text-ink/[68%] text-[0.8rem] font-light">
                {t('morning')}
              </span>
            </div>
            <WindowPill state={forecast.morningWindow} />
          </div>

          {/* Afternoon window */}
          <div className="bg-[rgba(255,255,255,0.05)] [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)] border border-[rgba(255,255,255,0.08)] day:bg-[rgba(255,255,255,0.38)] day:border-[rgba(255,255,255,0.55)] rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem' }} aria-hidden="true">
                🌆
              </span>
              <span className="text-white/[58%] day:text-ink/[68%] text-[0.8rem] font-light">
                {t('afternoon')}
              </span>
            </div>
            <WindowPill state={forecast.afternoonWindow} />
          </div>
        </div>
      </div>
    </article>
  );
}
