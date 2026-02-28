'use client';

import { useEffect, useRef, useState } from 'react';
import type { WashersHook, WasherLocation } from './use-washers-hook';
import type { AsyncHook, AsyncState } from './async-hook';
import type { UiError } from './ui-error';

export interface GpsHook extends AsyncHook<WasherLocation> {
  request(): void;
}

export function useGps(
  washers: WashersHook,
  onResolved: (lat: string, lon: string) => void,
): GpsHook {
  const [asyncState, setAsyncState] = useState<AsyncState<WasherLocation>>({
    status: 'idle',
  });
  const [error, setError] = useState<UiError | undefined>(undefined);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current || washers.loading()) return;
    pendingRef.current = false;

    if (washers.error) {
      setAsyncState({ status: 'error' });
      setError(washers.error);
      return;
    }
    if (washers.state.status === 'success') {
      const data = washers.state.data;
      setAsyncState({ status: 'success', data });
      onResolved(String(data.lat), String(data.lon));
    }
  }, [washers.state, washers.error]);

  function request(): void {
    if (!navigator.geolocation) {
      setAsyncState({ status: 'error' });
      setError({ messageKey: 'gpsNotSupported' });
      return;
    }

    setAsyncState({ status: 'loading' });
    setError(undefined);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        pendingRef.current = true;
        washers.setupByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {
        setAsyncState({ status: 'error' });
        setError({ messageKey: 'gpsPermissionDenied' });
      },
    );
  }

  return {
    loading: () => asyncState.status === 'loading',
    error,
    state: asyncState,
    request,
  };
}
