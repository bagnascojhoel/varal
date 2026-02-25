'use client';

import { useRouter } from 'next/navigation';
import { useLocality } from '@/app/_lib/locality-hook';

export function LocationPicker() {
  const router = useRouter();
  const { savedLocation, isLoading, gps, cep } = useLocality((lat, lon) => {
    router.push(`/?lat=${lat}&lon=${lon}`);
  });

  function handleClose() {
    if (!savedLocation) return;
    router.push(`/?lat=${savedLocation.lat}&lon=${savedLocation.lon}`);
  }

  return (
    <>
      <div className="location-modal-backdrop" aria-hidden />
      <div
        className="location-modal-dialog glass rounded-3xl p-8 flex flex-col gap-6 relative"
        role="dialog"
        aria-label="Selecionar localização"
      >
        <button
          onClick={handleClose}
          disabled={!savedLocation}
          aria-label="Fechar"
          className="text-white/[32%] day:text-ink/[35%] absolute top-0 right-0 inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          ✕
        </button>

        <div className="text-center">
          <p className="text-white/[88%] day:text-ink/[88%] text-2xl font-light mb-2">
            Onde você está?
          </p>
          <p className="text-white/[42%] day:text-ink/[55%] text-sm font-light">
            Precisamos da sua localização para verificar a previsão.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={gps.request}
            disabled={isLoading}
            className="text-white/[82%] day:text-ink/[82%] glass px-6 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {gps.loading ? 'Detectando…' : '📍 Compartilhar localização'}
          </button>
          {gps.error && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {gps.error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <hr className="section-divider flex-1" />
          <span className="text-white/[32%] day:text-ink/[45%] text-xs font-light">
            ou
          </span>
          <hr className="section-divider flex-1" />
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
              placeholder="00000-000"
              value={cep.value}
              onChange={(e) => cep.onChange(e.target.value)}
              disabled={isLoading}
              className="text-white/[82%] day:text-ink/[82%] placeholder:text-white/[28%] day:placeholder:text-ink/[35%] glass flex-1 px-4 py-3 min-h-[44px] rounded-2xl font-light text-sm text-center bg-transparent outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !cep.isValid}
              className="text-white/[82%] day:text-ink/[82%] glass px-5 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {cep.loading ? '…' : 'Buscar'}
            </button>
          </div>
          {cep.error && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {cep.error}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
