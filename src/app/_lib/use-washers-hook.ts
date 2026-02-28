'use client';

import { useState } from 'react';
import { useStorage } from './use-storage-hook';
import type { AsyncHook, AsyncState } from './async-hook';
import type { UiError } from './ui-error';

const WASHER_STORAGE_KEY = 'washer';

export interface WasherLocation {
  lat: number;
  lon: number;
  cityName: string;
  timezone: string;
  countryCode: string;
}

export interface WashersHook extends AsyncHook<WasherLocation> {
  setupByCep(cepDigits: string): Promise<void>;
  setupByCoordinates(lat: number, lon: number): Promise<void>;
}

export function useWashers(): WashersHook {
  const [washer, setWasher] = useStorage<WasherLocation>(WASHER_STORAGE_KEY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UiError | undefined>(undefined);

  const state: AsyncState<WasherLocation> = loading
    ? { status: 'loading' }
    : error
      ? { status: 'error' }
      : washer
        ? { status: 'success', data: washer }
        : { status: 'idle' };

  async function callApi(
    body: { cep: string } | { lat: number; lon: number },
  ): Promise<void> {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch('/api/washers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 404) {
        setError({ messageKey: 'cepNotFound' });
        return;
      }
      if (!res.ok) {
        setError({ messageKey: 'serviceUnavailable' });
        return;
      }
      const data = (await res.json()) as WasherLocation;
      setWasher(data);
    } catch {
      setError({ messageKey: 'serviceUnavailable' });
    } finally {
      setLoading(false);
    }
  }

  return {
    loading: () => loading,
    error,
    state,
    setupByCep: (cepDigits) => callApi({ cep: cepDigits }),
    setupByCoordinates: (lat, lon) => callApi({ lat, lon }),
  };
}
