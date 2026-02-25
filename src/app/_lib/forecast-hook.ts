'use client';

import { useEffect, useState } from 'react';
import type { ForecastPageResponse } from '@/core/application-services/forecast-application-service';

export type ForecastResult =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ForecastPageResponse }
  | { status: 'error' };

export function useForecast(
  lat: number | null,
  lon: number | null,
): ForecastResult {
  const [result, setResult] = useState<ForecastResult>({ status: 'idle' });

  useEffect(() => {
    if (lat === null || lon === null) {
      setResult({ status: 'idle' });
      return;
    }

    setResult({ status: 'loading' });

    const controller = new AbortController();

    fetch(`/api/forecast?latitude=${lat}&longitude=${lon}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<ForecastPageResponse>;
      })
      .then((data) => setResult({ status: 'success', data }))
      .catch((err) => {
        if (err.name !== 'AbortError') setResult({ status: 'error' });
      });

    return () => controller.abort();
  }, [lat, lon]);

  return result;
}
