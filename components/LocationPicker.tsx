"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

function isValidCep(formatted: string): boolean {
  return /^\d{5}-\d{3}$/.test(formatted);
}

export function LocationPicker() {
  const router = useRouter();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [cepValue, setCepValue] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const isLoading = gpsLoading || cepLoading;

  function handleGps() {
    if (!navigator.geolocation) {
      setGpsError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        router.push(`/?lat=${lat}&lon=${lon}`);
      },
      () => {
        setGpsLoading(false);
        setGpsError("Não foi possível obter sua localização. Permita o acesso e tente novamente.");
      }
    );
  }

  async function handleCepSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCep(cepValue)) return;

    const digits = cepValue.replace("-", "");
    setCepLoading(true);
    setCepError(null);

    try {
      const res = await fetch(`/api/cep?cep=${digits}`);
      if (res.status === 404) {
        setCepError("CEP não encontrado.");
        return;
      }
      if (!res.ok) {
        setCepError("Serviço indisponível.");
        return;
      }
      const data = (await res.json()) as { lat: number; lon: number };
      router.push(`/?lat=${data.lat}&lon=${data.lon}`);
    } catch {
      setCepError("Serviço indisponível.");
    } finally {
      setCepLoading(false);
    }
  }

  return (
    <>
      <div className="location-modal-backdrop" aria-hidden />
      <div
        className="location-modal-dialog glass rounded-3xl p-8 flex flex-col gap-6"
        role="dialog"
        aria-label="Selecionar localização"
      >
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
            onClick={handleGps}
            disabled={isLoading}
            className="text-white/[82%] day:text-ink/[82%] glass px-6 py-3 rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {gpsLoading ? "Detectando…" : "📍 Compartilhar localização"}
          </button>
          {gpsError && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {gpsError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <hr className="section-divider flex-1" />
          <span className="text-white/[32%] day:text-ink/[45%] text-xs font-light">ou</span>
          <hr className="section-divider flex-1" />
        </div>

        <form onSubmit={handleCepSubmit} className="flex flex-col items-center gap-3">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              inputMode="numeric"
              maxLength={9}
              placeholder="00000-000"
              value={cepValue}
              onChange={(e) => setCepValue(formatCep(e.target.value))}
              disabled={isLoading}
              className="text-white/[82%] day:text-ink/[82%] placeholder:text-white/[28%] day:placeholder:text-ink/[35%] glass flex-1 px-4 py-3 rounded-2xl font-light text-sm text-center bg-transparent outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !isValidCep(cepValue)}
              className="text-white/[82%] day:text-ink/[82%] glass px-5 py-3 rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {cepLoading ? "…" : "Buscar"}
            </button>
          </div>
          {cepError && (
            <p className="text-red-300/90 day:text-red-800/90 text-xs text-center max-w-xs">
              {cepError}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
