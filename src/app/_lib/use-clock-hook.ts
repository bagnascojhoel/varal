'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import type { Timezone } from '@/core/domain/time-zone';

const DEFAULT_DAY_END_HOUR = 24;

export function useClock(
  timezone: Timezone,
  options?: { dayEndHour?: number },
): { hour: number; minutes: number; hasDayEnded: () => boolean } {
  const dayEndHour = options?.dayEndHour ?? DEFAULT_DAY_END_HOUR;

  const getTime = () => {
    const dt = DateTime.now().setZone(timezone);
    return { hour: dt.hour, minutes: dt.minute };
  };

  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(id);
  }, [timezone]);

  const hasDayEnded = () => time.hour >= dayEndHour;

  return { ...time, hasDayEnded };
}
