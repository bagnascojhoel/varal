'use client';

import { useEffect, useRef, useState } from 'react';
import type { WashersHook, WasherLocation } from './use-washers-hook';
import type { AsyncHook, AsyncState } from './async-hook';
import type { UiError } from './ui-error';

export interface CepHook extends AsyncHook<WasherLocation> {
  value: string;
  isValid: boolean;
  onChange(raw: string): void;
  submit(): void;
}

function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

function isValidCep(formatted: string): boolean {
  return /^\d{5}-\d{3}$/.test(formatted);
}

export function useCep(
  washers: WashersHook,
  onResolved: (lat: string, lon: string) => void,
): CepHook {
  const [value, setValue] = useState('');
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

  function submit(): void {
    if (!isValidCep(value)) return;
    setAsyncState({ status: 'loading' });
    setError(undefined);
    pendingRef.current = true;
    washers.setupByCep(value.replace('-', ''));
  }

  return {
    value,
    loading: () => asyncState.status === 'loading',
    error,
    state: asyncState,
    isValid: isValidCep(value),
    onChange: (raw) => setValue(formatCep(raw)),
    submit,
  };
}
