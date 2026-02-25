'use client';

import type { Timezone } from '@/core/domain/time-zone';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

interface LiveClockProps {
  timezone?: Timezone;
}

export function LiveClock({ timezone }: LiveClockProps) {
  const [time, setTime] = useState<string>('');
  const [isoTime, setIsoTime] = useState<string>('');

  useEffect(() => {
    if (!timezone) return;

    const tick = () => {
      const now = DateTime.now().setZone(timezone);
      setTime(now.toFormat('HH:mm'));
      setIsoTime(now.toISO() ?? '');
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <time
      className="header-time hidden md:block"
      dateTime={isoTime}
      suppressHydrationWarning
    >
      {time || '--:--'}
    </time>
  );
}
