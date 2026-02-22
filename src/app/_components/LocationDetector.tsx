'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LocationDetector() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function detect() {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        router.push(`/?lat=${lat}&lon=${lon}`);
      },
      () => {
        setLoading(false);
        setError(
          'Não foi possível obter sua localização. Permita o acesso e tente novamente.',
        );
      },
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={detect}
        disabled={loading}
        className="glass px-6 py-3 rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ color: 'rgba(255,255,255,0.82)' }}
      >
        {loading ? 'Detectando…' : '📍 Compartilhar localização'}
      </button>
      {error && (
        <p
          className="text-xs text-center max-w-xs"
          style={{ color: 'rgba(252,165,165,0.9)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
