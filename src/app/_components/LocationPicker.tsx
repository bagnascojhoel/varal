'use client';

import { useCep } from '@/app/_lib/use-cep-hook';
import { useGps } from '@/app/_lib/use-gps-hook';
import { useWashers } from '@/app/_lib/use-washers-hook';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LocationPicker() {
  const t = useTranslations('LocationPicker');
  const tErrors = useTranslations('Errors');
  const router = useRouter();
  const washers = useWashers();
  const onResolved = (lat: string, lon: string) =>
    router.push(`/?lat=${lat}&lon=${lon}`);
  const gps = useGps(washers, onResolved);
  const cep = useCep(washers, onResolved);
  const savedLocation =
    washers.state.status === 'success'
      ? {
          lat: String(washers.state.data.lat),
          lon: String(washers.state.data.lon),
        }
      : null;
  const isLoading = gps.loading() || cep.loading();

  function handleClose() {
    if (!savedLocation) return;
    router.push(`/?lat=${savedLocation.lat}&lon=${savedLocation.lon}`);
  }

  return (
    <>
      <div
        className="hidden lg:block lg:fixed lg:inset-0 lg:z-40 lg:bg-[rgba(5,7,20,0.6)] lg:[backdrop-filter:blur(4px)] day:lg:bg-[rgba(180,210,240,0.55)]"
        aria-hidden
      />
      <div
        className="lg:fixed lg:z-50 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[min(90vw,24rem)] bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] rounded-3xl p-8 flex flex-col gap-6 relative"
        role="dialog"
        aria-label={t('dialogLabel')}
      >
        <button
          onClick={handleClose}
          disabled={!savedLocation}
          aria-label={t('close')}
          className="text-white/[32%] day:text-ink/[35%] absolute top-0 right-0 inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          ✕
        </button>

        <div className="text-center">
          <p className="text-white/[88%] day:text-ink/[88%] text-2xl font-light mb-2">
            {t('whereAreYou')}
          </p>
          <p className="text-white/[42%] day:text-ink/[55%] text-sm font-light">
            {t('locationNeeded')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={gps.request}
            disabled={isLoading}
            className="text-white/[82%] day:text-ink/[82%] bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] px-6 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {gps.loading() ? t('detecting') : t('shareLocation')}
          </button>
          {gps.error && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {gps.error && tErrors(gps.error.messageKey)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <hr className="border-0 border-t border-[rgba(255,255,255,0.08)] day:border-[rgba(18,48,100,0.1)] flex-1" />
          <span className="text-white/[32%] day:text-ink/[45%] text-xs font-light">
            {t('or')}
          </span>
          <hr className="border-0 border-t border-[rgba(255,255,255,0.08)] day:border-[rgba(18,48,100,0.1)] flex-1" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            cep.submit();
          }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex gap-2 w-full">
            <input
              type="text"
              inputMode="numeric"
              maxLength={9}
              placeholder={t('cepPlaceholder')}
              value={cep.value}
              onChange={(e) => cep.onChange(e.target.value)}
              disabled={isLoading}
              className="text-white/[82%] day:text-ink/[82%] placeholder:text-white/[28%] day:placeholder:text-ink/[35%] bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] flex-1 px-4 py-3 min-h-[44px] rounded-2xl font-light text-sm text-center bg-transparent outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !cep.isValid}
              className="text-white/[82%] day:text-ink/[82%] bg-[rgba(255,255,255,0.07)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.12)] day:bg-[rgba(255,255,255,0.42)] day:border-[rgba(255,255,255,0.72)] px-5 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {cep.loading() ? t('searching') : t('search')}
            </button>
          </div>
          {cep.error && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {cep.error && tErrors(cep.error.messageKey)}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
