'use client';

import { useRouter } from 'next/navigation';
import { useLocality } from '@/app/_lib/locality-hook';

export function LocationDetector() {
  const router = useRouter();
  const { gps } = useLocality((lat, lon) => {
    router.push(`/?lat=${lat}&lon=${lon}`);
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={gps.request}
        disabled={gps.loading}
        className="glass px-6 py-3 rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ color: 'rgba(255,255,255,0.82)' }}
      >
        {gps.loading ? 'Detectando…' : '📍 Compartilhar localização'}
      </button>
      {gps.error && (
        <p
          className="text-xs text-center max-w-xs"
          style={{ color: 'rgba(252,165,165,0.9)' }}
        >
          {gps.error}
        </p>
      )}
    </div>
  );
}
