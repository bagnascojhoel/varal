'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'saved_location';

export interface SavedLocation {
  lat: string;
  lon: string;
}

function persistLocation(lat: string, lon: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lon }));
}

function readPersistedLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
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

interface GpsState {
  loading: boolean;
  error: string | null;
  request: () => void;
}

interface CepState {
  value: string;
  loading: boolean;
  error: string | null;
  isValid: boolean;
  onChange: (raw: string) => void;
  submit: () => Promise<void>;
}

export interface LocalityHook {
  savedLocation: SavedLocation | null;
  isLoading: boolean;
  gps: GpsState;
  cep: CepState;
}

export function useLocality(
  onResolved: (lat: string, lon: string) => void,
): LocalityHook {
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(
    null,
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [cepValue, setCepValue] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  useEffect(() => {
    setSavedLocation(readPersistedLocation());
  }, []);

  function handleGpsRequest(): void {
    if (!navigator.geolocation) {
      setGpsError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        persistLocation(lat, lon);
        onResolved(lat, lon);
      },
      () => {
        setGpsLoading(false);
        setGpsError(
          'Não foi possível obter sua localização. Permita o acesso e tente novamente.',
        );
      },
    );
  }

  async function handleCepSubmit(): Promise<void> {
    if (!isValidCep(cepValue)) return;

    const digits = cepValue.replace('-', '');
    setCepLoading(true);
    setCepError(null);

    try {
      const res = await fetch('/api/washers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: digits }),
      });
      if (res.status === 404) {
        setCepError('CEP não encontrado.');
        return;
      }
      if (!res.ok) {
        setCepError('Serviço indisponível.');
        return;
      }
      const data = (await res.json()) as { lat: number; lon: number };
      const lat = String(data.lat);
      const lon = String(data.lon);
      persistLocation(lat, lon);
      onResolved(lat, lon);
    } catch {
      setCepError('Serviço indisponível.');
    } finally {
      setCepLoading(false);
    }
  }

  return {
    savedLocation,
    isLoading: gpsLoading || cepLoading,
    gps: {
      loading: gpsLoading,
      error: gpsError,
      request: handleGpsRequest,
    },
    cep: {
      value: cepValue,
      loading: cepLoading,
      error: cepError,
      isValid: isValidCep(cepValue),
      onChange: (raw) => setCepValue(formatCep(raw)),
      submit: handleCepSubmit,
    },
  };
}
