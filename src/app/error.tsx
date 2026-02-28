'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error('[varal] unhandled client exception', error);
  }, [error]);

  return (
    <>
      <div className="weather-bg" aria-hidden="true" />
      <div className="weather-scrim" aria-hidden="true" />
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <p className="text-lg font-light text-white/[88%] day:text-ink/[88%] text-center">
          {t('title')}
        </p>
        <p className="text-sm font-light text-white/[52%] day:text-ink/[62%] text-center">
          {error.digest ? t('digest', { digest: error.digest }) : t('tryAgainLater')}
        </p>
        <button
          onClick={reset}
          className="glass text-white/[82%] day:text-ink/[82%] px-6 py-3 rounded-2xl font-light text-sm cursor-pointer transition-opacity hover:opacity-80 mt-2"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {t('retry')}
        </button>
      </div>
    </>
  );
}
