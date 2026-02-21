"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "saved_location";

interface SavedLocation {
  lat: string;
  lon: string;
}

function saveLocation(lat: string, lon: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lon }));
}

function loadLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
}

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
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [cepValue, setCepValue] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  useEffect(() => {
    setSavedLocation(loadLocation());
  }, []);

  const isLoading = gpsLoading || cepLoading;

  function handleClose() {
    if (!savedLocation) return;
    router.push(`/?lat=${savedLocation.lat}&lon=${savedLocation.lon}`);
  }

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
        saveLocation(lat, lon);
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
      const lat = String(data.lat);
      const lon = String(data.lon);
      saveLocation(lat, lon);
      router.push(`/?lat=${lat}&lon=${lon}`);
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
        className="location-modal-dialog glass rounded-3xl p-8 flex flex-col gap-6 relative"
        role="dialog"
        aria-label="Selecionar localização"
      >
        <button
          onClick={handleClose}
          disabled={!savedLocation}
          aria-label="Fechar"
          className="text-white/[32%] day:text-ink/[35%] absolute top-0 right-0 inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ minWidth: "44px", minHeight: "44px" }}
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
            onClick={handleGps}
            disabled={isLoading}
            className="text-white/[82%] day:text-ink/[82%] glass px-6 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
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
              className="text-white/[82%] day:text-ink/[82%] placeholder:text-white/[28%] day:placeholder:text-ink/[35%] glass flex-1 px-4 py-3 min-h-[44px] rounded-2xl font-light text-sm text-center bg-transparent outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !isValidCep(cepValue)}
              className="text-white/[82%] day:text-ink/[82%] glass px-5 py-3 min-h-[44px] rounded-2xl font-light text-sm cursor-pointer disabled:cursor-not-allowed transition-opacity hover:opacity-80 disabled:opacity-50"
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
