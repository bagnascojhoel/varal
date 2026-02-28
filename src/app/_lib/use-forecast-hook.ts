'use client';

import { useEffect, useState } from 'react';
import type { ForecastPageResponse } from '@/core/application-services/forecast-application-service';
import type { AsyncHook, AsyncState } from './async-hook';

export interface ForecastHook extends AsyncHook<ForecastPageResponse> {
  lastUpdated: Date | null;
}

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useForecast(
  lat: number | null,
  lon: number | null,
): ForecastHook {
  const [state, setState] = useState<AsyncState<ForecastPageResponse>>({
    status: 'idle',
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    setRefreshTick(0);
    const interval = setInterval(() => {
      setRefreshTick((tick) => tick + 1);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [lat, lon]);

  useEffect(() => {
    if (lat === null || lon === null) {
      setState({ status: 'idle' });
      return;
    }

    setState((prev) =>
      prev.status === 'success' ? prev : { status: 'loading' },
    );

    const controller = new AbortController();

    fetch(`/api/forecast?latitude=${lat}&longitude=${lon}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<ForecastPageResponse>;
      })
      .then((data) => {
        setState({ status: 'success', data });
        setLastUpdated(new Date());
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name !== 'AbortError')
          setState({ status: 'error' });
      });

    return () => controller.abort();
  }, [lat, lon, refreshTick]);

  return {
    loading: () => state.status === 'loading',
    error: undefined,
    state,
    lastUpdated,
  };
}
