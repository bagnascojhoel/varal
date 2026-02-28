'use client';

import { useGps } from '@/app/_lib/use-gps-hook';
import { useWashers } from '@/app/_lib/use-washers-hook';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LocationDetector() {
  const t = useTranslations('LocationPicker');
  const tErrors = useTranslations('Errors');
  const router = useRouter();
  const washers = useWashers();
  const gps = useGps(washers, (lat, lon) => {
    router.push(`/?lat=${lat}&lon=${lon}`);
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={gps.request}
        disabled={gps.loading()}
        className="text-white/[82%] day:text-ink/[82%] bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] px-6 py-3 rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {gps.loading() ? t('detecting') : t('shareLocation')}
      </button>
      {gps.error && (
        <p className="text-red-300/90 text-xs text-center max-w-xs">
          {gps.error && tErrors(gps.error.messageKey)}
        </p>
      )}
    </div>
  );
}
