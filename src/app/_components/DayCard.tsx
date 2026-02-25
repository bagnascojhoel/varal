import type { ForecastDayDto } from '@/core/application-services/forecast-application-service';
import type { TimeState } from '@/core/domain/time-state';
import { determineBarState } from '@/core/domain/wash-decision';
import type { WeatherState } from '@/core/domain/weather-state';
import type { WindowState } from '@/core/domain/window-state';
import { DateTime } from 'luxon';

const ACCENT_CLASSES = [
  'accent-red',
  'accent-amber',
  'accent-sky',
  'accent-indigo',
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
  return `t-bar t-${determineBarState(prob)}`;
}

function barHeight(prob: number): number {
  return Math.max(2, Math.round(((100 - prob) / 100) * 44));
}

function WindowPill({ state }: { state: WindowState }) {
  if (state === 'clear') {
    return <span className="pill pill-clear">Livre ✓</span>;
  }
  if (state === 'unsure') {
    return <span className="pill pill-unsure">Incerto</span>;
  }
  return <span className="pill pill-rain">Chuva</span>;
}

interface DayCardProps {
  forecast: ForecastDayDto;
  label: string;
  cardIndex: number;
  isToday: boolean;
  timeState: TimeState;
  dayEnded: boolean;
  /** current hour on the server — only used for today card */
  currentHour: number;
  /** current minutes on the server — only used for today card */
  currentMinutes: number;
}

export function DayCard({
  forecast,
  label,
  cardIndex,
  isToday,
  timeState,
  dayEnded,
  currentHour,
  currentMinutes,
}: DayCardProps) {
  const isDay3 = cardIndex === 3;
  const accent = ACCENT_CLASSES[cardIndex] ?? 'accent-indigo';
  const weekday = getWeekday(forecast.date);

  // Past bar threshold: all bars grey when day ended, hour-based in afternoon, none otherwise
  const pastThreshold = dayEnded
    ? 21
    : timeState === 'afternoon'
      ? currentHour
      : -1;

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

  const cardClasses = [
    'card',
    'glass',
    'rounded-2xl',
    'flex',
    'flex-col',
    'overflow-hidden',
    isDay3 ? 'card-day3' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const todayEnded = isToday && dayEnded;

  return (
    <article
      className={cardClasses}
      data-card-index={cardIndex}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      style={!forecast.isStillUsableNow ? { opacity: 0.38 } : undefined}
    >
      <div className={`${accent} h-[3px] shrink-0`} />

      <div className="flex flex-col flex-1 p-5 pb-4">
        {/* Card header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="label-day">{label}</p>
            <p className="label-weekday">{weekday}</p>
            {todayEnded && (
              <span className="today-encerrado" aria-label="dia encerrado">
                encerrado
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
          <span className="timeline-caption">chance de secar ao natural</span>
          <div className="timeline-bars">
            {forecast.hourlyPrecipitationProbability
              .slice(6, 21)
              .map((prob, i) => {
                const barHour = 6 + i;
                const isPast = isToday && barHour < pastThreshold;
                return (
                  <div
                    key={barHour}
                    className={`${barClass(prob)}${isPast ? ' t-bar--past' : ''}`}
                    style={{ height: `${barHeight(prob)}px` }}
                    title={`${barHour}h · ${100 - prob}%`}
                    data-bar-hour={isToday ? barHour : undefined}
                  />
                );
              })}
            {nowMarkerStyle && (
              <div
                className="timeline-now-marker"
                style={nowMarkerStyle}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="timeline-labels">
            <span className="timeline-label">6h</span>
            <span className="timeline-label">13h</span>
            <span className="timeline-label">20h</span>
          </div>
        </div>

        <hr className="section-divider mt-auto mb-3" />
        <p className="windows-label">Janelas do dia</p>

        <div className="flex flex-col gap-2">
          {/* Morning window — hidden at afternoon/night on today card via CSS */}
          <div
            className={`glass-inner rounded-xl px-3 py-2 flex items-center justify-between${isToday ? ' window-morning' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem' }} aria-hidden="true">
                🌅
              </span>
              <span className="window-label">Manhã</span>
            </div>
            <WindowPill state={forecast.morningWindow} />
          </div>

          {/* Afternoon window */}
          <div className="glass-inner rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem' }} aria-hidden="true">
                🌆
              </span>
              <span className="window-label">Tarde</span>
            </div>
            <WindowPill state={forecast.afternoonWindow} />
          </div>
        </div>
      </div>
    </article>
  );
}
